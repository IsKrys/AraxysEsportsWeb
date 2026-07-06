document.addEventListener("DOMContentLoaded", () => {

    const path = window.location.pathname.toLowerCase();

    if(path.endsWith("/") || path.endsWith("/index.html")){
        document.body.classList.add("home-page");
    }

    // MODO OSCURO / MODO CLARO

    const savedTheme = localStorage.getItem("araxys-theme");

    if(savedTheme === "dark"){
        document.body.classList.add("dark-mode");
    }

    const header = document.querySelector("header");
    const nav = document.querySelector("nav");

    if(header && nav && !document.querySelector(".theme-toggle")){

        const themeToggle = document.createElement("button");

        themeToggle.className = "theme-toggle";
        themeToggle.type = "button";

        const updateThemeButton = () => {

            const isDarkMode = document.body.classList.contains("dark-mode");

            themeToggle.textContent = isDarkMode ? "☀" : "☾";
            themeToggle.setAttribute(
                "aria-label",
                isDarkMode ? "Activar modo claro" : "Activar modo oscuro"
            );
            themeToggle.setAttribute(
                "title",
                isDarkMode ? "Modo claro" : "Modo oscuro"
            );

        };

        updateThemeButton();

        themeToggle.addEventListener("click", () => {

            document.body.classList.toggle("dark-mode");

            const isDarkMode = document.body.classList.contains("dark-mode");

            localStorage.setItem("araxys-theme", isDarkMode ? "dark" : "light");

            updateThemeButton();

        });

        header.insertBefore(themeToggle, nav.nextSibling);

    }



    // HEADER AL HACER SCROLL

    window.addEventListener("scroll", () => {

        const header = document.querySelector("header");

        if(!header) return;

        if(window.scrollY > 100){
            header.classList.add("scrolled");
        }else{
            header.classList.remove("scrolled");
        }

    });



    // TRANSICIÓN ENTRE PÁGINAS

    document.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", function(e){

            const href = this.getAttribute("href");

            if(
                href &&
                !href.startsWith("#") &&
                !href.startsWith("http") &&
                !this.hasAttribute("target")
            ){

                e.preventDefault();

                document.querySelector(".page-transition")
.classList.add("active");

                setTimeout(() => {

                    window.location.href = href;

                }, 300);

            }

        });

    });

});
