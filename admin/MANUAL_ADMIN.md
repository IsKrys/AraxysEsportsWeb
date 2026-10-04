# 🛡️ Araxys Esports — Manual Oficial del CMS y Panel de Administración

Bienvenido al Centro de Mando de **Araxys Esports** (`https://araxys.xyz/admin/`). Este panel ha sido diseñado para gestionar noticias, divisiones competitivas, staff y recursos oficiales con sincronización en tiempo real en la nube y control de acceso granular basado en roles (RBAC).

---

## 1. 🔑 Acceso y Credenciales del Fundador / CEO

* **Ruta de Acceso:** `https://araxys.xyz/admin/` (o en local: `http://localhost:8000/admin/index.html`)
* **Usuario Maestro:** `Krys` (o correo: `krys@araxys.xyz`)
* **Contraseña Inicial:** `admin`

> 💡 *Nota de Seguridad:* Solo el CEO tiene acceso a la pestaña de **Auditoría, Historial de Cambios y Papelera de Recuperación** y a la **Gestión de Staff**.

---

## 2. 👥 Roles y Permisos del Sistema (RBAC)

El panel cuenta con restricciones automáticas de interfaz y operaciones según el rol del usuario:

| Rol | Insignia | Alcance de Permisos |
| :--- | :--- | :--- |
| **CEO / Administrador** | 👑 CEO | **Control Total:** Noticias, Rosters, Torneos, Kit de Marca, Staff, Auditoría y Papelera. |
| **Prensa & Redacción** | 📰 Editor | **Contenido:** Redactar, editar y publicar Noticias y Torneos. No tiene acceso a Rosters ni Staff. |
| **Coach Titular** | 🛡️ Titular | **Exclusivo:** Solo puede ver y modificar los jugadores de **Araxys Titular**. |
| **Coach Prime** | 🎯 Prime | **Exclusivo:** Solo puede ver y modificar los jugadores de **Araxys Prime** (Chiflesinho). |
| **Coach Vanguard** | ⚡ Vanguard | **Exclusivo:** Solo puede ver y modificar los jugadores de **Araxys Vanguard**. |
| **Coach Wolf** | 🐺 Wolf | **Exclusivo:** Solo puede ver y modificar los jugadores de **Araxys Wolf**. |
| **Coach Nexus** | 🔮 Nexus | **Exclusivo:** Solo puede ver y modificar los jugadores de **Araxys Nexus** (División Sorpresa). |

---

## 3. ➕ Cómo dar de alta a un nuevo miembro del Staff

1. Inicia sesión como **CEO (`Krys`)**.
2. En el menú lateral, dirígete a **🛡️ Gestión de Staff**.
3. Haz clic en el botón **`+ Añadir Miembro`**.
4. Completa los datos:
   * **Nombre / Gamertag:** Ej: `Chiflesinho`, `Redacción Prensa`.
   * **Usuario / Correo:** Ej: `chifle@araxys.xyz`.
   * **Rol:** Selecciona el rol correspondiente (CEO, Editor o Coach de la división específica).
   * **Contraseña inicial:** Asigna una clave segura (ej: `araxys2026`).
5. Haz clic en **Guardar Miembro**.
6. Pásale el enlace del panel (`https://araxys.xyz/admin/`) con su usuario y contraseña. Al ingresar, el sistema adaptará automáticamente el panel a sus permisos específicos.

---

## 4. 🎨 Estudio de Optimización WebP (Conversor Integrado)

Para mantener la máxima velocidad de carga en la web oficial:
1. En la pestaña **🎨 Kit de Marca & Recursos**, encontrarás el **Estudio WebP**.
2. Arrastra cualquier archivo `.png`, `.jpg` o `.jpeg`.
3. El motor de HTML5 Canvas comprimirá la imagen a formato `.webp` reduciendo el peso entre un **60% y 85%** sin pérdida perceptible de calidad.
4. Puedes descargar la imagen convertida o asignarla directamente a una noticia con un clic.

---

## 5. 📜 Auditoría, Historial y Papelera de Recuperación (Trash & Restore)

Para evitar que un miembro borre información por error:
* **Eliminación Segura (Soft-Delete):** Ninguna noticia o jugador se borra de golpe de la base de datos; primero se traslada a la **Papelera de Recuperación**.
* **Restauración con 1 Clic:** Desde la pestaña **Auditoría & Papelera**, el CEO puede hacer clic en **`↺ Restaurar`** para devolver cualquier elemento a la web pública de forma instantánea.
* **Inspección de Cambios (Diff Snapshot):** En la sub-pestaña **Historial de Actividad**, el CEO puede ver quién modificó cada elemento y hacer clic en **`🔍 Ver Datos`** para inspeccionar los datos exactos antes y después de cada cambio.

---

## 6. ☁️ Google Cloud Firestore (Sincronización en Tiempo Real)

* **Indicador en Topbar:**
  * 🟢 **Conectado a Firestore:** Sincronizando en vivo entre todas las computadoras.
  * ⚪ **Modo Local:** Respaldo offline guardado en el navegador.
* **Colecciones en la Nube:**
  * `araxys_news` — Artículos publicados y borradores.
  * `araxys_players` — Jugadores de las 5 divisiones.
  * `araxys_staff` — Credenciales y roles del equipo.
  * `araxys_trash` — Papelera sincronizada.
  * `araxys_activity_log` — Registro de auditoría.
* **Reglas de Seguridad Definitivas (Firebase Console):**
  Asegúrate de que en la consola de Firebase (`console.firebase.google.com`) &rarr; **Firestore Database** &rarr; pestaña **Reglas (Rules)** esté publicado:
  ```javascript
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /{document=**} {
        allow read, write: if true;
      }
    }
  }
  ```

---

## 7. 🚀 Web Pública Dinámica

Tanto la sección de noticias ([`news/news.html`](file:///C:/Users/Administrator/Documents/GitHub/AraxysEsportsWeb/news/news.html)) como las 5 divisiones de equipos ([`teams/teams.html`](file:///C:/Users/Administrator/Documents/GitHub/AraxysEsportsWeb/teams/teams.html)) leen los datos directamente de Firestore en tiempo real. 

Cualquier cambio guardado en el panel se refleja de forma instantánea para los visitantes de la página web oficial.
