document.addEventListener("DOMContentLoaded", () => {

    const form =
        document.getElementById("registerForm");

    const mensaje =
        document.getElementById("mensaje");

    form.addEventListener("submit", async (e) => {

        e.preventDefault();

        const fullname =
            document.getElementById("fullname").value;

        const email =
            document.getElementById("email").value;

        const password =
            document.getElementById("password").value;

        const repeatPassword =
            document.getElementById("repeatPassword").value;

        const birthDate =
            document.getElementById("birthDate").value;

        if (!fullname || !email || !password) {

            mensaje.textContent =
                "Todos los campos son obligatorios";

            return;
        }

        if (password.length < 8) {

            mensaje.textContent =
                "La contraseña debe tener mínimo 8 caracteres";

            return;
        }

        if (password !== repeatPassword) {

            mensaje.textContent =
                "Las contraseñas no coinciden";

            return;
        }

        try {

            const response = await fetch(
                "http://localhost:3000/api/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body: JSON.stringify({
                        full_name: fullname,
                        email: email,
                        password: password,
                        role: "user",
                        birth_date: birthDate
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Error al registrar"
                );

            }

            mensaje.style.color = "green";

            mensaje.textContent =
                "Usuario registrado correctamente";

            setTimeout(() => {

                window.location.href =
                    "../pages/login.html";

            }, 1500);

        } catch (error) {

            mensaje.style.color = "red";

            mensaje.textContent =
                error.message;

        }

    });

});