/* ==============================================================
   ARAXYS ESPORTS — CARGADOR DINÁMICO DE NOTICIAS (FEED PÚBLICO)
   Carga en tiempo real las noticias publicadas desde Cloud Firestore
   ============================================================== */

(function () {
    const STORAGE_KEY_CONFIG = "araxys_firebase_config_v1";
    const STORAGE_KEY_NEWS = "araxys_news_v2";

    function renderFeed(newsItems) {
        if (!newsItems || newsItems.length === 0) return;

        const feedContainer = document.querySelector(".news-feed");
        if (!feedContainer) return;

        // Filtrar solo noticias publicadas y ordenar por fecha descendente
        const published = newsItems
            .filter(item => !item.status || item.status === "publicado")
            .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

        if (published.length === 0) return;

        let html = "";
        let index = 0;

        // Renderizar en bloques de 3 (estilo oficial Araxys Esports)
        while (index < published.length) {
            const isReverse = Math.floor(index / 3) % 2 === 1;
            const chunk = published.slice(index, index + 3);

            if (chunk.length === 3) {
                if (!isReverse) {
                    // Bloque Normal: Grande a la izquierda, 2 pequeñas a la derecha
                    const big = chunk[0];
                    const small1 = chunk[1];
                    const small2 = chunk[2];

                    html += `
                    <div class="news-block">
                        <a href="${getArticleLink(big)}" class="news-big">
                            <img src="${getCleanImgPath(big.image)}" alt="${big.title}" onerror="this.src='../img/logos/logo.png'">
                            <div class="news-overlay">
                                <span class="news-category">${big.category || "GENERAL"}</span>
                                <h3>${big.title}</h3>
                            </div>
                        </a>
                        <div class="news-side">
                            <a href="${getArticleLink(small1)}" class="news-small">
                                <img src="${getCleanImgPath(small1.image)}" alt="${small1.title}" onerror="this.src='../img/logos/logo.png'">
                                <div class="news-overlay">
                                    <span class="news-category">${small1.category || "GENERAL"}</span>
                                    <h3>${small1.title}</h3>
                                </div>
                            </a>
                            <a href="${getArticleLink(small2)}" class="news-small">
                                <img src="${getCleanImgPath(small2.image)}" alt="${small2.title}" onerror="this.src='../img/logos/logo.png'">
                                <div class="news-overlay">
                                    <span class="news-category">${small2.category || "GENERAL"}</span>
                                    <h3>${small2.title}</h3>
                                </div>
                            </a>
                        </div>
                    </div>`;
                } else {
                    // Bloque Reverse: 2 pequeñas a la izquierda, Grande a la derecha
                    const small1 = chunk[0];
                    const small2 = chunk[1];
                    const big = chunk[2];

                    html += `
                    <div class="news-block reverse">
                        <div class="news-side">
                            <a href="${getArticleLink(small1)}" class="news-small">
                                <img src="${getCleanImgPath(small1.image)}" alt="${small1.title}" onerror="this.src='../img/logos/logo.png'">
                                <div class="news-overlay">
                                    <span class="news-category">${small1.category || "GENERAL"}</span>
                                    <h3>${small1.title}</h3>
                                </div>
                            </a>
                            <a href="${getArticleLink(small2)}" class="news-small">
                                <img src="${getCleanImgPath(small2.image)}" alt="${small2.title}" onerror="this.src='../img/logos/logo.png'">
                                <div class="news-overlay">
                                    <span class="news-category">${small2.category || "GENERAL"}</span>
                                    <h3>${small2.title}</h3>
                                </div>
                            </a>
                        </div>
                        <a href="${getArticleLink(big)}" class="news-big">
                            <img src="${getCleanImgPath(big.image)}" alt="${big.title}" onerror="this.src='../img/logos/logo.png'">
                            <div class="news-overlay">
                                <span class="news-category">${big.category || "GENERAL"}</span>
                                <h3>${big.title}</h3>
                            </div>
                        </a>
                    </div>`;
                }
            } else {
                // Si sobran 1 o 2 artículos
                html += `<div class="news-block"><div class="news-side" style="width:100%; display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">`;
                chunk.forEach(item => {
                    html += `
                    <a href="${getArticleLink(item)}" class="news-small" style="height: 240px;">
                        <img src="${getCleanImgPath(item.image)}" alt="${item.title}" onerror="this.src='../img/logos/logo.png'">
                        <div class="news-overlay">
                            <span class="news-category">${item.category || "GENERAL"}</span>
                            <h3>${item.title}</h3>
                        </div>
                    </a>`;
                });
                html += `</div></div>`;
            }

            index += 3;
        }

        // Mantener botón "Ver más noticias" al final
        html += `
        <div class="news-more">
            <a href="#">Ver más noticias &rarr;</a>
        </div>`;

        feedContainer.innerHTML = html;
    }

    function getArticleLink(item) {
        if (item.slug && item.slug.startsWith("articles/")) return item.slug;
        if (item.slug) return `articles/${item.slug}`;
        return `#`;
    }

    function getCleanImgPath(img) {
        if (!img) return "../img/logos/logo.png";
        if (img.startsWith("../")) return img;
        if (img.startsWith("/")) return `..${img}`;
        if (img.startsWith("http")) return img;
        return `../${img}`;
    }

    // Inicialización al cargar la página
    document.addEventListener("DOMContentLoaded", async () => {
        // 1. Probar carga desde Firebase si el SDK y credenciales están disponibles
        try {
            const rawConfig = localStorage.getItem(STORAGE_KEY_CONFIG);
            if (rawConfig && typeof firebase !== "undefined") {
                const config = JSON.parse(rawConfig);
                if (config && config.projectId && config.apiKey) {
                    const app = firebase.apps.length > 0 ? firebase.app() : firebase.initializeApp(config);
                    const db = firebase.firestore();

                    db.collection("araxys_news")
                        .where("status", "==", "publicado")
                        .onSnapshot((snapshot) => {
                            if (!snapshot.empty) {
                                const cloudNews = [];
                                snapshot.forEach(doc => cloudNews.push(doc.data()));
                                renderFeed(cloudNews);
                            }
                        }, (err) => console.warn("[NewsFeed] Firestore read error:", err));
                    return;
                }
            }
        } catch (e) {
            console.warn("[NewsFeed] Modo fallback local:", e);
        }

        // 2. Si no hay Firebase activo pero hay noticias locales cacheadas
        try {
            const localCached = localStorage.getItem(STORAGE_KEY_NEWS);
            if (localCached) {
                const parsed = JSON.parse(localCached);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    renderFeed(parsed);
                }
            }
        } catch (_) {}
    });
})();
