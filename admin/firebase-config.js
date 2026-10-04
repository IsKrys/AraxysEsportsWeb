/* ==============================================================
   ARAXYS ESPORTS — FIREBASE CONFIGURATION
   Almacén y validador de credenciales de Google Firebase
   ============================================================== */

const ARAXYS_FIREBASE_STORAGE_KEY = "araxys_firebase_config_v1";

// Configuración oficial de Google Firebase para Araxys Esports
const DEFAULT_FIREBASE_CONFIG = {
    apiKey: "AIzaSyDosirX4w6VQ3eYRk0tbU9GAyUQ5LKWqQ4",
    authDomain: "araxys-esports.firebaseapp.com",
    projectId: "araxys-esports",
    storageBucket: "araxys-esports.firebasestorage.app",
    messagingSenderId: "752132311397",
    appId: "1:752132311397:web:21a69d26e1ff2989f3f98c"
};

/**
 * Obtiene la configuración activa de Firebase (desde localStorage o valor por defecto)
 */
function getActiveFirebaseConfig() {
    try {
        const stored = localStorage.getItem(ARAXYS_FIREBASE_STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed && typeof parsed === "object" && parsed.projectId && parsed.apiKey) {
                return parsed;
            }
        }
    } catch (err) {
        console.warn("[FirebaseConfig] Error leyendo configuración de localStorage:", err);
    }
    return DEFAULT_FIREBASE_CONFIG;
}

/**
 * Guarda la configuración de Firebase en localStorage
 */
function saveFirebaseConfig(config) {
    if (!config || typeof config !== "object") return false;
    try {
        localStorage.setItem(ARAXYS_FIREBASE_STORAGE_KEY, JSON.stringify(config));
        return true;
    } catch (err) {
        console.error("[FirebaseConfig] Error guardando configuración:", err);
        return false;
    }
}

/**
 * Borra la configuración de Firebase para volver a Modo Local (offline)
 */
function clearFirebaseConfig() {
    try {
        localStorage.removeItem(ARAXYS_FIREBASE_STORAGE_KEY);
        return true;
    } catch (err) {
        return false;
    }
}

/**
 * Valida si la configuración contiene los campos mínimos requeridos
 */
function isFirebaseConfigValid(config) {
    return Boolean(
        config &&
        typeof config.apiKey === "string" && config.apiKey.trim().length > 10 &&
        typeof config.projectId === "string" && config.projectId.trim().length > 2
    );
}

/**
 * Intenta parsear un snippet de código o JSON copiado desde Firebase Console
 * Admite:
 * 1. JSON estándar: { "apiKey": "...", "projectId": "..." }
 * 2. Objeto JS: const firebaseConfig = { apiKey: "...", projectId: "..." };
 */
function parseFirebaseSnippet(snippet) {
    if (!snippet || typeof snippet !== "string") return null;
    const clean = snippet.trim();

    // 1. Probar JSON directo
    try {
        const parsed = JSON.parse(clean);
        if (parsed && (parsed.apiKey || parsed.projectId)) return parsed;
    } catch (_) {}

    // 2. Extraer cuerpo de llaves { ... }
    const match = clean.match(/\{[\s\S]*\}/);
    if (match) {
        const rawObj = match[0];
        try {
            // Convertir claves sin comillas a comillas dobles y comillas simples a dobles
            const jsonified = rawObj
                .replace(/([a-zA-Z0-9_]+)\s*:/g, '"$1":')
                .replace(/'([^']*)'/g, '"$1"')
                .replace(/,(\s*[\}\]])/g, '$1');
            const parsed = JSON.parse(jsonified);
            if (parsed && (parsed.apiKey || parsed.projectId)) return parsed;
        } catch (e) {
            console.warn("[FirebaseConfig] Falló el parser regex, intentando extracción campo por campo:", e);
        }
    }

    // 3. Extracción de respaldo campo por campo con Regex
    const result = {};
    const fields = ["apiKey", "authDomain", "projectId", "storageBucket", "messagingSenderId", "appId"];
    fields.forEach(field => {
        const regex = new RegExp(`${field}\\s*:\\s*["']([^"']+)["']`);
        const m = clean.match(regex);
        if (m && m[1]) {
            result[field] = m[1].trim();
        }
    });

    if (result.apiKey || result.projectId) {
        return result;
    }

    return null;
}
