/* ==============================================================
   ARAXYS ESPORTS — FIREBASE CLOUD SYNCHRONIZATION ENGINE
   Sincronización en tiempo real con Google Cloud Firestore & Firebase Auth
   ============================================================== */

class AraxysCloudSync {
    constructor() {
        this.app = null;
        this.db = null;
        this.auth = null;
        this.authObserverAttached = false;
        this.isConnected = false;
        this.isConnecting = false;
        this.lastError = null;
        this.unsubscribers = [];
        this.isRemotePushInProgress = false; // Bandera para evitar bucles de actualización

        // Colecciones oficiales en Firestore
        this.COLLECTIONS = {
            NEWS: "araxys_news",
            PLAYERS: "araxys_players",
            STAFF: "araxys_staff",
            TRASH: "araxys_trash",
            LOGS: "araxys_activity_log"
        };
    }

    /**
     * Inicializa la conexión con Firebase usando la configuración activa
     */
    async init() {
        if (typeof firebase === "undefined") {
            console.warn("[AraxysCloud] Firebase SDK no está cargado en la ventana global.");
            this.updateUIStatus("offline", "Firebase SDK no detectado");
            return false;
        }

        const config = getActiveFirebaseConfig();
        if (!isFirebaseConfigValid(config)) {
            this.updateUIStatus("offline", "Modo Local (Firebase sin configurar)");
            return false;
        }

        this.isConnecting = true;
        this.updateUIStatus("connecting", "Conectando a Google Cloud Firestore & Auth...");

        try {
            // Inicializar la app de Firebase si aún no existe
            if (firebase.apps && firebase.apps.length > 0) {
                this.app = firebase.apps[0];
            } else {
                this.app = firebase.initializeApp(config);
            }

            this.auth = typeof firebase.auth === "function" ? firebase.auth() : null;
            this.db = firebase.firestore();

            // Probar conectividad con lectura ligera a colección pública
            await this.db.collection(this.COLLECTIONS.NEWS).where("status", "==", "publicado").limit(1).get();

            this.isConnected = true;
            this.isConnecting = false;
            this.lastError = null;
            this.updateUIStatus("connected", `Conectado a Firestore (${config.projectId})`);

            // Configurar observador de sesión de Firebase Auth
            if (this.auth && !this.authObserverAttached) {
                this.authObserverAttached = true;
                this.auth.onAuthStateChanged(async (user) => {
                    await this.handleAuthStateChanged(user);
                });
            } else {
                this.setupRealtimeListeners();
            }

            return true;
        } catch (err) {
            console.error("[AraxysCloud] Error al conectar con Firestore:", err);
            this.isConnected = false;
            this.isConnecting = false;
            this.lastError = err.message || "Error de conexión o permisos en Firestore";
            this.updateUIStatus("error", `Error: ${this.lastError}`);
            return false;
        }
    }

    /**
     * Manejador central de cambios en la sesión de Firebase Authentication
     */
    async handleAuthStateChanged(firebaseUser) {
        if (!firebaseUser) {
            console.log("[AraxysCloud] Sin sesión activa en Firebase Auth.");
            if (typeof store !== "undefined") {
                store.auth = { loggedIn: false, uid: null, email: null, user: "", role: null };
            }
            this.unsubscribeAll();
            if (typeof checkAuthStatus === "function") checkAuthStatus();
            return;
        }

        console.log("[AraxysCloud] Sesión detectada en Firebase Auth:", firebaseUser.email, firebaseUser.uid);

        try {
            const staffRef = this.db.collection(this.COLLECTIONS.STAFF).doc(firebaseUser.uid);
            let staffDoc = await staffRef.get();

            if (!staffDoc.exists) {
                // Usuario autenticado en Firebase Auth pero SIN documento en araxys_staff/{uid}.
                // CERO permisos sobre el CMS. Desconexión inmediata y terminación de sesión.
                console.warn("[AraxysCloud] Acceso denegado: Usuario sin registro en araxys_staff:", firebaseUser.email, firebaseUser.uid);
                if (typeof showToast === "function") {
                    showToast("Acceso denegado: Tu cuenta no está registrada en el personal de Araxys Esports.", "danger");
                }
                await this.auth.signOut();
                return;
            }

            const profile = staffDoc.data() || {};
            delete profile.password; // Asegurar ausencia de campos sensibles

            const cleanRole = typeof normalizeRole === "function" ? normalizeRole(profile.role, profile.team) : (profile.role || "editor");
            const roleInfo = typeof getRoleInfo === "function" ? getRoleInfo(cleanRole, profile.team) : null;
            const resolvedTeam = profile.team || (roleInfo && roleInfo.team) || null;

            if (typeof store !== "undefined") {
                store.auth = {
                    loggedIn: true,
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    user: profile.nick || firebaseUser.displayName || firebaseUser.email.split("@")[0],
                    role: cleanRole,
                    team: resolvedTeam
                };
            }

            if (typeof checkAuthStatus === "function") checkAuthStatus();
            this.setupRealtimeListeners();
        } catch (err) {
            console.error("[AraxysCloud] Error al verificar perfil de staff:", err);
            if (typeof showToast === "function") {
                showToast("Error de permisos en la base de datos: " + (err.message || ""), "danger");
            }
        }
    }

    /**
     * Iniciar sesión mediante Firebase Authentication
     */
    async signIn(email, password) {
        if (!this.auth) throw new Error("Firebase Auth no está disponible.");
        return await this.auth.signInWithEmailAndPassword(email, password);
    }

    /**
     * Cerrar sesión de Firebase Authentication
     */
    async signOut() {
        if (!this.auth) return;
        return await this.auth.signOut();
    }

    /**
     * Enviar correo de restablecimiento de contraseña
     */
    async sendPasswordReset(email) {
        if (!this.auth) throw new Error("Firebase Auth no está disponible.");
        return await this.auth.sendPasswordResetEmail(email);
    }

    /**
     * Registra un nuevo miembro del staff en Firebase Authentication mediante
     * una instancia secundaria temporal (para no desconectar al Owner/Admin activo)
     * y le envía automáticamente la invitación por correo.
     */
    async registerStaffMember({ email, nick, user, role }) {
        if (!this.isConnected || !this.db) {
            throw new Error("No hay conexión con Google Cloud Firestore.");
        }
        const currentRole = typeof normalizeRole === "function" ? normalizeRole(store.auth ? store.auth.role : null) : (store.auth ? store.auth.role : null);
        const targetRole = typeof normalizeRole === "function" ? normalizeRole(role) : role;
        if (currentRole !== "owner" && currentRole !== "admin") {
            throw new Error("Acceso denegado: Solo Owner o Administrador pueden registrar personal.");
        }
        if (currentRole !== "owner" && targetRole === "owner") {
            throw new Error("Acceso denegado: Solo el Owner puede registrar o nombrar a otro Owner.");
        }

        const config = getActiveFirebaseConfig();
        const tempAppName = "AraxysInviteApp_" + Date.now();
        const secondaryApp = firebase.initializeApp(config, tempAppName);
        const secondaryAuth = secondaryApp.auth();

        try {
            // Generar una contraseña temporal segura de 20 caracteres
            const randomBytes = new Uint8Array(20);
            crypto.getRandomValues(randomBytes);
            const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*";
            const tempPass = Array.from(randomBytes).map(b => chars[b % chars.length]).join("");

            // 1. Crear el usuario en Firebase Authentication en la app secundaria
            const cred = await secondaryAuth.createUserWithEmailAndPassword(email, tempPass);
            const newUid = cred.user.uid;

            // 2. Enviar correo oficial de restablecimiento para que el nuevo staff establezca su clave
            await secondaryAuth.sendPasswordResetEmail(email);

            // 3. Crear el documento oficial en araxys_staff indexado por su UID de Firebase Auth
            const newMember = {
                id: newUid,
                uid: newUid,
                email: email,
                nick: nick,
                user: user,
                role: role,
                status: "Activo",
                createdAt: new Date().toISOString()
            };

            await this.db.collection(this.COLLECTIONS.STAFF).doc(newUid).set(newMember);
            return newMember;
        } finally {
            // 4. Liberar memoria y destruir la instancia secundaria
            try {
                await secondaryApp.delete();
            } catch (_) {}
        }
    }

    /**
     * Configura escuchadores en tiempo real (onSnapshot) según los privilegios del rol
     */
    setupRealtimeListeners() {
        this.unsubscribeAll();

        if (!this.db || !this.isConnected) return;

        // 1. Escuchar Noticias (araxys_news) según los privilegios de Firestore Rules
        const rawRole = store.auth ? store.auth.role : null;
        const role = typeof normalizeRole === "function" ? normalizeRole(rawRole, store.auth ? store.auth.team : null) : (rawRole || "editor");
        const currentUid = store.auth ? store.auth.uid : null;
        const isPrivileged = role === "owner" || role === "admin";
        const isEditor = role === "editor";

        try {
            if (isPrivileged) {
                // Admin y Owner escuchan todas las noticias (publicadas, revisiones y borradores)
                const unsubNews = this.db.collection(this.COLLECTIONS.NEWS).onSnapshot((snapshot) => {
                    this.handleNewsSnapshot(snapshot);
                }, (err) => console.warn("[AraxysCloud] Listener de Noticias (Admin):", err));
                this.unsubscribers.push(unsubNews);
            } else if (isEditor && currentUid) {
                // Editores: escuchan noticias publicadas + sus propios borradores/revisiones
                let publishedMap = new Map();
                let draftsMap = new Map();

                const syncEditorNews = () => {
                    const combinedMap = new Map([...publishedMap, ...draftsMap]);
                    const cloudNews = Array.from(combinedMap.values());
                    cloudNews.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
                    this.isRemotePushInProgress = true;
                    store.news = cloudNews;
                    store.save("araxys_news_v2", store.news);
                    this.isRemotePushInProgress = false;
                    if (typeof renderNewsTable === "function") renderNewsTable();
                    if (typeof renderOverview === "function") renderOverview();
                };

                const unsubPub = this.db.collection(this.COLLECTIONS.NEWS)
                    .where("status", "==", "publicado")
                    .onSnapshot((snap) => {
                        publishedMap.clear();
                        snap.forEach(doc => {
                            const data = doc.data();
                            if (!data.id) data.id = doc.id;
                            publishedMap.set(data.id, data);
                        });
                        syncEditorNews();
                    }, (err) => console.warn("[AraxysCloud] Error noticias publicadas:", err));
                this.unsubscribers.push(unsubPub);

                const unsubDrafts = this.db.collection(this.COLLECTIONS.NEWS)
                    .where("authorUid", "==", currentUid)
                    .onSnapshot((snap) => {
                        draftsMap.clear();
                        snap.forEach(doc => {
                            const data = doc.data();
                            if (!data.id) data.id = doc.id;
                            draftsMap.set(data.id, data);
                        });
                        syncEditorNews();
                    }, (err) => console.warn("[AraxysCloud] Error borradores de autor:", err));
                this.unsubscribers.push(unsubDrafts);
            } else {
                // Visitantes o Coaches: solo noticias con status == 'publicado'
                const unsubNews = this.db.collection(this.COLLECTIONS.NEWS)
                    .where("status", "==", "publicado")
                    .onSnapshot((snapshot) => {
                        this.handleNewsSnapshot(snapshot);
                    }, (err) => console.warn("[AraxysCloud] Listener de Noticias (Público/Coach):", err));
                this.unsubscribers.push(unsubNews);
            }
        } catch (e) {
            console.warn(e);
        }

        // 2. Escuchar Jugadores (araxys_players) — Acceso de lectura pública
        try {
            const unsubPlayers = this.db.collection(this.COLLECTIONS.PLAYERS).onSnapshot((snapshot) => {
                if (snapshot.empty) return;
                const cloudPlayers = [];
                snapshot.forEach(doc => {
                    const data = doc.data();
                    if (!data.id) data.id = doc.id;
                    cloudPlayers.push(data);
                });

                if (cloudPlayers.length > 0) {
                    this.isRemotePushInProgress = true;
                    store.players = cloudPlayers;
                    store.save("araxys_players_v2", store.players);
                    this.isRemotePushInProgress = false;

                    if (typeof renderPlayersGrid === "function") renderPlayersGrid();
                    if (typeof renderOverview === "function") renderOverview();
                }
            }, (err) => console.warn("[AraxysCloud] Listener de Jugadores:", err));
            this.unsubscribers.push(unsubPlayers);
        } catch (e) {
            console.warn(e);
        }

        // Colecciones restringidas: SOLO escuchar si el usuario tiene rol Owner o Admin
        if (isPrivileged) {
            // 3. Escuchar Staff (araxys_staff)
            try {
                const unsubStaff = this.db.collection(this.COLLECTIONS.STAFF).onSnapshot((snapshot) => {
                    if (snapshot.empty) return;
                    const cloudStaff = [];
                    snapshot.forEach(doc => {
                        const data = doc.data();
                        if (!data.id) data.id = doc.id;
                        delete data.password; // Sin contraseñas
                        cloudStaff.push(data);
                    });

                    if (cloudStaff.length > 0) {
                        this.isRemotePushInProgress = true;
                        store.staff = cloudStaff;
                        this.isRemotePushInProgress = false;

                        if (typeof renderStaffTable === "function") renderStaffTable();
                    }
                }, (err) => console.warn("[AraxysCloud] Listener de Staff:", err));
                this.unsubscribers.push(unsubStaff);
            } catch (e) {
                console.warn(e);
            }

            // 4. Escuchar Papelera (araxys_trash)
            try {
                const unsubTrash = this.db.collection(this.COLLECTIONS.TRASH).onSnapshot((snapshot) => {
                    const cloudTrash = [];
                    snapshot.forEach(doc => {
                        const data = doc.data();
                        if (!data.id) data.id = doc.id;
                        cloudTrash.push(data);
                    });

                    this.isRemotePushInProgress = true;
                    store.trash = cloudTrash;
                    this.isRemotePushInProgress = false;

                    if (typeof renderTrashList === "function") renderTrashList();
                    if (typeof updateTrashCounters === "function") updateTrashCounters();
                }, (err) => console.warn("[AraxysCloud] Listener de Papelera:", err));
                this.unsubscribers.push(unsubTrash);
            } catch (e) {
                console.warn(e);
            }

            // 5. Escuchar Auditoría (araxys_activity_log)
            try {
                const unsubLogs = this.db.collection(this.COLLECTIONS.LOGS)
                    .orderBy("timestamp", "desc")
                    .limit(100)
                    .onSnapshot((snapshot) => {
                        if (snapshot.empty) return;
                        const cloudLogs = [];
                        snapshot.forEach(doc => {
                            cloudLogs.push(doc.data());
                        });

                        this.isRemotePushInProgress = true;
                        store.activityLog = cloudLogs;
                        this.isRemotePushInProgress = false;

                        if (typeof renderAuditLog === "function") renderAuditLog();
                    }, (err) => console.warn("[AraxysCloud] Listener de Auditoría:", err));
                this.unsubscribers.push(unsubLogs);
            } catch (e) {
                console.warn(e);
            }
        }
    }

    /**
     * Cancela todas las suscripciones activas
     */
    unsubscribeAll() {
        this.unsubscribers.forEach(unsub => {
            if (typeof unsub === "function") unsub();
        });
        this.unsubscribers = [];
    }

    /**
     * Desconecta Firebase y vuelve al modo local
     */
    disconnect() {
        this.unsubscribeAll();
        if (this.auth) {
            try { this.auth.signOut(); } catch (_) {}
        }
        this.isConnected = false;
        this.isConnecting = false;
        this.updateUIStatus("offline", "Modo Local (Desconectado de Firebase)");
    }

    // ==============================================================
    // OPERACIONES DE ESCRITURA EN FIRESTORE
    // ==============================================================

    async saveNewsDoc(newsItem) {
        if (!this.isConnected || !this.db || this.isRemotePushInProgress) return;
        try {
            await this.db.collection(this.COLLECTIONS.NEWS).doc(newsItem.id).set(newsItem, { merge: true });
        } catch (err) {
            console.error("[AraxysCloud] Error guardando noticia en Firestore:", err);
            throw err;
        }
    }

    async deleteNewsDoc(newsId) {
        if (!this.isConnected || !this.db || this.isRemotePushInProgress) return;
        try {
            await this.db.collection(this.COLLECTIONS.NEWS).doc(newsId).delete();
        } catch (err) {
            console.error("[AraxysCloud] Error borrando noticia de Firestore:", err);
            throw err;
        }
    }

    async savePlayerDoc(playerItem) {
        if (!this.isConnected || !this.db || this.isRemotePushInProgress) return;
        try {
            await this.db.collection(this.COLLECTIONS.PLAYERS).doc(playerItem.id).set(playerItem, { merge: true });
        } catch (err) {
            console.error("[AraxysCloud] Error guardando jugador en Firestore:", err);
            throw err;
        }
    }

    async deletePlayerDoc(playerId) {
        if (!this.isConnected || !this.db || this.isRemotePushInProgress) return;
        try {
            await this.db.collection(this.COLLECTIONS.PLAYERS).doc(playerId).delete();
        } catch (err) {
            console.error("[AraxysCloud] Error borrando jugador de Firestore:", err);
            throw err;
        }
    }

    async saveStaffDoc(staffItem) {
        if (!this.isConnected || !this.db || this.isRemotePushInProgress) return;
        const currentRole = typeof normalizeRole === "function" ? normalizeRole(store.auth ? store.auth.role : null) : (store.auth ? store.auth.role : null);
        const targetRole = typeof normalizeRole === "function" ? normalizeRole(staffItem.role) : staffItem.role;
        if (currentRole !== "owner" && targetRole === "owner") {
            throw new Error("Acceso denegado: Solo el Owner puede asignar privilegios de Owner.");
        }
        try {
            const cleanDoc = { ...staffItem };
            delete cleanDoc.password; // Asegurar que jamás se guarde contraseña alguna
            const docId = cleanDoc.id || cleanDoc.uid;
            await this.db.collection(this.COLLECTIONS.STAFF).doc(docId).set(cleanDoc, { merge: true });
        } catch (err) {
            console.error("[AraxysCloud] Error guardando miembro de staff en Firestore:", err);
            throw err;
        }
    }

    async deleteStaffDoc(staffId) {
        if (!this.isConnected || !this.db || this.isRemotePushInProgress) return;
        const currentRole = typeof normalizeRole === "function" ? normalizeRole(store.auth ? store.auth.role : null) : (store.auth ? store.auth.role : null);
        // Si el documento objetivo es owner y quien lo borra no es owner, bloquear en cliente
        const targetStaff = store.staff ? store.staff.find(s => s.id === staffId) : null;
        const targetRole = targetStaff ? (typeof normalizeRole === "function" ? normalizeRole(targetStaff.role) : targetStaff.role) : null;
        if (targetRole === "owner" && currentRole !== "owner") {
            throw new Error("Acceso denegado: No se puede eliminar la cuenta del Owner.");
        }
        try {
            await this.db.collection(this.COLLECTIONS.STAFF).doc(staffId).delete();
        } catch (err) {
            console.error("[AraxysCloud] Error borrando staff de Firestore:", err);
            throw err;
        }
    }

    async saveTrashDoc(trashItem) {
        if (!this.isConnected || !this.db || this.isRemotePushInProgress) return;
        try {
            await this.db.collection(this.COLLECTIONS.TRASH).doc(trashItem.id).set(trashItem);
        } catch (err) {
            console.error("[AraxysCloud] Error guardando papelera en Firestore:", err);
            throw err;
        }
    }

    async deleteTrashDoc(trashId) {
        if (!this.isConnected || !this.db || this.isRemotePushInProgress) return;
        try {
            await this.db.collection(this.COLLECTIONS.TRASH).doc(trashId).delete();
        } catch (err) {
            console.error("[AraxysCloud] Error purgando de papelera en Firestore:", err);
            throw err;
        }
    }

    async saveLogDoc(logItem) {
        if (!this.isConnected || !this.db || this.isRemotePushInProgress) return;
        try {
            await this.db.collection(this.COLLECTIONS.LOGS).doc(logItem.id).set(logItem);
        } catch (err) {
            console.error("[AraxysCloud] Error guardando log en Firestore:", err);
        }
    }

    /**
     * Procesa una instantánea de noticias de Firestore y actualiza el almacén local
     */
    handleNewsSnapshot(snapshot) {
        if (!snapshot) return;
        if (snapshot.empty && store.news && store.news.length > 0) return;
        const cloudNews = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            if (!data.id) data.id = doc.id;
            cloudNews.push(data);
        });

        if (cloudNews.length > 0) {
            cloudNews.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
            this.isRemotePushInProgress = true;
            store.news = cloudNews;
            store.save("araxys_news_v2", store.news);
            this.isRemotePushInProgress = false;

            if (typeof renderNewsTable === "function") renderNewsTable();
            if (typeof renderOverview === "function") renderOverview();
        }
    }

    /**
     * Sube todos los datos iniciales oficiales a Firestore (Seed inicial)
     */
    async seedInitialDatabase() {
        const currentRole = typeof normalizeRole === "function" ? normalizeRole(store.auth ? store.auth.role : null) : (store.auth ? store.auth.role : null);
        if (currentRole !== "owner" && currentRole !== "admin") {
            throw new Error("Acceso denegado: solo Administradores y Owners pueden sincronizar la base de datos en la nube.");
        }

        if (!this.isConnected || !this.db) {
            throw new Error("No hay conexión activa con Google Cloud Firestore.");
        }

        const batch = this.db.batch();
        let totalOps = 0;

        // 1. Noticias (6 artículos reales)
        (store.news || []).forEach(item => {
            const ref = this.db.collection(this.COLLECTIONS.NEWS).doc(item.id);
            batch.set(ref, item);
            totalOps++;
        });

        // 2. Jugadores (26 jugadores reales de 6 divisiones)
        (store.players || []).forEach(item => {
            const ref = this.db.collection(this.COLLECTIONS.PLAYERS).doc(item.id);
            batch.set(ref, item);
            totalOps++;
        });

        // 3. Staff oficial indexado por el UID activo autenticado en Firebase Auth
        const currentUid = this.auth && this.auth.currentUser ? this.auth.currentUser.uid : null;
        if (!currentUid) {
            throw new Error("Debes haber iniciado sesión con tu cuenta en Firebase Auth antes de inicializar la base de datos.");
        }
        const currentEmail = this.auth.currentUser.email || "krys@araxysesports.com";
        const staffRef = this.db.collection(this.COLLECTIONS.STAFF).doc(currentUid);
        batch.set(staffRef, {
            id: currentUid,
            uid: currentUid,
            email: currentEmail,
            nick: "Krys",
            user: "krys",
            role: "owner",
            status: "Activo",
            createdAt: new Date().toISOString()
        }, { merge: true });
        totalOps++;

        // 4. Registro de auditoría inicial
        const logRef = this.db.collection(this.COLLECTIONS.LOGS).doc("log-seed-cloud");
        batch.set(logRef, {
            id: "log-seed-cloud",
            timestamp: new Date().toISOString(),
            user: store.auth.user || "Krys",
            role: store.auth.role || "owner",
            action: "SINCRONIZACIÓN NUBE",
            detail: `Carga inicial oficial de base de datos a Google Cloud Firestore (${totalOps} elementos sincronizados).`
        });
        totalOps++;

        await batch.commit();
        return totalOps;
    }

    /**
     * Actualiza el indicador visual de estado en el Topbar y en el Modal
     */
    updateUIStatus(status, text) {
        const badge = document.getElementById("cloudStatusBadge");
        const banner = document.getElementById("cloudStatusBanner");
        const textEl = badge ? badge.querySelector(".status-text") : null;

        if (badge) {
            badge.className = `cloud-status-pill ${status}`;
            if (textEl) textEl.textContent = text;
            const currentRole = typeof normalizeRole === "function" ? normalizeRole(store.auth ? store.auth.role : null) : (store.auth ? store.auth.role : null);
            const isPrivileged = currentRole === "owner" || currentRole === "admin";
            badge.style.display = isPrivileged ? "inline-flex" : "none";
        }

        if (banner) {
            banner.className = `cloud-banner ${status}`;
            const titleEl = banner.querySelector(".cloud-banner-title");
            const subEl = banner.querySelector(".cloud-banner-sub");
            if (status === "connected") {
                if (titleEl) titleEl.textContent = "🟢 Conectado a Google Cloud Firestore";
                if (subEl) subEl.textContent = text;
            } else if (status === "connecting") {
                if (titleEl) titleEl.textContent = "🟡 Conectando con Firebase...";
                if (subEl) subEl.textContent = text;
            } else if (status === "error") {
                if (titleEl) titleEl.textContent = "🔴 Error de Conexión en Firestore";
                if (subEl) subEl.textContent = text;
            } else {
                if (titleEl) titleEl.textContent = "⚪ Modo Local (Offline)";
                if (subEl) subEl.textContent = text;
            }
        }
    }
}

// Instancia global del motor en la nube
window.araxysCloud = new AraxysCloudSync();
