// ==========================================================================
// SISTEMA OFICIAL DE PICK'EMS - ARAXYS CIRCUIT 2026
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {

    // DATOS DE LOS 4 EQUIPOS OFICIALES
    const TEAMS_DATA = {
        vanguard: {
            id: "vanguard",
            name: "Araxys Vanguard",
            motto: "El escudo competitivo de la comunidad",
            logo: "../img/teams/vanguard.webp",
            colorClass: "vanguard"
        },
        wolf: {
            id: "wolf",
            name: "Araxys Wolf",
            motto: "La manada táctica implacable",
            logo: "../img/teams/wolf.webp",
            colorClass: "wolf"
        },
        prime: {
            id: "prime",
            name: "Araxys Prime",
            motto: "La élite dorada de alto calibre",
            logo: "../img/teams/prime.webp",
            colorClass: "prime"
        },
        origin: {
            id: "origin",
            name: "Araxys Origin",
            motto: "El génesis y evolución constante",
            logo: "../img/teams/origin.webp",
            colorClass: "origin"
        }
    };

    const LOCAL_STORAGE_KEY = "araxys_circuit_pickems_data_2026";
    const MODAL_PREF_KEY = "araxys_pickems_dont_show_modal";

    // ESTADO LOCAL DE LA APLICACIÓN
    let currentPicks = {
        1: null,
        2: null,
        3: null,
        4: null
    };

    let isLocked = false;

    // REFERENCIAS DEL DOM
    const instructionsModal = document.getElementById("instructionsModal");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const startPicksBtn = document.getElementById("startPicksBtn");
    const openInstructionsBtn = document.getElementById("openInstructionsBtn");
    const dontShowAgainCheck = document.getElementById("dontShowAgainCheck");

    const resetPicksBtn = document.getElementById("resetPicksBtn");
    const assignedCountText = document.getElementById("assignedCountText");
    const toastNotification = document.getElementById("toastNotification");
    const toastMessage = document.getElementById("toastMessage");
    const toastIcon = document.getElementById("toastIcon");

    const savedStateCard = document.getElementById("savedStateCard");
    const savedTimestampText = document.getElementById("savedTimestampText");
    const copyDiscordBtn = document.getElementById("copyDiscordBtn");
    const unlockPicksBtn = document.getElementById("unlockPicksBtn");

    const pickemsForm = document.getElementById("pickemsForm");
    const userNameInput = document.getElementById("userNameInput");
    const userDiscordInput = document.getElementById("userDiscordInput");
    const lockPicksBtn = document.getElementById("lockPicksBtn");
    const validationStatusBox = document.getElementById("validationStatusBox");
    const statusIconWrap = document.getElementById("statusIconWrap");
    const statusTitle = document.getElementById("statusTitle");
    const statusDesc = document.getElementById("statusDesc");

    // ==========================================================================
    // 1. MANEJO DEL MODAL DE INSTRUCCIONES ("CARTELITO BONITO")
    // ==========================================================================

    const showModal = () => {
        if (!instructionsModal) return;
        instructionsModal.classList.add("active");
        document.body.style.overflow = "hidden";
    };

    const hideModal = () => {
        if (!instructionsModal) return;
        instructionsModal.classList.remove("active");
        document.body.style.overflow = "";

        if (dontShowAgainCheck && dontShowAgainCheck.checked) {
            localStorage.setItem(MODAL_PREF_KEY, "true");
        }
    };

    // Apertura inicial automática según preferencia del usuario
    const shouldHideModal = localStorage.getItem(MODAL_PREF_KEY) === "true";
    if (!shouldHideModal) {
        setTimeout(showModal, 300);
    }

    if (closeModalBtn) closeModalBtn.addEventListener("click", hideModal);
    if (startPicksBtn) startPicksBtn.addEventListener("click", hideModal);
    if (openInstructionsBtn) openInstructionsBtn.addEventListener("click", showModal);

    if (instructionsModal) {
        instructionsModal.addEventListener("click", (e) => {
            if (e.target === instructionsModal) hideModal();
        });
    }

    // ==========================================================================
    // 2. SISTEMA DE TOAST NOTIFICATIONS
    // ==========================================================================

    let toastTimer = null;
    const showToast = (message, icon = "ℹ️", duration = 3500) => {
        if (!toastNotification) return;
        clearTimeout(toastTimer);
        toastMessage.textContent = message;
        toastIcon.textContent = icon;
        toastNotification.classList.add("active");

        toastTimer = setTimeout(() => {
            toastNotification.classList.remove("active");
        }, duration);
    };

    // ==========================================================================
    // 3. ASIGNACIÓN Y GESTIÓN DEL PODIO
    // ==========================================================================

    const getAssignedCount = () => {
        return Object.values(currentPicks).filter(val => val !== null).length;
    };

    const updateCounterUI = () => {
        const count = getAssignedCount();
        if (assignedCountText) {
            assignedCountText.textContent = `${count}/4`;
        }
    };

    // Renderiza el contenido de un casillero del podio
    const renderSlot = (pos) => {
        const slotEl = document.getElementById(`slot-content-${pos}`);
        if (!slotEl) return;

        const teamId = currentPicks[pos];

        if (!teamId) {
            // Casillero vacío
            slotEl.className = "slot-card-content empty";
            const iconMap = { 1: "🥇", 2: "🥈", 3: "🥉", 4: "🎖️" };
            const titleMap = { 1: "Primer Lugar", 2: "Segundo Lugar", 3: "Tercer Lugar", 4: "Cuarto Lugar" };
            slotEl.innerHTML = `
                <div class="empty-placeholder">
                    <span class="placeholder-icon">${iconMap[pos]}</span>
                    <span class="placeholder-title">${titleMap[pos]}</span>
                    <span class="placeholder-hint">Haz clic en un equipo</span>
                </div>
            `;
            return;
        }

        const team = TEAMS_DATA[teamId];
        if (!team) return;

        slotEl.className = "slot-card-content filled";
        slotEl.innerHTML = `
            <div class="slot-filled-card ${team.colorClass}">
                <img src="${team.logo}" alt="${team.name}" class="filled-team-logo">
                <span class="filled-team-name">${team.name}</span>
                <span class="filled-team-motto">${team.motto}</span>
                ${!isLocked ? `<button type="button" class="btn-remove-slot" data-pos="${pos}">✕ Quitar</button>` : ""}
            </div>
        `;

        if (!isLocked) {
            const removeBtn = slotEl.querySelector(".btn-remove-slot");
            if (removeBtn) {
                removeBtn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    unassignTeam(pos);
                });
            }
        }
    };

    // Actualiza las tarjetas del banco de equipos
    const updateTeamPoolCards = () => {
        Object.keys(TEAMS_DATA).forEach(teamId => {
            const cardEl = document.getElementById(`teamCard-${teamId}`);
            const badgeEl = document.getElementById(`badge-${teamId}`);
            const assignBtn = document.getElementById(`assignBtn-${teamId}`);

            // Buscar en que posicion esta asignado
            const assignedPos = Object.keys(currentPicks).find(pos => currentPicks[pos] === teamId);

            if (assignedPos) {
                if (cardEl) cardEl.classList.add("assigned");
                if (badgeEl) {
                    const placeName = { "1": "1º Campeón", "2": "2º Puesto", "3": "3º Puesto", "4": "4º Puesto" }[assignedPos];
                    badgeEl.textContent = `En #${placeName}`;
                }
                if (assignBtn) {
                    assignBtn.textContent = `Asignado en #${assignedPos}`;
                    assignBtn.disabled = true;
                }
            } else {
                if (cardEl) cardEl.classList.remove("assigned");
                if (badgeEl) badgeEl.textContent = "Disponible";
                if (assignBtn) {
                    assignBtn.textContent = "Asignar al Podio +";
                    assignBtn.disabled = isLocked;
                }
            }
        });
    };

    // Asignar un equipo a la primera casilla libre
    const assignTeam = (teamId) => {
        if (isLocked) {
            showToast("Tus picks están bloqueados. Desbloquéalos si deseas modificarlos.", "🔒");
            return;
        }

        // Si ya está asignado, quitarlo de su posicion anterior
        const existingPos = Object.keys(currentPicks).find(p => currentPicks[p] === teamId);
        if (existingPos) {
            currentPicks[existingPos] = null;
            renderSlot(existingPos);
        }

        // Buscar el primer slot vacío
        const firstEmptyPos = [1, 2, 3, 4].find(pos => currentPicks[pos] === null);

        if (!firstEmptyPos) {
            showToast("El podio ya está completo. Haz clic en '✕ Quitar' en un puesto para cambiarlo.", "⚠️");
            return;
        }

        currentPicks[firstEmptyPos] = teamId;
        renderSlot(firstEmptyPos);
        updateTeamPoolCards();
        updateCounterUI();
        validateForm();

        const team = TEAMS_DATA[teamId];
        showToast(`${team.name} asignado en puesto #${firstEmptyPos}`, "✅");
    };

    // Quitar equipo de un slot
    const unassignTeam = (pos) => {
        if (isLocked) return;
        const teamId = currentPicks[pos];
        if (!teamId) return;

        currentPicks[pos] = null;
        renderSlot(pos);
        updateTeamPoolCards();
        updateCounterUI();
        validateForm();

        const team = TEAMS_DATA[teamId];
        showToast(`${team.name} retirado del podio`, "🗑️");
    };

    // Asignar listeners a las tarjetas del banco
    Object.keys(TEAMS_DATA).forEach(teamId => {
        const card = document.getElementById(`teamCard-${teamId}`);
        const assignBtn = document.getElementById(`assignBtn-${teamId}`);

        if (card) {
            card.addEventListener("click", () => {
                const isAssigned = Object.values(currentPicks).includes(teamId);
                if (!isAssigned) {
                    assignTeam(teamId);
                }
            });
        }

        if (assignBtn) {
            assignBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                assignTeam(teamId);
            });
        }
    });

    // Permitir hacer clic en un slot vacío para indicar que elija un equipo
    [1, 2, 3, 4].forEach(pos => {
        const slot = document.getElementById(`slot-${pos}`);
        if (slot) {
            slot.addEventListener("click", () => {
                if (!currentPicks[pos] && !isLocked) {
                    showToast(`Selecciona uno de los equipos disponibles para el puesto #${pos}`, "👇");
                }
            });
        }
    });

    // Reiniciar selecciones
    if (resetPicksBtn) {
        resetPicksBtn.addEventListener("click", () => {
            if (isLocked) {
                showToast("Desbloquea tus picks primero para poder reiniciar.", "🔒");
                return;
            }

            if (confirm("¿Deseas reiniciar todas tus predicciones del podio?")) {
                currentPicks = { 1: null, 2: null, 3: null, 4: null };
                [1, 2, 3, 4].forEach(renderSlot);
                updateTeamPoolCards();
                updateCounterUI();
                validateForm();
                showToast("Selecciones restablecidas", "🔄");
            }
        });
    }

    // ==========================================================================
    // 4. VALIDACIÓN DEL FORMULARIO Y BLOQUEO DE PICKS
    // ==========================================================================

    const validateForm = () => {
        const count = getAssignedCount();
        const userName = userNameInput ? userNameInput.value.trim() : "";
        const userDiscord = userDiscordInput ? userDiscordInput.value.trim() : "";

        if (count < 4) {
            validationStatusBox.className = "validation-status-box";
            statusIconWrap.textContent = "⚠️";
            statusTitle.textContent = `Picks Incompletos (${count}/4 asignados)`;
            statusDesc.textContent = "Debes asignar a los 4 equipos en el podio (1º, 2º, 3º y 4º lugar).";
            if (lockPicksBtn) lockPicksBtn.disabled = true;
            return false;
        }

        if (!userName || !userDiscord) {
            validationStatusBox.className = "validation-status-box";
            statusIconWrap.textContent = "📝";
            statusTitle.textContent = "Datos Requeridos";
            statusDesc.textContent = "¡Podio completo! Completa tu Nickname y tu usuario de Discord abajo para poder bloquear.";
            if (lockPicksBtn) lockPicksBtn.disabled = true;
            return false;
        }

        validationStatusBox.className = "validation-status-box valid";
        statusIconWrap.textContent = "✨";
        statusTitle.textContent = "¡Todo Listo para Bloquear!";
        statusDesc.textContent = "Tus 4 puestos y datos están completos. Haz clic en el botón de abajo para registrar tu boleto oficial.";
        if (lockPicksBtn) lockPicksBtn.disabled = false;
        return true;
    };

    if (userNameInput) userNameInput.addEventListener("input", validateForm);
    if (userDiscordInput) userDiscordInput.addEventListener("input", validateForm);

    // ==========================================================================
    // 5. GUARDADO Y PERSISTENCIA (LOCALSTORAGE)
    // ==========================================================================

    const savePicksToStorage = () => {
        const mvpRadio = document.querySelector('input[name="mvpPrediction"]:checked');
        const selectedMvp = mvpRadio ? mvpRadio.value : "Sin definir";

        const payload = {
            picks: { ...currentPicks },
            mvp: selectedMvp,
            userName: userNameInput.value.trim(),
            userDiscord: userDiscordInput.value.trim(),
            lockedAt: new Date().toISOString(),
            isLocked: true
        };

        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload));
        applyLockedState(payload);
        showToast("¡Tus picks han sido bloqueados y guardados con éxito!", "🏆", 4000);
    };

    const applyLockedState = (data) => {
        isLocked = true;
        currentPicks = { ...data.picks };

        // Inputs deshabilitados
        if (userNameInput) {
            userNameInput.value = data.userName || "";
            userNameInput.disabled = true;
        }
        if (userDiscordInput) {
            userDiscordInput.value = data.userDiscord || "";
            userDiscordInput.disabled = true;
        }

        // MVP seleccionado
        if (data.mvp) {
            const radio = document.querySelector(`input[name="mvpPrediction"][value="${data.mvp}"]`);
            if (radio) radio.checked = true;
        }
        document.querySelectorAll('input[name="mvpPrediction"]').forEach(r => r.disabled = true);

        // Deshabilitar botón de bloqueo
        if (lockPicksBtn) {
            lockPicksBtn.disabled = true;
            lockPicksBtn.innerHTML = `<span>✅ PICKS BLOQUEADOS CON ÉXITO</span>`;
        }

        // Mostrar Banner de estado
        if (savedStateCard) {
            savedStateCard.style.display = "block";
            const dateObj = data.lockedAt ? new Date(data.lockedAt) : new Date();
            const dateString = dateObj.toLocaleDateString("es-MX", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            });
            if (savedTimestampText) {
                savedTimestampText.textContent = `(Registrado el ${dateString} • Nick: ${data.userName} • Discord: ${data.userDiscord})`;
            }
        }

        // Renderizar slots y pool
        [1, 2, 3, 4].forEach(renderSlot);
        updateTeamPoolCards();
        updateCounterUI();
        validateForm();
    };

    // Desbloquear picks para editar
    const unlockPicks = () => {
        if (!confirm("¿Deseas desbloquear tus predicciones para hacer cambios?")) return;

        isLocked = false;
        if (userNameInput) userNameInput.disabled = false;
        if (userDiscordInput) userDiscordInput.disabled = false;
        document.querySelectorAll('input[name="mvpPrediction"]').forEach(r => r.disabled = false);

        if (savedStateCard) savedStateCard.style.display = "none";
        if (lockPicksBtn) {
            lockPicksBtn.innerHTML = `
                <span class="lock-icon">🔒</span>
                <span>BLOQUEAR Y GUARDAR PICKS</span>
            `;
        }

        const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (raw) {
            try {
                const data = JSON.parse(raw);
                data.isLocked = false;
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
            } catch (e) {}
        }

        [1, 2, 3, 4].forEach(renderSlot);
        updateTeamPoolCards();
        validateForm();
        showToast("Picks desbloqueados para edición.", "🔓");
    };

    if (unlockPicksBtn) unlockPicksBtn.addEventListener("click", unlockPicks);

    // Enviar / Bloquear Formulario
    if (pickemsForm) {
        pickemsForm.addEventListener("submit", (e) => {
            e.preventDefault();
            if (validateForm()) {
                savePicksToStorage();
            } else {
                showToast("Por favor revisa los requisitos antes de bloquear tus picks.", "⚠️");
            }
        });
    }

    // ==========================================================================
    // 6. COPIAR FORMATO PARA DISCORD
    // ==========================================================================

    const copyDiscordSummary = () => {
        const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
        let data = {};
        if (raw) {
            try { data = JSON.parse(raw); } catch (e) {}
        }

        const user = data.userName || (userNameInput ? userNameInput.value.trim() : "Participante");
        const discord = data.userDiscord || (userDiscordInput ? userDiscordInput.value.trim() : "Discord");
        const mvp = data.mvp || "Araxys Vanguard";

        const p1 = TEAMS_DATA[currentPicks[1]] ? TEAMS_DATA[currentPicks[1]].name : "Pendiente";
        const p2 = TEAMS_DATA[currentPicks[2]] ? TEAMS_DATA[currentPicks[2]].name : "Pendiente";
        const p3 = TEAMS_DATA[currentPicks[3]] ? TEAMS_DATA[currentPicks[3]].name : "Pendiente";
        const p4 = TEAMS_DATA[currentPicks[4]] ? TEAMS_DATA[currentPicks[4]].name : "Pendiente";

        const text = `🏆 **MIS PICKS - ARAXYS CIRCUIT 2026** 🏆\n` +
                     `👤 **Usuario:** ${user} | **Discord:** ${discord}\n` +
                     `━━━━━━━━━━━━━━━━━━━━\n` +
                     `🥇 **1º Lugar (Campeón):** ${p1}\n` +
                     `🥈 **2º Lugar (Subcampeón):** ${p2}\n` +
                     `🥉 **3º Lugar:** ${p3}\n` +
                     `🎖️ **4º Lugar:** ${p4}\n` +
                     `⭐ **MVP / Kill Leader:** ${mvp}\n` +
                     `━━━━━━━━━━━━━━━━━━━━\n` +
                     `⚡ Participa tú también en: https://araxys.xyz/circuito/pickems.html`;

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                showToast("¡Copiado al portapapeles! Pégalo en el canal #pickems de Discord.", "📋", 4000);
            }).catch(() => {
                fallbackCopyText(text);
            });
        } else {
            fallbackCopyText(text);
        }
    };

    const fallbackCopyText = (text) => {
        const temp = document.createElement("textarea");
        temp.value = text;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand("copy");
        document.body.removeChild(temp);
        showToast("¡Copiado al portapapeles! Pégalo en el Discord oficial.", "📋", 4000);
    };

    if (copyDiscordBtn) copyDiscordBtn.addEventListener("click", copyDiscordSummary);

    // ==========================================================================
    // 7. INICIALIZACIÓN AL CARGAR
    // ==========================================================================

    const initApp = () => {
        const savedDataRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedDataRaw) {
            try {
                const savedData = JSON.parse(savedDataRaw);
                if (savedData && savedData.isLocked) {
                    applyLockedState(savedData);
                    return;
                } else if (savedData && savedData.picks) {
                    currentPicks = { ...savedData.picks };
                    if (userNameInput) userNameInput.value = savedData.userName || "";
                    if (userDiscordInput) userDiscordInput.value = savedData.userDiscord || "";
                    if (savedData.mvp) {
                        const r = document.querySelector(`input[name="mvpPrediction"][value="${savedData.mvp}"]`);
                        if (r) r.checked = true;
                    }
                }
            } catch (e) {
                console.error("Error al cargar datos locales de Pick'Ems:", e);
            }
        }

        [1, 2, 3, 4].forEach(renderSlot);
        updateTeamPoolCards();
        updateCounterUI();
        validateForm();
    };

    initApp();

});
