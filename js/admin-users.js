let usuariosGlobal = [];
const user = JSON.parse(localStorage.getItem("user"));

if (!user || user.role !== "admin") {
    window.location.href = "../pages/login.html";
}

// Evita romper el HTML / inyección de código cuando un dato del usuario
// (nombre, email, etc.) contiene comillas, < > o &
function escapeHtml(texto) {
    if (texto === null || texto === undefined) return "";
    return String(texto)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

// Función única para pintar la tabla (antes estaba duplicada)
function renderTabla(lista) {
    const tabla = document.getElementById("usuariosTable");
    tabla.innerHTML = "";

    lista.forEach(usuario => {
        tabla.innerHTML += `
            <tr>
                <td>${usuario.id}</td>
                <td>${escapeHtml(usuario.full_name)}</td>
                <td>${escapeHtml(usuario.email)}</td>
                <td>
                    <span class="badge ${escapeHtml(usuario.role)}">
                        ${escapeHtml(usuario.role)}
                    </span>
                </td>
                <td>
                    ${usuario.created_at
                        ? new Date(usuario.created_at).toLocaleDateString("es-CL")
                        : "-"}
                </td>
                <td>
                    <button class="btn-editar" data-id="${usuario.id}">Editar</button>
                    <button class="btn-eliminar" data-id="${usuario.id}">Eliminar</button>
                </td>
            </tr>
        `;
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    const tabla = document.getElementById("usuariosTable");

    try {
        const token = localStorage.getItem("token");

        const response = await fetch(
            "http://localhost:3000/api/users",
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const data = await response.json();
        console.log("Usuarios:", data);

        if (!response.ok) {
            throw new Error(data.message || "Error al obtener usuarios");
        }

        usuariosGlobal = data.data || [];

        document.getElementById("totalUsuarios").textContent =
            `${usuariosGlobal.length} usuarios`;

        const coaches = usuariosGlobal.filter(
            usuario => usuario.role === "coach"
        );

        document.getElementById("totalCoaches").textContent =
            `${coaches.length} coaches`;

        renderTabla(usuariosGlobal);

    } catch (error) {
        console.error(error);
        tabla.innerHTML = `
            <tr>
                <td colspan="6">${escapeHtml(error.message)}</td>
            </tr>
        `;
    }
});

// Delegación de eventos: reemplaza los onclick inline (evitan romperse
// con comillas en el nombre/email y reducen el riesgo de XSS)
document.addEventListener("click", (e) => {
    if (e.target.matches(".btn-editar")) {
        const id = Number(e.target.dataset.id);
        const usuario = usuariosGlobal.find(u => u.id === id);
        if (usuario) {
            editarUsuario(usuario.id, usuario.full_name, usuario.email, usuario.role);
        }
    }

    if (e.target.matches(".btn-eliminar")) {
        const id = Number(e.target.dataset.id);
        eliminarUsuario(id);
    }
});

async function eliminarUsuario(id) {
    const confirmar = confirm("¿Desea eliminar este usuario?");
    if (!confirmar) return;

    try {
        const token = localStorage.getItem("token");

        const response = await fetch(
            `http://localhost:3000/api/users/${id}`,
            {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Error al eliminar usuario");
        }

        alert("Usuario eliminado correctamente");
        location.reload();

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

async function crearUsuario() {
    try {
        const nombre = document.getElementById("nuevoNombre").value;
        const email = document.getElementById("nuevoEmail").value;
        const password = document.getElementById("nuevoPassword").value;
        const confirmarPassword = document.getElementById("confirmarPassword").value;
        const role = document.getElementById("nuevoRol").value;

        if (password !== confirmarPassword) {
            document.getElementById("mensajeCrear").textContent =
                "Las contraseñas no coinciden";
            document.getElementById("mensajeCrear").style.color = "red";
            return;
        }

        document.getElementById("mensajeCrear").textContent = "";

        const token = localStorage.getItem("token");

        const response = await fetch(
            "http://localhost:3000/api/users",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    full_name: nombre,
                    email,
                    password,
                    role
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Error al crear usuario");
        }

        alert("Usuario creado correctamente");
        location.reload();

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

function editarUsuario(id, nombreActual, emailActual, rolActual) {
    document.getElementById("editId").value = id;
    document.getElementById("editNombre").value = nombreActual;
    document.getElementById("editEmail").value = emailActual;
    document.getElementById("editRol").value = rolActual;
}

async function actualizarUsuario() {
    try {
        const id = document.getElementById("editId").value;
        const nombre = document.getElementById("editNombre").value;
        const email = document.getElementById("editEmail").value;
        const rol = document.getElementById("editRol").value;

        const token = localStorage.getItem("token");

        const response = await fetch(
            `http://localhost:3000/api/users/${id}`,
            {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    full_name: nombre,
                    email: email,
                    role: rol
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Error al actualizar usuario");
        }

        alert("Usuario actualizado correctamente");
        location.reload();

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "../pages/login.html";
}

document.addEventListener("input", (e) => {
    if (e.target.id !== "buscarUsuario") return;

    const texto = e.target.value.toLowerCase();

    const filtrados = usuariosGlobal.filter(usuario =>
        usuario.full_name.toLowerCase().includes(texto) ||
        usuario.email.toLowerCase().includes(texto)
    );

    renderTabla(filtrados);
});