document.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector("form");
    const mensaje = document.getElementById("mensaje");

    form.addEventListener("submit", async (e) => {

        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {

            const response = await fetch(
                "http://localhost:3000/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Credenciales incorrectas"
                );
            }

            localStorage.setItem(
                "token",
                data.data.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(data.data.user)
            );

            const role = data.data.user.role;

            if (role === "user") {
                window.location.href =
                    "../pages/dashboard-user.html";
            }

            if (role === "coach") {
                window.location.href =
                    "../pages/dashboard-coach.html";
            }

            if (role === "admin") {
                window.location.href =
                    "../pages/dashboard-admin.html";
            }

        } catch (error) {

            mensaje.textContent = error.message;
            mensaje.style.color = "red";

        }

    });

});