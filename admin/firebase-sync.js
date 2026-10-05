/* ==============================================================
   ARAXYS ESPORTS — FIREBASE CLOUD SYNCHRONIZATION ENGINE
   Sincronización bidireccional en tiempo real con Google Cloud Firestore
   ============================================================== */

class AraxysCloudSync {
    constructor() {
        this.app = null;
        this.db = null;
        this.isConnected = false;
        this.isConnecting = false;
        this.lastError = null;
        this.unsubscribers = [];
        this.isRemotePushInProgress = false; // Bandera para evitar bucles infinitos

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
        this.updateUIStatus("connecting", "Conectando a Google Cloud Firestore...");

        try {
            // Inicializar la app de Firebase si aún no existe
            if (firebase.apps && firebase.apps.length > 0) {
                this.app = firebase.apps[0];
            } else {
                this.app = firebase.initializeApp(config);
            }

            this.db = firebase.firestore();

            // Probar conectividad con lectura ligera
            await this.db.collection(this.COLLECTIONS.NEWS).limit(1).get();

            this.isConnected = true;
            this.isConnecting = false;
            this.lastError = null;
            this.updateUIStatus("connected", `Conectado a Firestore (${config.projectId})`);

            // Activar listeners en tiempo real
            this.setupRealtimeListeners();
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
     * Configura escuchadores en tiempo real (onSnapshot) para todas las colecciones
     */
    setupRealtimeListeners() {
        this.unsubscribeAll();

        if (!this.db || !this.isConnected) return;

        // 1. Escuchar Noticias (araxys_news)
        try {
            const unsubNews = this.db.collection(this.COLLECTIONS.NEWS).onSnapshot((snapshot) => {
                if (snapshot.empty && store.news && store.news.length > 0) {
                    console.log("[AraxysCloud] Colección de noticias vacía en la nube.");
                    return;
                }
                const cloudNews = [];
                snapshot.forEach(doc => {
                    const data = doc.data();
                    if (!data.id) data.id = doc.id;
                    cloudNews.push(data);
                });

                if (cloudNews.length > 0) {
                    // Ordenar por fecha descendente
                    cloudNews.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
                    this.isRemotePushInProgress = true;
                    store.news = cloudNews;
                    store.save("araxys_news_v2", store.news);
                    this.isRemotePushInProgress = false;

                    if (typeof renderNewsTable === "function") renderNewsTable();
                    if (typeof renderOverview === "function") renderOverview();
                }
            }, (err) => console.warn("[AraxysCloud] Listener de Noticias falló:", err));
            this.unsubscribers.push(unsubNews);
        } catch (e) {
            console.warn(e);
        }

        // 2. Escuchar Jugadores (araxys_players)
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
            }, (err) => console.warn("[AraxysCloud] Listener de Jugadores falló:", err));
            this.unsubscribers.push(unsubPlayers);
        } catch (e) {
            console.warn(e);
        }

        // 3. Escuchar Staff (araxys_staff)
        try {
            const unsubStaff = this.db.collection(this.COLLECTIONS.STAFF).onSnapshot((snapshot) => {
                if (snapshot.empty) return;
                const cloudStaff = [];
                snapshot.forEach(doc => {
                    const data = doc.data();
                    if (!data.id) data.id = doc.id;
                    cloudStaff.push(data);
                });

                if (cloudStaff.length > 0) {
                    this.isRemotePushInProgress = true;
                    store.staff = cloudStaff;
                    store.save("araxys_staff_clean_v1", store.staff);
                    this.isRemotePushInProgress = false;

                    if (typeof renderStaffTable === "function") renderStaffTable();
                }
            }, (err) => console.warn("[AraxysCloud] Listener de Staff falló:", err));
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
                store.save("araxys_trash_v1", store.trash);
                this.isRemotePushInProgress = false;

                if (typeof renderTrashList === "function") renderTrashList();
                if (typeof updateTrashCounters === "function") updateTrashCounters();
            }, (err) => console.warn("[AraxysCloud] Listener de Papelera falló:", err));
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
                    store.save("araxys_activity_log_v1", store.activityLog);
                    this.isRemotePushInProgress = false;

                    if (typeof renderAuditLog === "function") renderAuditLog();
                }, (err) => console.warn("[AraxysCloud] Listener de Auditoría falló:", err));
            this.unsubscribers.push(unsubLogs);
        } catch (e) {
            console.warn(e);
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
     * Desconecta Firebase y vuelve al modo local seguro
     */
    disconnect() {
        this.unsubscribeAll();
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
        }
    }

    async deleteNewsDoc(newsId) {
        if (!this.isConnected || !this.db || this.isRemotePushInProgress) return;
        try {
            await this.db.collection(this.COLLECTIONS.NEWS).doc(newsId).delete();
        } catch (err) {
            console.error("[AraxysCloud] Error borrando noticia de Firestore:", err);
        }
    }

    async savePlayerDoc(playerItem) {
        if (!this.isConnected || !this.db || this.isRemotePushInProgress) return;
        try {
            await this.db.collection(this.COLLECTIONS.PLAYERS).doc(playerItem.id).set(playerItem, { merge: true });
        } catch (err) {
            console.error("[AraxysCloud] Error guardando jugador en Firestore:", err);
        }
    }

    async deletePlayerDoc(playerId) {
        if (!this.isConnected || !this.db || this.isRemotePushInProgress) return;
        try {
            await this.db.collection(this.COLLECTIONS.PLAYERS).doc(playerId).delete();
        } catch (err) {
            console.error("[AraxysCloud] Error borrando jugador de Firestore:", err);
        }
    }

    async saveStaffDoc(staffItem) {
        if (!this.isConnected || !this.db || this.isRemotePushInProgress) return;
        try {
            await this.db.collection(this.COLLECTIONS.STAFF).doc(staffItem.id).set(staffItem, { merge: true });
        } catch (err) {
            console.error("[AraxysCloud] Error guardando miembro de staff en Firestore:", err);
        }
    }

    async deleteStaffDoc(staffId) {
        if (!this.isConnected || !this.db || this.isRemotePushInProgress) return;
        try {
            await this.db.collection(this.COLLECTIONS.STAFF).doc(staffId).delete();
        } catch (err) {
            console.error("[AraxysCloud] Error borrando staff de Firestore:", err);
        }
    }

    async saveTrashDoc(trashItem) {
        if (!this.isConnected || !this.db || this.isRemotePushInProgress) return;
        try {
            await this.db.collection(this.COLLECTIONS.TRASH).doc(trashItem.id).set(trashItem);
        } catch (err) {
            console.error("[AraxysCloud] Error guardando papelera en Firestore:", err);
        }
    }

    async deleteTrashDoc(trashId) {
        if (!this.isConnected || !this.db || this.isRemotePushInProgress) return;
        try {
            await this.db.collection(this.COLLECTIONS.TRASH).doc(trashId).delete();
        } catch (err) {
            console.error("[AraxysCloud] Error purgando de papelera en Firestore:", err);
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
     * Sube todos los datos locales oficiales actuales a Firestore (Seed inicial)
     */
    async seedInitialDatabase() {
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

        // 3. Staff oficial (Krys)
        (store.staff || []).forEach(item => {
            const ref = this.db.collection(this.COLLECTIONS.STAFF).doc(item.id);
            batch.set(ref, item);
            totalOps++;
        });

        // 4. Registro de auditoría inicial
        const logRef = this.db.collection(this.COLLECTIONS.LOGS).doc("log-seed-cloud");
        batch.set(logRef, {
            id: "log-seed-cloud",
            timestamp: new Date().toISOString(),
            user: store.auth.user || "Krys",
            role: "admin",
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
        const dot = badge ? badge.querySelector(".status-dot") : null;
        const textEl = badge ? badge.querySelector(".status-text") : null;

        if (badge) {
            badge.className = `cloud-status-pill ${status}`;
            if (textEl) textEl.textContent = text;
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
