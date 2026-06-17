document.addEventListener("DOMContentLoaded", () => {

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !token) {
        window.location.href = "login.html";
        return;
    }

    document.getElementById("id").textContent = user.id;
    document.getElementById("nombre").textContent = user.full_name;
    document.getElementById("email").textContent = user.email;
    document.getElementById("rol").textContent = user.role;

    document.getElementById("full_name").value =
        user.full_name || "";

    document.getElementById("emailInput").value =
        user.email || "";

    document.getElementById("birth_date").value =
        user.birth_date || "";
        
document.getElementById("fechaNacimiento").textContent =
    user.birth_date || "No registrada";

    const form = document.getElementById("profileForm");

    form.addEventListener("submit", async (e) => {

        e.preventDefault();

        try {

            const response = await fetch(
                `http://localhost:3000/api/users/${user.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        full_name:
                            document.getElementById("full_name").value,

                        email:
                            document.getElementById("emailInput").value,

                        birth_date:
                            document.getElementById("birth_date").value,

                        role: user.role
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Error al actualizar"
                );
            }

            alert("Perfil actualizado correctamente");

            localStorage.setItem(
                "user",
                JSON.stringify(data.data)
            );

            location.reload();

        } catch (error) {

            document.getElementById("mensaje").textContent =
                error.message;

        }

    });

});