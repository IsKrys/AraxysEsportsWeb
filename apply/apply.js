const roleCards = document.querySelectorAll(".role-card");

const modal = document.getElementById("applyModal");
const modalClose = document.getElementById("modalClose");

const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");

const discordLink = document.getElementById("discordLink");
const showFormBtn = document.getElementById("showFormBtn");

const applyForm = document.getElementById("applyForm");
const dynamicFields = document.getElementById("dynamicFields");
const successScreen = document.getElementById("successScreen");
const closeSuccessBtn = document.getElementById("closeSuccessBtn");

let selectedRole = "";

const roleData = {
    Jugador: {
        type: "jugadores",
        title: "Jugador",
        description: "¿Quieres representar a Araxys como jugador? Completa tu formulario.",
        questions: [
            "Nombre",
            "Usuario de Discord",
            "Edad",
            "¿Rango actual?",
            "Rol o roles principales",
            "¿Qué server juegas y cuál es tu disponibilidad horaria?",
            "¿Qué crees que puedes aportar al equipo?",
            "¿Cuál consideras que es tu mayor fortaleza como jugador?",
            "¿Cuál sería tu aspecto a mejorar?",
            "Deja un link a tu tracker"
        ]
    },

    Streamer: {
        type: "streamer",
        title: "Streamer",
        description: "Crea contenido, conecta con la comunidad y crece junto a otros creadores de Araxys.",
        questions: [
            "Nombre",
            "Usuario de Discord",
            "Edad",
            "¿Cuál es tu rango actual?",
            "Rol o roles principales",
            "Servidor y disponibilidad de horario",
            "¿Cuántos seguidores tienes? Agrega un link a tu canal",
            "¿Con qué frecuencia realizas transmisiones?",
            "¿Cuál consideras que es tu mayor fortaleza como jugador?",
            "¿Y tu mayor aspecto a mejorar?",
            "Tracker"
        ]
    },

    Coach: {
        type: "coach",
        title: "Coach",
        description: "Guía entrenamientos, analiza partidas y acompaña a los equipos para mejorar su rendimiento.",
        questions: [
            "Nombre",
            "Usuario de Discord",
            "¿Cuánto deseas recibir por tu servicio en USD? Puedes hacerlo gratis temporalmente si lo deseas",
            "Rango actual",
            "Servidor y disponibilidad horaria",
            "¿Has sido coach anteriormente? ¿Cuánto tiempo?",
            "¿Cómo describirías tu forma de enseñar?",
            "¿Qué esperas aportar a los jugadores?",
            "¿Por qué deberíamos elegirte?",
            "Agrega el link a tu tracker en caso de tenerlo"
        ]
    },

    Caster: {
        type: "caster",
        title: "Caster",
        description: "Narra partidas, presenta eventos y ayuda a que los torneos de Araxys tengan más energía.",
        questions: [
            "Nombre",
            "Usuario de Discord",
            "Edad",
            "País",
            "¿Has realizado casteos anteriormente? ¿Dónde?",
            "¿Qué días y horas tienes disponibles?",
            "¿Qué crees que hace a un buen caster?",
            "¿Por qué te interesa ser caster en Araxys?"
        ]
    }
};

function createFields(role){

    dynamicFields.innerHTML = "";

    const questions = roleData[role].questions;

    questions.forEach((question, index) => {

        const fieldName = `question_${index}`;

        let field;

        if(question.length > 55){
            field = document.createElement("textarea");
        }else{
            field = document.createElement("input");
            field.type = "text";
        }

        field.name = fieldName;
        field.placeholder = question;
        field.dataset.question = question;

        if(index === 0 || question.includes("Discord")){
            field.required = true;
        }

        dynamicFields.appendChild(field);

    });

}

roleCards.forEach(card => {

    card.addEventListener("click", () => {

        selectedRole = card.getAttribute("data-role");

        const info = roleData[selectedRole];

        modalTitle.textContent = `Aplicar como ${info.title}`;
        modalDescription.textContent = info.description;

        discordLink.href = "https://discord.gg/Fc2QdZGAyJ";

        applyForm.classList.remove("active");
        applyForm.reset();
        successScreen.classList.remove("active");

        const formStatus = document.getElementById("formStatus");
        formStatus.className = "form-status";
        formStatus.textContent = "";

        createFields(selectedRole);

        modal.classList.add("active");

    });

});

showFormBtn.addEventListener("click", () => {
    applyForm.classList.toggle("active");
});

applyForm.addEventListener("submit", async e => {

    e.preventDefault();

    const submitBtn = applyForm.querySelector("button[type='submit']");
    const formStatus = document.getElementById("formStatus");

    const lastSubmit = localStorage.getItem("lastApplySubmit");
    const now = Date.now();

    if(lastSubmit && now - lastSubmit < 30000){
        formStatus.className = "form-status error";
        formStatus.textContent = "Espera unos segundos antes de enviar otra solicitud.";
        return;
    }

    localStorage.setItem("lastApplySubmit", now);

    const info = roleData[selectedRole];

    const fields = dynamicFields.querySelectorAll("input, textarea");

    const answers = {};

    fields.forEach(field => {
        answers[field.dataset.question] = field.value;
    });

    const data = {
        type: info.type,
        role: info.title,
        answers: answers
    };

    submitBtn.disabled = true;
    submitBtn.textContent = "Enviando...";

    const response = await fetch("https://araxys-api.araxysoficial.workers.dev/apply", {
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(data)
    });

    if(response.ok){

        formStatus.className = "form-status";
        formStatus.textContent = "";

        applyForm.classList.remove("active");
        applyForm.reset();

        successScreen.classList.add("active");

        submitBtn.disabled = false;
        submitBtn.textContent = "Enviar aplicación";

    }else{

        formStatus.className = "form-status error";
        formStatus.textContent = "Hubo un error al enviar la aplicación. Intenta de nuevo.";

        submitBtn.disabled = false;
        submitBtn.textContent = "Enviar aplicación";
    }

});

modalClose.addEventListener("click", () => {
    modal.classList.remove("active");
});

modal.addEventListener("click", e => {
    if(e.target === modal){
        modal.classList.remove("active");
    }
});

closeSuccessBtn.addEventListener("click", () => {

    successScreen.classList.remove("active");

    modal.classList.remove("active");

});
