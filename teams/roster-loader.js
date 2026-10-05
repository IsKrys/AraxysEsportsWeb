/* ==============================================================
   ARAXYS ESPORTS — CARGADOR DINÁMICO DE ROSTERS (WEB PÚBLICA)
   Sincroniza en tiempo real los jugadores y equipos con Cloud Firestore
   ============================================================== */

(function () {
    const STORAGE_KEY_CONFIG = "araxys_firebase_config_v1";
    const STORAGE_KEY_PLAYERS = "araxys_players_v2";

    const DEFAULT_CONFIG = {
        apiKey: "AIzaSyDosirX4w6VQ3eYRk0tbU9GAyUQ5LKWqQ4",
        authDomain: "araxys-esports.firebaseapp.com",
        projectId: "araxys-esports",
        storageBucket: "araxys-esports.firebasestorage.app",
        messagingSenderId: "752132311397",
        appId: "1:752132311397:web:21a69d26e1ff2989f3f98c"
    };

    const TEAM_META = {
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
        },
        origin: {
            name: "ARAXYS ORIGIN",
            badge: "DIVISIÓN COMPETITIVA",
            desc: "El equipo de Araxys que promete darle las mejores batallas a Wolf y sus rivales."
        }
    };

    /**
     * Detecta el equipo actual a partir del pathname
     */
    function getCurrentTeam() {
        const path = window.location.pathname.toLowerCase();
        if (path.includes("titular")) return "titular";
        if (path.includes("prime")) return "prime";
        if (path.includes("vanguard")) return "vanguard";
        if (path.includes("wolf")) return "wolf";
        if (path.includes("nexus")) return "nexus";
        if (path.includes("origin")) return "origin";
        return null;
    }

    function cleanPhotoPath(photo) {
        if (!photo) return "../img/equipos/equipos.webp";
        if (photo.startsWith("../")) return photo;
        if (photo.startsWith("/")) return `..${photo}`;
        if (photo.startsWith("http")) return photo;
        return `../${photo}`;
    }

    /**
     * Renderiza las tarjetas de jugadores en .member-card-grid
     */
    function renderRoster(players, teamKey) {
        const grid = document.querySelector(".member-card-grid");
        if (!grid) return;

        if (!players || players.length === 0) return;

        let html = "";
        let captainNick = null;

        players.forEach(p => {
            const nick = p.nick || "Jugador";
            const role = p.role || "Jugador";
            const agent = p.agent ? ` • ${p.agent}` : "";
            const photo = cleanPhotoPath(p.photo);

            // Detectar capitán
            const roleLower = role.toLowerCase();
            if (roleLower.includes("capit") || roleLower.includes("igl")) {
                captainNick = nick;
            }

            html += `
            <article class="member-card">
                <img src="${photo}" alt="${nick}" onerror="this.src='../img/equipos/equipos.webp'">
                <div class="member-overlay">
                    <div class="member-info-wrap">
                        <h3>${nick.toUpperCase()}</h3>
                        <span class="member-role">${role}${agent}</span>
                    </div>
                </div>
            </article>`;
        });

        grid.innerHTML = html;

        // Actualizar tarjeta de Capitán en .info-grid si existe
        if (captainNick) {
            document.querySelectorAll(".info-card").forEach(card => {
                const label = card.querySelector("span");
                const value = card.querySelector("h2");
                if (label && label.textContent.toLowerCase().includes("capit") && value) {
                    value.textContent = captainNick;
                }
            });
        }

        // Actualizar descripción si existe en TEAM_META
        if (teamKey && TEAM_META[teamKey]) {
            const descCard = document.querySelector(".description-card p");
            if (descCard && TEAM_META[teamKey].desc) {
                descCard.textContent = TEAM_META[teamKey].desc;
            }
        }
    }

    /**
     * Si estamos en teams.html (resumen general), asegurar que Nexus y Origin estén visibles
     */
    function updateTeamsShowcase(allPlayers) {
        const nexusCard = document.querySelector('a[href="nexus.html"]');
        if (nexusCard) {
            nexusCard.removeAttribute("hidden");
            const p = nexusCard.querySelector("p");
            if (p) p.textContent = "División Sorpresa";
        }

        const originCard = document.querySelector('a[href="origin.html"]');
        if (originCard) {
            originCard.removeAttribute("hidden");
            const p = originCard.querySelector("p");
            if (p) p.textContent = "División Competitiva";
        }
    }

    // Inicialización al cargar la página
    document.addEventListener("DOMContentLoaded", () => {
        const currentTeam = getCurrentTeam();
        const isShowcase = window.location.pathname.toLowerCase().includes("teams.html");

        let config = DEFAULT_CONFIG;
        try {
            const rawConfig = localStorage.getItem(STORAGE_KEY_CONFIG);
            if (rawConfig) {
                const parsed = JSON.parse(rawConfig);
                if (parsed && parsed.projectId) config = parsed;
            }
        } catch (_) {}

        if (typeof firebase === "undefined" || !config || !config.projectId) {
            // Fallback a localStorage local si está disponible
            if (currentTeam) {
                try {
                    const localPlayers = JSON.parse(localStorage.getItem(STORAGE_KEY_PLAYERS) || "[]");
                    const teamPlayers = localPlayers.filter(p => p.team === currentTeam);
                    if (teamPlayers.length > 0) renderRoster(teamPlayers, currentTeam);
                } catch (_) {}
            }
            if (isShowcase) updateTeamsShowcase();
            return;
        }

        // Conectar a Firestore
        try {
            const app = firebase.apps.length > 0 ? firebase.app() : firebase.initializeApp(config);
            const db = firebase.firestore();

            if (currentTeam) {
                // Escuchador en tiempo real para el equipo específico
                db.collection("araxys_players")
                    .where("team", "==", currentTeam)
                    .onSnapshot((snapshot) => {
                        if (!snapshot.empty) {
                            const players = [];
                            snapshot.forEach(doc => players.push(doc.data()));
                            renderRoster(players, currentTeam);
                        }
                    }, (err) => console.warn("[RosterLoader] Error al escuchar Firestore:", err));
            } else if (isShowcase) {
                updateTeamsShowcase();
                db.collection("araxys_players").onSnapshot((snapshot) => {
                    const all = [];
                    snapshot.forEach(doc => all.push(doc.data()));
                    updateTeamsShowcase(all);
                });
            }
        } catch (err) {
            console.warn("[RosterLoader] Excepción al inicializar:", err);
        }
    });
})();
