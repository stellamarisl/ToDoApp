// ====== BIENVENIDA / LOGIN ======
const bienvenidaO = document.getElementById("bienvenidaO");
const app = document.getElementById("app");
const loginForm = document.getElementById("loginForm");
const nameInput = document.getElementById("nameInput");
const saludo = document.getElementById("saludo");

const nombreGuardado = localStorage.getItem("nombreUsuario");

function mostrarApp(nombre) {
    saludo.textContent = `Hola ${nombre}, ¿qué tenemos para hoy?`;
    bienvenidaO.classList.add("oculto");
    app.classList.remove("oculto");
    app.style.display = "block"; // Asegura que el app se muestre antes de la transición
    setTimeout(() => {
        app.style.opacity = "1";
    }, 50); // Pequeño delay para que se aplique la transición
}

if (nombreGuardado) {
    mostrarApp(nombreGuardado);
}

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = nameInput.value.trim();
    if (nombre === "") return;

    localStorage.setItem("nombreUsuario", nombre);
    mostrarApp(nombre);
});

// ====== TODO APP ======
const form = document.getElementById("todoForm");
const input = document.getElementById("todoInput");
const list = document.getElementById("todoList");
const contador = document.getElementById("contador");
const botonBorrarCompletadas = document.getElementById("borrarCompletadas");

let filtroActual = "todas";
let tareas = JSON.parse(localStorage.getItem("tareas")) || [];

function guardarTareas() {
    localStorage.setItem("tareas", JSON.stringify(tareas));
}

function actualizarContador() {
    const total = tareas.length;
    const completadas = tareas.filter(t => t.completada).length;
    contador.textContent = `Tareas: ${total} | Completadas: ${completadas}`;
}

function crearTareaEnDOM(tarea) {
    const li = document.createElement("li");
    const span = document.createElement("span");
    const btn = document.createElement("button");

    span.textContent = tarea.texto;
    btn.innerHTML = '<img src="/assets/compartimiento.png" alt="Eliminar tarea" class="btn-eliminar-img">'; 
    btn.classList.add("btn-eliminar");

    if (tarea.completada) {
        li.classList.add("completed");
    }

  // Marcar completada
    span.addEventListener("click", () => {
        const t = tareas.find(item => item.id === tarea.id);
        t.completada = !t.completada;
        guardarTareas();
        renderizarTareas();
    });

  // Editar con doble click
    span.addEventListener("dblclick", () => {
        const inputEditar = document.createElement("input");
        inputEditar.type = "text";
        inputEditar.value = tarea.texto;

        li.replaceChild(inputEditar, span);
        inputEditar.focus();

        inputEditar.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            const nuevoTexto = inputEditar.value.trim();
        if (nuevoTexto === "") return;

        tareas[index].texto = nuevoTexto;
        guardarTareas();
        renderizarTareas();
    }
    });
});

  // Borrar tarea
btn.addEventListener("click", () => {
    tareas = tareas.filter(t => t.id !== tarea.id);
    guardarTareas();
    renderizarTareas();
});

    li.appendChild(span);
    li.appendChild(btn);
    list.appendChild(li);
}

function renderizarTareas() {
    list.innerHTML = "";
    let tareasFiltradas = tareas.filter(t => {
        if (filtroActual === "pendientes") return !t.completada;
        if (filtroActual === "completadas") return t.completada;
        return true;
    });
    tareasFiltradas.forEach(tarea => crearTareaEnDOM(tarea));
    actualizarContador();
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const texto = input.value.trim();
    if (texto === "") return;

    // Agregamos un ID único con Date.now()
    tareas.push({ id: Date.now(), texto: texto, completada: false });
    guardarTareas();
    renderizarTareas();
    input.value = "";
});


// Filtros
document.querySelectorAll("#filtros button").forEach(btn => {
    btn.addEventListener("click", () => {
        filtroActual = btn.dataset.filtro;
        renderizarTareas();
});
});

// Borrar completadas
botonBorrarCompletadas.addEventListener("click", () => {
    tareas = tareas.filter(t => !t.completada);
    guardarTareas();
    renderizarTareas();
});

// Inicializar
renderizarTareas();

