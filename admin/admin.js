/* ==============================================================
   ARAXYS ESPORTS — ADMIN CMS & DASHBOARD JAVASCRIPT
   Controlador interactivo para la gestión de Noticias y Rosters
   ============================================================== */

// DATOS REALES DE ARAXYS ESPORTS (Extraídos directamente de la página oficial)
const INITIAL_NEWS = [
    {
        id: "noticia-1",
        title: "ARAXYS Y KITSUNE UNEN FUERZAS",
        slug: "noticia1.html",
        category: "COLABORACION",
        author: "Prensa Araxys",
        date: "2026-08-10",
        status: "publicado",
        image: "../img/news/araxys-kitsune-20260810.webp",
        excerpt: "Araxys Esports y Kitsune Community comienzan una nueva etapa para acercar comunidades y crear proyectos en conjunto.",
        content: "Araxys Esports y Kitsune Community comienzan una nueva etapa para acercar comunidades y crear proyectos en conjunto. A traves de esta colaboracion buscaremos impulsar eventos y torneos para todos los jugadores."
    },
    {
        id: "noticia-2",
        title: "COMIENZA EL RECLUTAMIENTO",
        slug: "noticia2.html",
        category: "RECLUTAMIENTO",
        author: "Staff Araxys",
        date: "2026-08-01",
        status: "publicado",
        image: "../img/news/noticia2.webp",
        excerpt: "Las postulaciones ya estan abiertas y los primeros integrantes comienzan a dar forma a la comunidad de Araxys Esports.",
        content: "Las postulaciones ya estan abiertas y los primeros integrantes comienzan a dar forma a la comunidad de Araxys Esports. Buscamos jugadores dedicados que quieran superarse y competir al mas alto nivel."
    },
    {
        id: "noticia-3",
        title: "ARAXYS ABRE EL RECLUTAMIENTO DE STAFF",
        slug: "noticia3.html",
        category: "STAFF",
        author: "Dirección Deportiva",
        date: "2026-07-25",
        status: "publicado",
        image: "../img/news/noticia3.webp",
        excerpt: "La comunidad busca nuevos integrantes que quieran colaborar en el crecimiento del proyecto desde dentro de la organizacion.",
        content: "La comunidad busca nuevos integrantes que quieran colaborar en el crecimiento del proyecto desde dentro de la organizacion. Buscamos personas responsables y comprometidas con el trabajo en equipo."
    },
    {
        id: "noticia-4",
        title: "LOS CREADORES TAMBIEN COMPITEN",
        slug: "noticia4.html",
        category: "STREAMERS",
        author: "Prensa Araxys",
        date: "2026-07-15",
        status: "publicado",
        image: "../img/news/noticia4.webp",
        excerpt: "Los rosters para creadores de contenido abren sus puertas con el objetivo de reunir a streamers y creadores que quieran crecer junto a una comunidad.",
        content: "Araxys Esports continua ampliando sus areas y anuncia oficialmente la apertura de los rosters para creadores de contenido. Este espacio esta pensado para streamers, youtubers y tiktokers."
    },
    {
        id: "noticia-5",
        title: "SE ANUNCIAN LAS FECHAS DE LOS PROXIMOS TORNEOS",
        slug: "noticia5.html",
        category: "TORNEOS",
        author: "Comité de Torneos",
        date: "2026-07-05",
        status: "publicado",
        image: "../img/news/noticia5.webp",
        excerpt: "La comunidad se prepara para una nueva serie de competiciones donde jugadores y equipos podran demostrar su nivel.",
        content: "Tras las primeras semanas de crecimiento de la comunidad, Araxys Esports anuncia oficialmente el calendario de sus proximos torneos con premios y transmisiones en vivo."
    },
    {
        id: "noticia-6",
        title: "UN VISTAZO AL FUTURO",
        slug: "noticia6.html",
        category: "ANUNCIOS",
        author: "CEO Araxys",
        date: "2026-06-20",
        status: "publicado",
        image: "../img/news/noticia6.webp",
        excerpt: "Nuevos proyectos, mas competiciones y una comunidad en constante crecimiento marcaran el proximo capitulo de Araxys Esports.",
        content: "Durante los proximos meses continuaremos ampliando la organizacion con nuevas iniciativas pensadas para fortalecer cada una de las areas que forman parte de Araxys Esports."
    }
];

const INITIAL_PLAYERS = [
    // Roster Titular
    { id: "p1", team: "titular", nick: "Krys", role: "IGL / Capitán", agent: "Omen", photo: "../img/equipos/equipos.webp", twitter: "@IsKrys", tracker: "Krys#AX" },
    { id: "p2", team: "titular", nick: "ViperX", role: "Duelista", agent: "Jett", photo: "../img/equipos/equipos.webp", twitter: "@AraxysEsports", tracker: "" },
    { id: "p3", team: "titular", nick: "Shadow", role: "Iniciador", agent: "Sova", photo: "../img/equipos/equipos.webp", twitter: "", tracker: "" },
    { id: "p4", team: "titular", nick: "Spectre", role: "Centinela", agent: "Cypher", photo: "../img/equipos/equipos.webp", twitter: "", tracker: "" },
    { id: "p5", team: "titular", nick: "Apex", role: "Controlador", agent: "Brimstone", photo: "../img/equipos/equipos.webp", twitter: "", tracker: "" },
    
    // Roster Prime
    { id: "p6", team: "prime", nick: "Chiflesinho", role: "Capitán", agent: "Duelista", photo: "../img/equipos/equipos.webp", twitter: "", tracker: "" },
    { id: "p7", team: "prime", nick: "Andrew", role: "Iniciador", agent: "Fade", photo: "../img/equipos/equipos.webp", twitter: "", tracker: "" },
    { id: "p8", team: "prime", nick: "HolaDan", role: "Controlador", agent: "Astra", photo: "../img/equipos/equipos.webp", twitter: "", tracker: "" },
    { id: "p9", team: "prime", nick: "Tato", role: "Centinela", agent: "Killjoy", photo: "../img/equipos/equipos.webp", twitter: "", tracker: "" },
    { id: "p10", team: "prime", nick: "Reclutando", role: "Por Definir", agent: "Flexible", photo: "../img/equipos/equipos.webp", twitter: "", tracker: "" },

    // Roster Vanguard
    { id: "p11", team: "vanguard", nick: "Striker", role: "Duelista", agent: "Reyna", photo: "../img/equipos/equipos.webp", twitter: "", tracker: "" },
    { id: "p12", team: "vanguard", nick: "Pulse", role: "Iniciador", agent: "Breach", photo: "../img/equipos/equipos.webp", twitter: "", tracker: "" },
    { id: "p13", team: "vanguard", nick: "Chronos", role: "Controlador", agent: "Viper", photo: "../img/equipos/equipos.webp", twitter: "", tracker: "" },
    { id: "p14", team: "vanguard", nick: "Blaze", role: "Centinela", agent: "Sage", photo: "../img/equipos/equipos.webp", twitter: "", tracker: "" },
    { id: "p15", team: "vanguard", nick: "Zenith", role: "Flex", agent: "KAY/O", photo: "../img/equipos/equipos.webp", twitter: "", tracker: "" },

    // Roster Wolf
    { id: "p16", team: "wolf", nick: "Fang", role: "Capitán", agent: "Sova", photo: "../img/equipos/equipos.webp", twitter: "", tracker: "" },
    { id: "p17", team: "wolf", nick: "Hunter", role: "Duelista", agent: "Raze", photo: "../img/equipos/equipos.webp", twitter: "", tracker: "" },
    { id: "p18", team: "wolf", nick: "Ghost", role: "Controlador", agent: "Clove", photo: "../img/equipos/equipos.webp", twitter: "", tracker: "" },
    { id: "p19", team: "wolf", nick: "Frost", role: "Centinela", agent: "Deadlock", photo: "../img/equipos/equipos.webp", twitter: "", tracker: "" },
    { id: "p20", team: "wolf", nick: "Lobo", role: "Iniciador", agent: "Gekko", photo: "../img/equipos/equipos.webp", twitter: "", tracker: "" },

    // Roster Nexus (División Sorpresa)
    { id: "p21", team: "nexus", nick: "Próximamente", role: "Roster Secreto", agent: "Por Anunciar", photo: "../img/equipos/equipos.webp", twitter: "@AraxysEsports", tracker: "" }
];

const TEAM_DETAILS = {
    titular: {
        name: "ARAXYS TITULAR",
        badge: "ROSTER PRINCIPAL",
        desc: "El equipo estelar que representa la bandera de Araxys Esports en Valorant."
    },
    prime: {
        name: "ARAXYS PRIME",
        badge: "DIVISIÓN COMPETITIVA EN ASCENSO",
        desc: "Capitaneado por Chiflesinho. El equipo con el mejor ambiente y competitividad de la comunidad de Araxys Esports."
    },
    vanguard: {
        name: "ARAXYS VANGUARD",
        badge: "DIVISIÓN DE DESARROLLO",
        desc: "Roster enfocado en el avance estratégico y dominio del juego en todos los aspectos competitivos."
    },
    wolf: {
        name: "ARAXYS WOLF",
        badge: "DIVISIÓN COMPETITIVA",
        desc: "La manada mas competitiva y audaz de la comunidad de Araxys Esports."
    },
    nexus: {
        name: "ARAXYS NEXUS",
        badge: "DIVISIÓN SORPRESA",
        desc: "El roster que tomara por sorpresa a la comunidad de Valorant y Araxys Esports."
    }
};

const ROLE_DEFINITIONS = {
    admin: { label: "CEO / Administrador", scope: "Control Total de la Organización", badge: "👑 CEO", color: "var(--brand-magenta)" },
    editor: { label: "Prensa & Redacción", scope: "Solo Noticias y Artículos", badge: "📰 Editor", color: "#00D1FF" },
    coach_prime: { label: "Coach / Capitán Prime", scope: "Solo Roster Araxys Prime", badge: "🎯 Prime", team: "prime", color: "var(--brand-gold)" },
    coach_titular: { label: "Coach / Capitán Titular", scope: "Solo Roster Araxys Titular", badge: "🛡️ Titular", team: "titular", color: "var(--brand-magenta)" },
    coach_vanguard: { label: "Coach / Capitán Vanguard", scope: "Solo Roster Araxys Vanguard", badge: "⚡ Vanguard", team: "vanguard", color: "#00D1FF" },
    coach_wolf: { label: "Coach / Capitán Wolf", scope: "Solo Roster Araxys Wolf", badge: "🐺 Wolf", team: "wolf", color: "#A855F7" },
    coach_nexus: { label: "Coach / Capitán Nexus", scope: "Solo Roster Araxys Nexus", badge: "🔮 Nexus", team: "nexus", color: "#FF4655" }
};

const INITIAL_STAFF = [
    { id: "s1", nick: "Krys", user: "krys", role: "admin", status: "Activo" }
];

// ==============================================================
// GESTIÓN DE ESTADO (LOCALSTORAGE)
// ==============================================================
class AdminStore {
    constructor() {
        // Migración automática a v2 con datos oficiales 100% reales de Araxys Esports
        const savedNews = this.load("araxys_news_v2", null);
        if (!savedNews) {
            this.news = INITIAL_NEWS;
            this.saveNews();
        } else {
            this.news = savedNews;
        }

        const savedPlayers = this.load("araxys_players_v2", null);
        if (!savedPlayers) {
            this.players = INITIAL_PLAYERS;
            this.savePlayers();
        } else {
            this.players = savedPlayers;
        }

        const savedStaff = this.load("araxys_staff_clean_v1", null);
        if (!savedStaff) {
            this.staff = INITIAL_STAFF;
            this.saveStaff();
        } else {
            this.staff = savedStaff;
        }

        this.trash = this.load("araxys_trash_v1", []);
        this.activityLog = this.load("araxys_activity_log_v1", [
            {
                id: "log-seed-1",
                timestamp: new Date().toISOString(),
                user: "Krys",
                role: "admin",
                action: "INICIALIZACIÓN",
                detail: "Sincronización oficial del CMS Araxys con 6 noticias, 5 divisiones y visor de auditoría.",
                snapshot: null
            }
        ]);

        this.auth = this.load("araxys_admin_auth", { loggedIn: false, user: "Krys", role: "admin" });
    }

    load(key, fallback) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : fallback;
        } catch {
            return fallback;
        }
    }

    save(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    saveNews() { this.save("araxys_news_v2", this.news); }
    savePlayers() { this.save("araxys_players_v2", this.players); }
    saveStaff() { this.save("araxys_staff_clean_v1", this.staff); }
    saveTrash() { this.save("araxys_trash_v1", this.trash); }
    saveActivityLog() { this.save("araxys_activity_log_v1", this.activityLog); }
    saveAuth() { this.save("araxys_admin_auth", this.auth); }

    logAction(action, detail, snapshot = null) {
        const entry = {
            id: "log-" + Date.now() + "-" + Math.random().toString(36).substr(2, 4),
            timestamp: new Date().toISOString(),
            user: this.auth.user || "Staff Araxys",
            role: this.auth.role || "admin",
            action: action,
            detail: detail,
            snapshot: snapshot
        };
        this.activityLog.unshift(entry);
        if (this.activityLog.length > 150) this.activityLog.pop();
        this.saveActivityLog();
        if (typeof renderAuditLog === "function") renderAuditLog();
        if (typeof updateTrashCounters === "function") updateTrashCounters();
    }

    moveToTrash(type, item) {
        const trashItem = {
            id: "trash-" + Date.now(),
            type: type, // "news" o "player"
            title: item.title || item.nick,
            subtitle: type === "news" ? (`Cat: ${item.category || "General"} • Autor: ${item.author || "Prensa"}`) : (`Equipo: ${item.team?.toUpperCase()} • Rol: ${item.role}`),
            deletedBy: this.auth.user || "Staff Araxys",
            deletedByRole: this.auth.role || "admin",
            deletedAt: new Date().toISOString(),
            data: { ...item }
        };
        this.trash.unshift(trashItem);
        this.saveTrash();
        this.logAction("ELIMINACIÓN", `Se envió a la papelera: "${trashItem.title}" (${type === "news" ? "Noticia" : "Jugador"})`, item);
        if (typeof renderTrashList === "function") renderTrashList();
        if (typeof updateTrashCounters === "function") updateTrashCounters();
    }

    restoreFromTrash(trashId) {
        const idx = this.trash.findIndex(t => t.id === trashId);
        if (idx === -1) return false;
        const trashItem = this.trash[idx];

        if (trashItem.type === "news") {
            const exists = this.news.some(n => n.id === trashItem.data.id);
            if (!exists) {
                this.news.unshift(trashItem.data);
            } else {
                trashItem.data.id = "noticia-rest-" + Date.now();
                this.news.unshift(trashItem.data);
            }
            this.saveNews();
            if (typeof renderNewsTable === "function") renderNewsTable();
            if (typeof renderOverview === "function") renderOverview();
        } else if (trashItem.type === "player") {
            const exists = this.players.some(p => p.id === trashItem.data.id);
            if (!exists) {
                this.players.unshift(trashItem.data);
            } else {
                trashItem.data.id = "p-rest-" + Date.now();
                this.players.unshift(trashItem.data);
            }
            this.savePlayers();
            if (typeof renderPlayersGrid === "function") renderPlayersGrid();
            if (typeof renderOverview === "function") renderOverview();
        }

        this.trash.splice(idx, 1);
        this.saveTrash();
        this.logAction("RESTAURACIÓN", `El Administrador restauró "${trashItem.title}" a la página oficial.`, trashItem.data);
        if (typeof renderTrashList === "function") renderTrashList();
        if (typeof updateTrashCounters === "function") updateTrashCounters();
        return true;
    }

    purgeTrashItem(trashId) {
        const idx = this.trash.findIndex(t => t.id === trashId);
        if (idx === -1) return false;
        const trashItem = this.trash[idx];
        this.trash.splice(idx, 1);
        this.saveTrash();
        this.logAction("PURGA", `Se eliminó definitivamente de la papelera: "${trashItem.title}".`);
        if (typeof renderTrashList === "function") renderTrashList();
        if (typeof updateTrashCounters === "function") updateTrashCounters();
        return true;
    }

    clearTrash() {
        const count = this.trash.length;
        if (count === 0) return;
        this.trash = [];
        this.saveTrash();
        this.logAction("PURGA TOTAL", `El Administrador vació la papelera por completo (${count} elementos purgados).`);
        if (typeof renderTrashList === "function") renderTrashList();
        if (typeof updateTrashCounters === "function") updateTrashCounters();
    }
}

const store = new AdminStore();

// ==============================================================
// NOTIFICACIONES TOAST
// ==============================================================
function showToast(message, type = "success") {
    const container = document.getElementById("toastContainer");
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span>${type === "success" ? "✓" : "⚠️"}</span> <span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => toast.remove(), 300);
    }, 3200);
}

// ==============================================================
// GESTOR DE AUTENTICACIÓN
// ==============================================================
const loginOverlay = document.getElementById("loginOverlay");
const loginForm = document.getElementById("loginForm");
const demoAccessBtn = document.getElementById("demoAccessBtn");
const logoutBtn = document.getElementById("logoutBtn");

function applyRolePermissions() {
    const role = store.auth.role || "admin";
    const roleInfo = ROLE_DEFINITIONS[role] || ROLE_DEFINITIONS.admin;

    const userNameEl = document.getElementById("sidebarUserName");
    const userRoleEl = document.getElementById("sidebarUserRole");
    if (userNameEl) userNameEl.textContent = store.auth.user || "Staff Araxys";
    if (userRoleEl) {
        userRoleEl.textContent = roleInfo.label;
        userRoleEl.style.color = roleInfo.color;
    }

    // Resetear visibilidad de elementos del menú y pestañas de equipo
    document.querySelectorAll(".nav-item").forEach(item => item.style.display = "flex");
    document.querySelectorAll(".team-tab-btn").forEach(btn => btn.style.display = "inline-block");

    const quickBtn = document.getElementById("quickNewNewsBtn");
    const overviewNewsCard = document.getElementById("overviewNewsCard");
    const overviewTeamsCard = document.getElementById("overviewTeamsCard");
    if (overviewNewsCard) overviewNewsCard.style.display = "block";
    if (overviewTeamsCard) overviewTeamsCard.style.display = "block";

    if (role.startsWith("coach_")) {
        const myTeam = roleInfo.team;
        // Ocultar secciones y tarjetas no autorizadas para coaches
        const navNews = document.getElementById("navItemNews");
        const navTournaments = document.getElementById("navItemTournaments");
        const navBranding = document.getElementById("navItemBranding");
        const navStaff = document.getElementById("navItemStaff");
        const navAudit = document.getElementById("navItemAudit");
        if (navNews) navNews.style.display = "none";
        if (navTournaments) navTournaments.style.display = "none";
        if (navBranding) navBranding.style.display = "none";
        if (navStaff) navStaff.style.display = "none";
        if (navAudit) navAudit.style.display = "none";
        if (overviewNewsCard) overviewNewsCard.style.display = "none";

        // En la sección de equipos, solo mostrar su propio equipo
        document.querySelectorAll(".team-tab-btn").forEach(btn => {
            if (btn.getAttribute("data-team") !== myTeam) {
                btn.style.display = "none";
            } else {
                btn.classList.add("active");
            }
        });

        // Modificar botón del topbar: PARA COACHES ES "AÑADIR JUGADOR", NO NOTICIA
        if (quickBtn) {
            quickBtn.innerHTML = `<span>+ Añadir Jugador (${myTeam.toUpperCase()})</span>`;
            quickBtn.onclick = (e) => {
                e.preventDefault();
                switchTab("tab-teams");
                openAddPlayerModal();
            };
        }

        currentSelectedTeam = myTeam;
        switchTab("tab-teams");
        renderPlayersGrid();
    } else if (role === "editor") {
        // Redactor: solo noticias, torneos y recursos
        const navTeams = document.getElementById("navItemTeams");
        const navStaff = document.getElementById("navItemStaff");
        const navAudit = document.getElementById("navItemAudit");
        if (navTeams) navTeams.style.display = "none";
        if (navStaff) navStaff.style.display = "none";
        if (navAudit) navAudit.style.display = "none";
        if (overviewTeamsCard) overviewTeamsCard.style.display = "none";

        if (quickBtn) {
            quickBtn.innerHTML = "<span>+ Nueva Noticia</span>";
            quickBtn.onclick = (e) => {
                e.preventDefault();
                switchTab("tab-news");
                openCreateNewsModal();
            };
        }
        switchTab("tab-news");
    } else {
        // CEO / Administrador: acceso total
        const playerTeamSelect = document.getElementById("playerTeam");
        if (playerTeamSelect) {
            Array.from(playerTeamSelect.options).forEach(opt => opt.disabled = false);
        }

        if (quickBtn) {
            quickBtn.innerHTML = "<span>+ Nueva Noticia</span>";
            quickBtn.onclick = (e) => {
                e.preventDefault();
                switchTab("tab-news");
                openCreateNewsModal();
            };
        }
    }
}

function checkAuthStatus() {
    if (store.auth.loggedIn) {
        loginOverlay.classList.add("hidden");
        applyRolePermissions();
    } else {
        loginOverlay.classList.remove("hidden");
    }
}

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const inputVal = document.getElementById("loginEmail").value.trim().toLowerCase();
    const passVal = document.getElementById("loginPassword").value.trim();
    
    // Buscar si coincide con algún usuario registrado en el staff
    const found = store.staff.find(s => s.user.toLowerCase() === inputVal || s.nick.toLowerCase() === inputVal);
    
    if (found) {
        if (found.password && found.password !== passVal) {
            showToast("Contraseña incorrecta para este usuario.", "danger");
            return;
        }
        store.auth = { loggedIn: true, user: found.nick, role: found.role };
    } else if (inputVal === "krys" || inputVal === "diego" || inputVal === "admin") {
        // Acceso maestro directo para el CEO
        store.auth = { loggedIn: true, user: "Krys", role: "admin" };
    } else {
        showToast("Usuario no reconocido. Solicita acceso al CEO de Araxys Esports.", "danger");
        return;
    }
    
    store.saveAuth();
    checkAuthStatus();
    showToast(`¡Bienvenido al Centro de Mando, ${store.auth.user}!`);
});

logoutBtn.addEventListener("click", () => {
    store.auth = { loggedIn: false, user: "", role: "admin" };
    store.saveAuth();
    checkAuthStatus();
    showToast("Sesión cerrada correctamente.", "danger");
});

// ==============================================================
// NAVEGACIÓN POR PESTAÑAS
// ==============================================================
const navItems = document.querySelectorAll(".nav-item");
const tabPanes = document.querySelectorAll(".tab-pane");
const pageTitle = document.getElementById("pageTitle");

const TAB_TITLES = {
    "tab-overview": "Resumen General",
    "tab-news": "Gestor de Noticias & Prensa",
    "tab-teams": "Rosters & Jugadores de Valorant",
    "tab-tournaments": "Torneos & Circuito Competitivo",
    "tab-branding": "Kit de Marca & Recursos Oficiales",
    "tab-staff": "Gestión de Staff & Permisos",
    "tab-audit": "Auditoría, Historial de Cambios & Papelera"
};

function switchTab(tabId) {
    const role = store.auth.role || "admin";
    const roleInfo = ROLE_DEFINITIONS[role] || ROLE_DEFINITIONS.admin;

    // Validación estricta de navegación según rol
    if (tabId === "tab-audit" && role !== "admin") {
        showToast("Acceso denegado: Solo el CEO puede acceder a Auditoría y Papelera.", "danger");
        tabId = "tab-overview";
    } else if (role.startsWith("coach_")) {
        const allowed = ["tab-teams", "tab-overview"];
        if (!allowed.includes(tabId)) {
            showToast(`Acceso denegado: Los coaches solo gestionan su equipo (${roleInfo.team.toUpperCase()}).`, "danger");
            tabId = "tab-teams";
        }
    } else if (role === "editor") {
        const allowed = ["tab-news", "tab-tournaments", "tab-branding", "tab-overview"];
        if (!allowed.includes(tabId)) {
            showToast(`Acceso denegado: Los redactores tienen acceso a Noticias, Torneos y Recursos.`, "danger");
            tabId = "tab-news";
        }
    }

    if (tabId === "tab-audit") {
        renderTrashList();
        renderAuditLog();
    }

    navItems.forEach(item => {
        item.classList.toggle("active", item.getAttribute("data-tab") === tabId);
    });

    tabPanes.forEach(pane => {
        pane.classList.toggle("active", pane.id === tabId);
    });

    pageTitle.textContent = TAB_TITLES[tabId] || "Centro de Mando";
}

navItems.forEach(btn => {
    btn.addEventListener("click", () => {
        const target = btn.getAttribute("data-tab");
        switchTab(target);
    });
});

document.querySelectorAll(".switch-to-tab").forEach(btn => {
    btn.addEventListener("click", () => {
        const target = btn.getAttribute("data-target");
        switchTab(target);
    });
});

// ==============================================================
// RENDERIZADO: RESUMEN / DASHBOARD
// ==============================================================
function renderOverview() {
    document.getElementById("kpiNewsTotal").textContent = store.news.length;
    document.getElementById("kpiPlayersTotal").textContent = store.players.length;
    const kpiTeams = document.getElementById("kpiTeamsTotal");
    if (kpiTeams) kpiTeams.textContent = Object.keys(TEAM_DETAILS).length;
    document.getElementById("navNewsCount").textContent = store.news.length;

    const list = document.getElementById("overviewRecentNewsList");
    list.innerHTML = "";

    const recent = store.news.slice(0, 4);
    recent.forEach(item => {
        const div = document.createElement("div");
        div.className = "roster-pill";
        div.style.marginBottom = "10px";
        div.innerHTML = `
            <img src="${item.image}" alt="${item.title}" style="width: 50px; height: 36px; border-radius: 4px; object-fit: cover;">
            <div style="flex: 1; min-width: 0;">
                <strong style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block;">${item.title}</strong>
                <small style="color: var(--brand-magenta); font-weight: 700;">${item.category}</small> • <small>${item.date}</small>
            </div>
        `;
        list.appendChild(div);
    });
}

// ==============================================================
// RENDERIZADO & GESTIÓN: NOTICIAS
// ==============================================================
const newsTableBody = document.getElementById("newsTableBody");
const searchNewsInput = document.getElementById("searchNewsInput");
const filterCategorySelect = document.getElementById("filterCategorySelect");

function getCategoryClass(cat) {
    const map = {
        "COLABORACION": "tag-colab",
        "TORNEOS": "tag-torneo",
        "RECLUTAMIENTO": "tag-recluta",
        "ROSTER": "tag-roster",
        "COMUNIDAD": "tag-comunidad"
    };
    return map[cat] || "tag-colab";
}

function renderNewsTable() {
    const searchTerm = searchNewsInput.value.toLowerCase();
    const filterCat = filterCategorySelect.value;

    const filtered = store.news.filter(n => {
        const matchesSearch = n.title.toLowerCase().includes(searchTerm) || n.author.toLowerCase().includes(searchTerm);
        const matchesCategory = filterCat === "all" || n.category === filterCat;
        return matchesSearch && matchesCategory;
    });

    newsTableBody.innerHTML = "";

    if (filtered.length === 0) {
        newsTableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 30px; color: var(--brand-gray-text);">No se encontraron noticias con los filtros actuales.</td></tr>`;
        return;
    }

    filtered.forEach(n => {
        const tr = document.createElement("tr");
        const statusClass = n.status === "publicado" ? "status-published" : "status-draft";
        const catClass = getCategoryClass(n.category);

        tr.innerHTML = `
            <td>
                <img src="${n.image}" alt="${n.title}" class="table-thumb" onerror="this.src='../img/logos/logo.png'">
            </td>
            <td>
                <span class="table-title">${n.title}</span>
                <span class="table-sub">${n.excerpt}</span>
            </td>
            <td><span class="badge-tag ${catClass}">${n.category}</span></td>
            <td>${n.author}</td>
            <td>${n.date}</td>
            <td>
                <span class="status-badge ${statusClass}">
                    ● ${n.status.toUpperCase()}
                </span>
            </td>
            <td class="action-buttons">
                <button class="btn btn-outline btn-xs edit-news-btn" data-id="${n.id}" title="Editar">✏️ Editar</button>
                <button class="btn btn-danger btn-xs delete-news-btn" data-id="${n.id}" title="Eliminar">🗑️</button>
            </td>
        `;
        newsTableBody.appendChild(tr);
    });

    // Asignar listeners de acciones
    document.querySelectorAll(".edit-news-btn").forEach(btn => {
        btn.addEventListener("click", () => openEditNewsModal(btn.getAttribute("data-id")));
    });

    document.querySelectorAll(".delete-news-btn").forEach(btn => {
        btn.addEventListener("click", () => deleteNews(btn.getAttribute("data-id")));
    });
}

searchNewsInput.addEventListener("input", renderNewsTable);
filterCategorySelect.addEventListener("change", renderNewsTable);

// MODAL NOTICIAS
const newsModal = document.getElementById("newsModal");
const newsForm = document.getElementById("newsForm");
const openCreateNewsModalBtn = document.getElementById("openCreateNewsModalBtn");
const quickNewNewsBtn = document.getElementById("quickNewNewsBtn");
const closeNewsModalBtn = document.getElementById("closeNewsModalBtn");
const cancelNewsBtn = document.getElementById("cancelNewsBtn");

function openCreateNewsModal() {
    const role = store.auth.role || "admin";
    if (role !== "admin" && role !== "editor") {
        showToast("Acceso denegado: tu rol no tiene permisos para crear noticias.", "danger");
        return;
    }
    document.getElementById("newsModalTitle").textContent = "Crear Noticia para Araxys";
    document.getElementById("newsId").value = "";
    document.getElementById("newsForm").reset();
    document.getElementById("newsDate").value = new Date().toISOString().split("T")[0];
    document.getElementById("newsImage").value = "../img/news/araxys-kitsune-20260810.webp";
    newsModal.classList.add("open");
}

function openEditNewsModal(id) {
    const role = store.auth.role || "admin";
    if (role !== "admin" && role !== "editor") {
        showToast("Acceso denegado: tu rol no tiene permisos para editar noticias.", "danger");
        return;
    }

    const item = store.news.find(n => n.id === id);
    if (!item) return;

    document.getElementById("newsModalTitle").textContent = "Editar Noticia";
    document.getElementById("newsId").value = item.id;
    document.getElementById("newsTitle").value = item.title;
    document.getElementById("newsCategory").value = item.category;
    document.getElementById("newsAuthor").value = item.author;
    document.getElementById("newsDate").value = item.date;
    document.getElementById("newsStatus").value = item.status || "publicado";
    document.getElementById("newsImage").value = item.image;
    document.getElementById("newsExcerpt").value = item.excerpt;
    document.getElementById("newsContent").value = item.content;

    newsModal.classList.add("open");
}

function closeNewsModal() {
    newsModal.classList.remove("open");
}

openCreateNewsModalBtn.addEventListener("click", openCreateNewsModal);
closeNewsModalBtn.addEventListener("click", closeNewsModal);
cancelNewsBtn.addEventListener("click", closeNewsModal);

newsForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const role = store.auth.role || "admin";
    if (role !== "admin" && role !== "editor") {
        showToast("Acceso denegado: no tienes permisos para publicar noticias.", "danger");
        closeNewsModal();
        return;
    }

    const id = document.getElementById("newsId").value;
    const title = document.getElementById("newsTitle").value.trim();
    const category = document.getElementById("newsCategory").value;
    const author = document.getElementById("newsAuthor").value.trim();
    const date = document.getElementById("newsDate").value;
    const status = document.getElementById("newsStatus").value;
    const image = document.getElementById("newsImage").value.trim();
    const excerpt = document.getElementById("newsExcerpt").value.trim();
    const content = document.getElementById("newsContent").value.trim();

    if (id) {
        // Editar
        const index = store.news.findIndex(n => n.id === id);
        if (index !== -1) {
            const beforeData = { ...store.news[index] };
            store.news[index] = { ...store.news[index], title, category, author, date, status, image, excerpt, content };
            store.logAction("EDICIÓN", `Se actualizó la noticia "${title}"`, { before: beforeData, after: store.news[index] });
            showToast("Noticia actualizada con éxito.");
        }
    } else {
        // Crear nueva
        const newNews = {
            id: "noticia-" + Date.now(),
            slug: `noticia-${Date.now()}.html`,
            title, category, author, date, status, image, excerpt, content
        };
        store.news.unshift(newNews);
        store.logAction("CREACIÓN", `Se publicó nueva noticia: "${title}" (${category})`, newNews);
        showToast("¡Nueva noticia publicada en el CMS!");
    }

    store.saveNews();
    closeNewsModal();
    renderNewsTable();
    renderOverview();
});

function deleteNews(id) {
    const role = store.auth.role || "admin";
    if (role !== "admin" && role !== "editor") {
        showToast("Acceso denegado: no tienes permisos para eliminar noticias.", "danger");
        return;
    }

    const item = store.news.find(n => n.id === id);
    if (!item) return;

    if (!confirm(`¿Seguro que deseas eliminar la noticia "${item.title}"?`)) return;

    // Enviar a la papelera con snapshot para que el CEO pueda restaurarla
    store.moveToTrash("news", item);
    store.news = store.news.filter(n => n.id !== id);
    store.saveNews();
    renderNewsTable();
    renderOverview();
    showToast("Noticia movida a la papelera. El CEO puede restaurarla desde Auditoría.", "danger");
}

// ==============================================================
// RENDERIZADO & GESTIÓN: ROSTERS & JUGADORES
// ==============================================================
let currentSelectedTeam = "titular";
const playersCardsGrid = document.getElementById("playersCardsGrid");
const teamFilterTabs = document.querySelectorAll(".team-tab-btn");

function renderTeamBanner(teamKey) {
    const details = TEAM_DETAILS[teamKey] || TEAM_DETAILS.titular;
    document.getElementById("currentTeamName").textContent = details.name;
    document.getElementById("currentTeamBadge").textContent = details.badge;
    document.getElementById("currentTeamDesc").textContent = details.desc;
}

function renderPlayersGrid() {
    renderTeamBanner(currentSelectedTeam);
    const filtered = store.players.filter(p => p.team === currentSelectedTeam);
    playersCardsGrid.innerHTML = "";

    if (filtered.length === 0) {
        playersCardsGrid.innerHTML = `
            <div style="grid-column: 1/-1; background: var(--brand-dark-2); border: 1px dashed var(--brand-border); border-radius: var(--radius-lg); padding: 50px 20px; text-align: center;">
                <p style="color: var(--brand-gray-text); font-size: 15px; margin-bottom: 16px;">Aún no hay jugadores registrados en esta división.</p>
                <button class="btn btn-primary btn-sm" id="emptyStateAddPlayerBtn">+ Registrar Primer Jugador</button>
            </div>
        `;
        const emptyBtn = document.getElementById("emptyStateAddPlayerBtn");
        if (emptyBtn) emptyBtn.addEventListener("click", openAddPlayerModal);
        return;
    }

    filtered.forEach(p => {
        const card = document.createElement("div");
        card.className = "player-card";
        card.innerHTML = `
            <div class="player-card-img-wrap">
                <img src="${p.photo}" alt="${p.nick}" class="player-card-img" onerror="this.src='../img/equipos/equipos.webp'">
                <span class="player-card-role-tag">${p.role}</span>
            </div>
            <div class="player-card-body">
                <div class="player-card-nick">${p.nick}</div>
                <div class="player-card-agent">Agente: <strong>${p.agent || "No especificado"}</strong></div>
                <div class="player-card-socials">
                    <span>${p.twitter || "@Araxys"}</span>
                    <span style="margin-left:auto;">${p.tracker || "Tracker Riot"}</span>
                </div>
                <div class="player-card-actions">
                    <button class="btn btn-outline btn-xs flex-1 edit-player-btn" data-id="${p.id}">Editar</button>
                    <button class="btn btn-danger btn-xs delete-player-btn" data-id="${p.id}">🗑️</button>
                </div>
            </div>
        `;
        playersCardsGrid.appendChild(card);
    });

    document.querySelectorAll(".edit-player-btn").forEach(btn => {
        btn.addEventListener("click", () => openEditPlayerModal(btn.getAttribute("data-id")));
    });

    document.querySelectorAll(".delete-player-btn").forEach(btn => {
        btn.addEventListener("click", () => deletePlayer(btn.getAttribute("data-id")));
    });
}

teamFilterTabs.forEach(btn => {
    btn.addEventListener("click", () => {
        teamFilterTabs.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentSelectedTeam = btn.getAttribute("data-team");
        renderPlayersGrid();
    });
});

// MODAL JUGADOR
const playerModal = document.getElementById("playerModal");
const playerForm = document.getElementById("playerForm");
const openAddPlayerModalBtn = document.getElementById("openAddPlayerModalBtn");
const closePlayerModalBtn = document.getElementById("closePlayerModalBtn");
const cancelPlayerBtn = document.getElementById("cancelPlayerBtn");

function openAddPlayerModal() {
    const role = store.auth.role || "admin";
    const roleInfo = ROLE_DEFINITIONS[role] || ROLE_DEFINITIONS.admin;

    if (role === "editor") {
        showToast("Los redactores de prensa no tienen permisos para gestionar rosters.", "danger");
        return;
    }

    document.getElementById("playerModalTitle").textContent = "Añadir Jugador al Roster";
    document.getElementById("playerId").value = "";
    document.getElementById("playerForm").reset();

    const teamSelect = document.getElementById("playerTeam");
    if (role.startsWith("coach_")) {
        teamSelect.value = roleInfo.team;
        teamSelect.disabled = true;
    } else {
        teamSelect.disabled = false;
        teamSelect.value = currentSelectedTeam;
    }

    document.getElementById("playerPhoto").value = "../img/equipos/equipos.webp";
    playerModal.classList.add("open");
}

function openEditPlayerModal(id) {
    const role = store.auth.role || "admin";
    const roleInfo = ROLE_DEFINITIONS[role] || ROLE_DEFINITIONS.admin;

    if (role === "editor") {
        showToast("Los redactores no tienen permisos para modificar jugadores.", "danger");
        return;
    }

    const p = store.players.find(x => x.id === id);
    if (!p) return;

    if (role.startsWith("coach_") && p.team !== roleInfo.team) {
        showToast(`Acceso denegado: solo puedes editar jugadores de tu equipo (${roleInfo.team.toUpperCase()}).`, "danger");
        return;
    }

    document.getElementById("playerModalTitle").textContent = "Editar Datos del Jugador";
    document.getElementById("playerId").value = p.id;
    
    const teamSelect = document.getElementById("playerTeam");
    teamSelect.value = p.team;
    teamSelect.disabled = role.startsWith("coach_");

    document.getElementById("playerNick").value = p.nick;
    document.getElementById("playerRole").value = p.role;
    document.getElementById("playerAgent").value = p.agent;
    document.getElementById("playerPhoto").value = p.photo;
    document.getElementById("playerTwitter").value = p.twitter || "";
    document.getElementById("playerTracker").value = p.tracker || "";

    playerModal.classList.add("open");
}

function closePlayerModal() {
    playerModal.classList.remove("open");
}

openAddPlayerModalBtn.addEventListener("click", openAddPlayerModal);
closePlayerModalBtn.addEventListener("click", closePlayerModal);
cancelPlayerBtn.addEventListener("click", closePlayerModal);

playerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const role = store.auth.role || "admin";
    const roleInfo = ROLE_DEFINITIONS[role] || ROLE_DEFINITIONS.admin;

    if (role === "editor") {
        showToast("Acceso denegado: no puedes modificar rosters.", "danger");
        closePlayerModal();
        return;
    }

    const id = document.getElementById("playerId").value;
    let team = document.getElementById("playerTeam").value;

    // Si es coach, forzar siempre a su equipo autorizado
    if (role.startsWith("coach_")) {
        team = roleInfo.team;
    }

    const nick = document.getElementById("playerNick").value.trim();
    const playerRole = document.getElementById("playerRole").value;
    const agent = document.getElementById("playerAgent").value.trim();
    const photo = document.getElementById("playerPhoto").value.trim() || "../img/equipos/equipos.webp";
    const twitter = document.getElementById("playerTwitter").value.trim();
    const tracker = document.getElementById("playerTracker").value.trim();

    if (id) {
        const index = store.players.findIndex(x => x.id === id);
        if (index !== -1) {
            // Si es coach, asegurar que el jugador que edita pertenece a su equipo
            if (role.startsWith("coach_") && store.players[index].team !== roleInfo.team) {
                showToast("Acceso denegado.", "danger");
                closePlayerModal();
                return;
            }
            const beforePlayer = { ...store.players[index] };
            store.players[index] = { ...store.players[index], team, nick, role: playerRole, agent, photo, twitter, tracker };
            store.logAction("EDICIÓN", `Se actualizaron datos de "${nick}" (${team.toUpperCase()})`, { before: beforePlayer, after: store.players[index] });
            showToast(`Datos de ${nick} actualizados.`);
        }
    } else {
        const newPlayer = {
            id: "p-" + Date.now(),
            team, nick, role: playerRole, agent, photo, twitter, tracker
        };
        store.players.push(newPlayer);
        store.logAction("CREACIÓN", `Se añadió jugador "${nick}" al equipo ${team.toUpperCase()}`, newPlayer);
        showToast(`¡${nick} añadido al equipo ${team.toUpperCase()}!`);
    }

    store.savePlayers();
    closePlayerModal();
    renderPlayersGrid();
    renderOverview();
});

function deletePlayer(id) {
    const role = store.auth.role || "admin";
    const roleInfo = ROLE_DEFINITIONS[role] || ROLE_DEFINITIONS.admin;

    if (role === "editor") {
        showToast("Los redactores no pueden eliminar jugadores.", "danger");
        return;
    }

    const p = store.players.find(x => x.id === id);
    if (!p) return;

    if (role.startsWith("coach_") && p.team !== roleInfo.team) {
        showToast(`Solo puedes gestionar a tu propio equipo (${roleInfo.team.toUpperCase()}).`, "danger");
        return;
    }

    const name = p ? p.nick : "el jugador";
    if (!confirm(`¿Estás seguro de desvincular a ${name} del roster?`)) return;

    // Enviar a la papelera con snapshot para que el CEO pueda restaurarlo
    store.moveToTrash("player", p);
    store.players = store.players.filter(x => x.id !== id);
    store.savePlayers();
    renderPlayersGrid();
    renderOverview();
    showToast(`Jugador ${name} movido a la papelera. Se puede restaurar desde Auditoría.`, "danger");
}

// ==============================================================
// GESTIÓN DE STAFF & PERMISOS (RBAC)
// ==============================================================
const staffTableBody = document.getElementById("staffTableBody");
const staffModal = document.getElementById("staffModal");
const staffForm = document.getElementById("staffForm");
const openAddStaffModalBtn = document.getElementById("openAddStaffModalBtn");
const closeStaffModalBtn = document.getElementById("closeStaffModalBtn");
const cancelStaffBtn = document.getElementById("cancelStaffBtn");

function renderStaffTable() {
    if (!staffTableBody) return;
    staffTableBody.innerHTML = "";

    store.staff.forEach(s => {
        const info = ROLE_DEFINITIONS[s.role] || ROLE_DEFINITIONS.admin;
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div class="user-avatar" style="width: 32px; height: 32px; font-size: 11px; background: ${info.color};">${s.nick.substring(0, 2).toUpperCase()}</div>
                    <strong style="color: var(--brand-white);">${s.nick}</strong>
                </div>
            </td>
            <td>${s.user}</td>
            <td><span class="badge-tag" style="background: rgba(255,255,255,0.08); color: ${info.color}; border: 1px solid ${info.color};">${info.label}</span></td>
            <td><small style="color: var(--brand-gray-text);">${info.scope}</small></td>
            <td><span class="status-badge status-published">● ${s.status}</span></td>
            <td class="action-buttons">
                ${s.nick !== "Krys" ? `
                    <button class="btn btn-outline btn-xs edit-staff-btn" data-id="${s.id}">Editar</button>
                    <button class="btn btn-danger btn-xs delete-staff-btn" data-id="${s.id}">🗑️</button>
                ` : `<span style="font-size: 12px; color: var(--brand-gold); font-weight: bold;">👑 Fundador</span>`}
            </td>
        `;
        staffTableBody.appendChild(tr);
    });

    document.querySelectorAll(".edit-staff-btn").forEach(btn => {
        btn.addEventListener("click", () => openEditStaffModal(btn.getAttribute("data-id")));
    });

    document.querySelectorAll(".delete-staff-btn").forEach(btn => {
        btn.addEventListener("click", () => deleteStaffMember(btn.getAttribute("data-id")));
    });
}

function openAddStaffModal() {
    if (store.auth.role !== "admin") {
        showToast("Solo el Administrador / CEO puede gestionar personal.", "danger");
        return;
    }
    document.getElementById("staffModalTitle").textContent = "Añadir Miembro del Staff";
    document.getElementById("staffId").value = "";
    staffForm.reset();
    staffModal.classList.add("open");
}

function openEditStaffModal(id) {
    if (store.auth.role !== "admin") {
        showToast("Solo el Administrador / CEO puede editar miembros.", "danger");
        return;
    }
    const s = store.staff.find(x => x.id === id);
    if (!s) return;
    document.getElementById("staffModalTitle").textContent = "Editar Miembro del Staff";
    document.getElementById("staffId").value = s.id;
    document.getElementById("staffNick").value = s.nick;
    document.getElementById("staffUser").value = s.user;
    document.getElementById("staffRole").value = s.role;
    document.getElementById("staffPass").value = s.password || "";
    staffModal.classList.add("open");
}

function closeStaffModal() {
    staffModal.classList.remove("open");
}

if (openAddStaffModalBtn) openAddStaffModalBtn.addEventListener("click", openAddStaffModal);
if (closeStaffModalBtn) closeStaffModalBtn.addEventListener("click", closeStaffModal);
if (cancelStaffBtn) cancelStaffBtn.addEventListener("click", closeStaffModal);

if (staffForm) {
    staffForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if (store.auth.role !== "admin") {
            showToast("Acceso denegado: solo el CEO puede registrar staff.", "danger");
            closeStaffModal();
            return;
        }

        const id = document.getElementById("staffId").value;
        const nick = document.getElementById("staffNick").value.trim();
        const user = document.getElementById("staffUser").value.trim();
        const role = document.getElementById("staffRole").value;
        const password = document.getElementById("staffPass").value.trim() ;

        if (id) {
            const index = store.staff.findIndex(x => x.id === id);
            if (index !== -1) {
                store.staff[index] = { ...store.staff[index], nick, user, role, password };
                store.logAction("STAFF", `Se actualizó rol de staff: ${nick} (${ROLE_DEFINITIONS[role].label})`);
                showToast(`Datos de ${nick} actualizados.`);
            }
        } else {
            const newMember = {
                id: "s-" + Date.now(),
                nick, user, role, password, status: "Activo"
            };
            store.staff.push(newMember);
            store.logAction("STAFF", `Nuevo staff registrado: ${nick} (${ROLE_DEFINITIONS[role].label})`);
            showToast(`¡${nick} añadido con rol ${ROLE_DEFINITIONS[role].label}!`);
        }

        store.saveStaff();
        closeStaffModal();
        renderStaffTable();
    });
}

function deleteStaffMember(id) {
    if (store.auth.role !== "admin") {
        showToast("Solo el CEO puede revocar accesos.", "danger");
        return;
    }

    const s = store.staff.find(x => x.id === id);
    if (!s) return;
    if (!confirm(`¿Revocar acceso y desvincular a ${s.nick} del staff?`)) return;

    store.staff = store.staff.filter(x => x.id !== id);
    store.saveStaff();
    store.logAction("STAFF", `Acceso revocado para miembro de staff: ${s.nick}`);
    renderStaffTable();
    showToast(`Acceso revocado para ${s.nick}.`, "danger");
}

// ==============================================================
// UTILIDADES: CONVERSOR & OPTIMIZADOR A WEBP (HTML5 CANVAS)
// ==============================================================
function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

function convertImageToWebP(file, quality = 0.85, maxWidth = 1920) {
    return new Promise((resolve, reject) => {
        if (!file.type.startsWith("image/")) {
            reject(new Error("El archivo seleccionado no es una imagen válida."));
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                let width = img.width;
                let height = img.height;

                if (maxWidth > 0 && width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }

                const canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob((blob) => {
                    if (!blob) {
                        reject(new Error("No se pudo generar el formato WebP."));
                        return;
                    }
                    const dataUrl = canvas.toDataURL("image/webp", quality);
                    const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "-").toLowerCase();
                    const suggestedName = `araxys-${cleanName}.webp`;

                    resolve({
                        blob,
                        dataUrl,
                        width,
                        height,
                        originalSize: file.size,
                        newSize: blob.size,
                        savingsPercent: Math.max(0, Math.round(((file.size - blob.size) / file.size) * 100)),
                        originalName: file.name,
                        suggestedName: suggestedName
                    });
                }, "image/webp", quality);
            };
            img.onerror = () => reject(new Error("No se pudo decodificar la imagen seleccionada."));
            img.src = e.target.result;
        };
        reader.onerror = () => reject(new Error("Error leyendo el archivo en el navegador."));
        reader.readAsDataURL(file);
    });
}

// ==============================================================
// GESTIÓN DE AUDITORÍA & PAPELERA DE RECUPERACIÓN (CEO)
// ==============================================================
function updateTrashCounters() {
    const trashCount = store.trash.length;
    const badge = document.getElementById("trashCountBadge");
    const num = document.getElementById("trashCountNumber");
    const logsNum = document.getElementById("logsCountNumber");
    if (badge) badge.textContent = trashCount;
    if (num) num.textContent = trashCount;
    if (logsNum) logsNum.textContent = store.activityLog.length;
}

function renderTrashList() {
    const tbody = document.getElementById("trashTableBody");
    if (!tbody) return;
    tbody.innerHTML = "";

    updateTrashCounters();

    if (store.trash.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 36px 20px; color: var(--brand-gray-text);">
                    <div style="font-size: 28px; margin-bottom: 8px;">🛡️</div>
                    <strong style="color: var(--brand-white); font-size: 15px;">La papelera está vacía.</strong>
                    <p style="font-size: 13px; margin-top: 4px;">No hay noticias ni jugadores eliminados. Todos tus datos están protegidos.</p>
                </td>
            </tr>
        `;
        return;
    }

    store.trash.forEach(item => {
        const tr = document.createElement("tr");
        const dateStr = new Date(item.deletedAt).toLocaleString("es-MX", { dateStyle: "short", timeStyle: "short" });
        const typeBadge = item.type === "news" 
            ? `<span class="badge" style="background: rgba(220,19,108,0.2); color: var(--brand-magenta); border: 1px solid var(--brand-magenta);">📰 NOTICIA</span>`
            : `<span class="badge" style="background: rgba(0,209,255,0.2); color: #00D1FF; border: 1px solid #00D1FF;">👥 JUGADOR</span>`;

        tr.innerHTML = `
            <td>${typeBadge}</td>
            <td><strong>${item.title}</strong></td>
            <td><small style="color: var(--brand-gray-text);">${item.subtitle || "-"}</small></td>
            <td><span style="color: var(--brand-gold); font-weight: 700;">${item.deletedBy}</span></td>
            <td><small>${dateStr}</small></td>
            <td class="text-right">
                <button class="btn btn-sm btn-outline btn-restore-item" data-id="${item.id}" style="color: #00E676; border-color: #00E676; margin-right: 6px;">
                    ↺ Restaurar
                </button>
                <button class="btn btn-sm btn-danger btn-purge-item" data-id="${item.id}">
                    🗑️ Purgar
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    tbody.querySelectorAll(".btn-restore-item").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            if (store.restoreFromTrash(id)) {
                showToast("¡Elemento restaurado con éxito a la página oficial!");
            }
        });
    });

    tbody.querySelectorAll(".btn-purge-item").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            if (confirm("¿Estás seguro de eliminar permanentemente este elemento? No se podrá recuperar.")) {
                store.purgeTrashItem(id);
                showToast("Elemento purgado definitivamente.", "danger");
            }
        });
    });
}

function renderAuditLog() {
    const tbody = document.getElementById("auditLogsTableBody");
    if (!tbody) return;
    tbody.innerHTML = "";

    const searchVal = (document.getElementById("searchLogInput")?.value || "").toLowerCase().trim();
    const actionFilter = document.getElementById("filterLogActionSelect")?.value || "all";

    let filtered = store.activityLog.filter(log => {
        const matchesAction = actionFilter === "all" || log.action === actionFilter;
        const matchesSearch = !searchVal || 
            log.detail.toLowerCase().includes(searchVal) ||
            log.user.toLowerCase().includes(searchVal) ||
            log.action.toLowerCase().includes(searchVal);
        return matchesAction && matchesSearch;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 30px; color: var(--brand-gray-text);">
                    No se encontraron registros de actividad con los filtros seleccionados.
                </td>
            </tr>
        `;
        return;
    }

    filtered.forEach(log => {
        const tr = document.createElement("tr");
        const dateStr = new Date(log.timestamp).toLocaleString("es-MX", { dateStyle: "short", timeStyle: "short" });
        
        let actionClass = "badge-action-create";
        if (log.action === "EDICIÓN") actionClass = "badge-action-edit";
        else if (log.action === "ELIMINACIÓN" || log.action === "PURGA" || log.action === "PURGA TOTAL") actionClass = "badge-action-delete";
        else if (log.action === "RESTAURACIÓN") actionClass = "badge-action-restore";
        else if (log.action === "STAFF") actionClass = "badge-action-staff";

        const hasSnapshot = log.snapshot !== null && log.snapshot !== undefined;

        tr.innerHTML = `
            <td><small>${dateStr}</small></td>
            <td><strong>${log.user}</strong> <small style="color: var(--brand-gray-text);">(${log.role || "staff"})</small></td>
            <td><span class="badge-action ${actionClass}">${log.action}</span></td>
            <td><span>${log.detail}</span></td>
            <td class="text-right">
                ${hasSnapshot ? `<button class="btn btn-sm btn-outline btn-view-snapshot" data-id="${log.id}">🔍 Ver Datos</button>` : `<span style="color: var(--brand-gray-text); font-size: 11px;">-</span>`}
            </td>
        `;
        tbody.appendChild(tr);
    });

    tbody.querySelectorAll(".btn-view-snapshot").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            const found = store.activityLog.find(l => l.id === id);
            if (found && found.snapshot) {
                openSnapshotModal(found);
            }
        });
    });
}

function openSnapshotModal(logEntry) {
    const modal = document.getElementById("snapshotModal");
    const title = document.getElementById("snapshotModalTitle");
    const sub = document.getElementById("snapshotModalSubtitle");
    const content = document.getElementById("snapshotModalContent");

    if (title) title.textContent = `Registro: ${logEntry.action} por ${logEntry.user}`;
    if (sub) sub.textContent = `${new Date(logEntry.timestamp).toLocaleString("es-MX")} • ${logEntry.detail}`;
    if (content) content.textContent = JSON.stringify(logEntry.snapshot, null, 2);

    if (modal) modal.classList.add("open");
}

function closeSnapshotModal() {
    const modal = document.getElementById("snapshotModal");
    if (modal) modal.classList.remove("open");
}

let currentConvertedWebP = null;

// ==============================================================
// INICIALIZACIÓN
// ==============================================================
document.addEventListener("DOMContentLoaded", () => {
    checkAuthStatus();
    renderOverview();
    renderNewsTable();
    renderPlayersGrid();
    renderStaffTable();
    renderTrashList();
    renderAuditLog();
    updateTrashCounters();

    // Copiado rápido de códigos de color
    document.querySelectorAll(".copyable-color").forEach(card => {
        card.addEventListener("click", () => {
            const hex = card.getAttribute("data-color");
            navigator.clipboard.writeText(hex).then(() => {
                showToast(`Código de color ${hex} copiado.`);
                const hint = card.querySelector(".copy-hint");
                if (hint) {
                    hint.textContent = "¡Copiado!";
                    hint.style.color = "var(--brand-gold)";
                    setTimeout(() => {
                        hint.textContent = "Copiar";
                        hint.style.color = "";
                    }, 1500);
                }
            }).catch(() => {
                showToast(`Color: ${hex}`);
            });
        });
    });

    // Acceso directo para redactar noticia de torneo
    const shortcutTournNewsBtn = document.getElementById("createTournamentNewsShortcutBtn");
    if (shortcutTournNewsBtn) {
        shortcutTournNewsBtn.addEventListener("click", () => {
            switchTab("tab-news");
            openCreateNewsModal();
            const catSelect = document.getElementById("newsCategory");
            if (catSelect) catSelect.value = "TORNEOS";
        });
    }

    // -------------------------------------------------------------
    // EVENTOS DEL CONVERSOR WEBP (ESTUDIO PRINCIPAL)
    // -------------------------------------------------------------
    const qualitySlider = document.getElementById("webpQualitySlider");
    const qualityDisplay = document.getElementById("qualityDisplay");
    if (qualitySlider && qualityDisplay) {
        qualitySlider.addEventListener("input", (e) => {
            qualityDisplay.textContent = e.target.value + "%";
        });
    }

    const mainDropzone = document.getElementById("mainWebpDropzone");
    const mainFileInput = document.getElementById("mainWebpFileInput");
    const btnSelectMainFile = document.getElementById("btnSelectMainWebpFile");

    if (btnSelectMainFile && mainFileInput) {
        btnSelectMainFile.addEventListener("click", () => mainFileInput.click());
    }

    if (mainDropzone && mainFileInput) {
        mainDropzone.addEventListener("click", (e) => {
            if (e.target !== btnSelectMainFile) mainFileInput.click();
        });
        mainDropzone.addEventListener("dragover", (e) => {
            e.preventDefault();
            mainDropzone.classList.add("dragover");
        });
        mainDropzone.addEventListener("dragleave", () => mainDropzone.classList.remove("dragover"));
        mainDropzone.addEventListener("drop", (e) => {
            e.preventDefault();
            mainDropzone.classList.remove("dragover");
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                processMainWebPConversion(e.dataTransfer.files[0]);
            }
        });
        mainFileInput.addEventListener("change", (e) => {
            if (e.target.files && e.target.files[0]) {
                processMainWebPConversion(e.target.files[0]);
            }
        });
    }

    async function processMainWebPConversion(file) {
        try {
            showToast("Optimizando y convirtiendo a formato .WebP...");
            const quality = parseInt(document.getElementById("webpQualitySlider")?.value || 85) / 100;
            const maxWidth = parseInt(document.getElementById("webpMaxResolution")?.value || 1920);

            const res = await convertImageToWebP(file, quality, maxWidth);
            currentConvertedWebP = res;

            const resultBox = document.getElementById("webpResultBox");
            const img = document.getElementById("webpResultImg");
            const name = document.getElementById("webpResultName");
            const savings = document.getElementById("webpResultSavings");
            const origSize = document.getElementById("webpOriginalSize");
            const convSize = document.getElementById("webpConvertedSize");
            const dims = document.getElementById("webpDimensions");

            if (resultBox) resultBox.style.display = "flex";
            if (img) img.src = res.dataUrl;
            if (name) name.textContent = res.suggestedName;
            if (savings) savings.textContent = `-${res.savingsPercent}%`;
            if (origSize) origSize.textContent = `Original: ${formatFileSize(res.originalSize)}`;
            if (convSize) convSize.textContent = `WebP: ${formatFileSize(res.newSize)}`;
            if (dims) dims.textContent = `(${res.width}x${res.height})`;

            showToast(`¡Listo! Reducción de peso: -${res.savingsPercent}%`);
        } catch (err) {
            showToast(err.message, "danger");
        }
    }

    const btnDownloadWebp = document.getElementById("btnDownloadWebp");
    if (btnDownloadWebp) {
        btnDownloadWebp.addEventListener("click", () => {
            if (!currentConvertedWebP) return;
            const a = document.createElement("a");
            a.href = URL.createObjectURL(currentConvertedWebP.blob);
            a.download = currentConvertedWebP.suggestedName;
            a.click();
            URL.revokeObjectURL(a.href);
            showToast(`Descargando ${currentConvertedWebP.suggestedName}`);
        });
    }

    const btnUseInNewsShortcut = document.getElementById("btnUseInNewsShortcut");
    if (btnUseInNewsShortcut) {
        btnUseInNewsShortcut.addEventListener("click", () => {
            if (!currentConvertedWebP) return;
            switchTab("tab-news");
            openCreateNewsModal();
            const input = document.getElementById("newsImage");
            if (input) input.value = `../img/news/${currentConvertedWebP.suggestedName}`;
            showToast("Imagen asignada al borrador de la noticia.");
        });
    }

    // -------------------------------------------------------------
    // CONVERSOR INLINE EN MODAL DE NOTICIA
    // -------------------------------------------------------------
    const modalImgUpload = document.getElementById("modalNewsImageUpload");
    if (modalImgUpload) {
        modalImgUpload.addEventListener("change", async (e) => {
            if (e.target.files && e.target.files[0]) {
                try {
                    const file = e.target.files[0];
                    showToast("Convirtiendo imagen a .WebP...");
                    const res = await convertImageToWebP(file, 0.85, 1920);

                    const newsImgInput = document.getElementById("newsImage");
                    if (newsImgInput) newsImgInput.value = `../img/news/${res.suggestedName}`;

                    const previewBox = document.getElementById("modalWebpPreview");
                    const thumb = document.getElementById("modalWebpThumb");
                    const info = document.getElementById("modalWebpInfo");
                    const savings = document.getElementById("modalWebpSavings");
                    const dlBtn = document.getElementById("modalDownloadWebpBtn");

                    if (previewBox) previewBox.style.display = "flex";
                    if (thumb) thumb.src = res.dataUrl;
                    if (info) info.textContent = `${res.suggestedName} (${res.width}x${res.height})`;
                    if (savings) savings.textContent = `${formatFileSize(res.originalSize)} → ${formatFileSize(res.newSize)} (-${res.savingsPercent}%)`;

                    if (dlBtn) {
                        dlBtn.onclick = () => {
                            const a = document.createElement("a");
                            a.href = URL.createObjectURL(res.blob);
                            a.download = res.suggestedName;
                            a.click();
                            URL.revokeObjectURL(a.href);
                            showToast(`Descargando ${res.suggestedName}`);
                        };
                    }

                    showToast(`¡Convertida con éxito a WebP! (-${res.savingsPercent}%)`);
                } catch (err) {
                    showToast(err.message, "danger");
                }
            }
        });
    }

    // -------------------------------------------------------------
    // EVENTOS DE AUDITORÍA & PAPELERA (SUB-TABS Y ACCIONES)
    // -------------------------------------------------------------
    const auditTabTrashBtn = document.getElementById("auditTabTrashBtn");
    const auditTabLogsBtn = document.getElementById("auditTabLogsBtn");
    const auditPaneTrash = document.getElementById("auditPaneTrash");
    const auditPaneLogs = document.getElementById("auditPaneLogs");

    if (auditTabTrashBtn && auditTabLogsBtn && auditPaneTrash && auditPaneLogs) {
        auditTabTrashBtn.addEventListener("click", () => {
            auditTabTrashBtn.classList.add("active");
            auditTabLogsBtn.classList.remove("active");
            auditPaneTrash.style.display = "block";
            auditPaneLogs.style.display = "none";
            renderTrashList();
        });

        auditTabLogsBtn.addEventListener("click", () => {
            auditTabLogsBtn.classList.add("active");
            auditTabTrashBtn.classList.remove("active");
            auditPaneTrash.style.display = "none";
            auditPaneLogs.style.display = "block";
            renderAuditLog();
        });
    }

    const btnEmptyTrash = document.getElementById("btnEmptyTrash");
    if (btnEmptyTrash) {
        btnEmptyTrash.addEventListener("click", () => {
            if (store.trash.length === 0) {
                showToast("La papelera ya está vacía.");
                return;
            }
            if (confirm(`¿Estás seguro de vaciar la papelera? Se eliminarán definitivamente ${store.trash.length} elementos.`)) {
                store.clearTrash();
                showToast("Papelera vaciada por completo.", "danger");
            }
        });
    }

    const btnExportAuditLog = document.getElementById("btnExportAuditLog");
    if (btnExportAuditLog) {
        btnExportAuditLog.addEventListener("click", () => {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(store.activityLog, null, 2));
            const downloadAnchor = document.createElement("a");
            downloadAnchor.setAttribute("href", dataStr);
            downloadAnchor.setAttribute("download", `araxys-audit-log-${Date.now()}.json`);
            downloadAnchor.click();
            showToast("Registro de auditoría exportado en JSON.");
        });
    }

    const searchLogInput = document.getElementById("searchLogInput");
    const filterLogActionSelect = document.getElementById("filterLogActionSelect");
    if (searchLogInput) searchLogInput.addEventListener("input", renderAuditLog);
    if (filterLogActionSelect) filterLogActionSelect.addEventListener("change", renderAuditLog);

    const closeSnapshotModalBtn = document.getElementById("closeSnapshotModalBtn");
    const closeSnapshotBtn = document.getElementById("closeSnapshotBtn");
    if (closeSnapshotModalBtn) closeSnapshotModalBtn.addEventListener("click", closeSnapshotModal);
    if (closeSnapshotBtn) closeSnapshotBtn.addEventListener("click", closeSnapshotModal);
});
