document.addEventListener("DOMContentLoaded", () => {

    const users = [
        {
            user: "user1@sportclub.cl",
            fullname: "Juan Usuario",
            password: "1234",
            role: "user"
        },
        {
            user: "user2@sportclub.cl",
            fullname: "María Usuario",
            password: "1234",
            role: "user"
        },
        {
            user: "coach1@sportclub.cl",
            fullname: "Carlos Coach",
            password: "1234",
            role: "coach"
        },
        {
            user: "coach2@sportclub.cl",
            fullname: "Ana Coach",
            password: "1234",
            role: "coach"
        },
        {
            user: "admin1@sportclub.cl",
            fullname: "Jean Admin",
            password: "1234",
            role: "admin"
        },
        {
            user: "admin2@sportclub.cl",
            fullname: "Pedro Admin",
            password: "1234",
            role: "admin"
        }
    ];

    const form = document.querySelector("form");
    const mensaje = document.getElementById("mensaje");

    form.addEventListener("submit", function(e) {

        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const usuario = users.find(
            u => u.user === email && u.password === password
        );

        if (!usuario) {
            mensaje.textContent = "Credenciales incorrectas";
            mensaje.style.color = "red";
            return;
        }

        localStorage.setItem("user", JSON.stringify(usuario));

        if (usuario.role === "user") {
            window.location.href = "dashboard-user.html";
        }

        if (usuario.role === "coach") {
            window.location.href = "dashboard-coach.html";
        }

        if (usuario.role === "admin") {
            window.location.href = "dashboard-admin.html";
        }

    });

});