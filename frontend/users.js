async function loadUsers() {
    try {
        const response = await fetch(
            "http://localhost:5000/api/users"
        );

        const users = await response.json();

        const table = document.getElementById("usersTable");

        table.innerHTML = "";

        users.forEach(user => {
            table.innerHTML += `
                <tr>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.role}</td>
                    <td>
                        <button
                            class="delete-btn"
                            onclick="deleteUser('${user._id}')"
                        >
                            Delete
                        </button>
                    </td>
                </tr>
            `;
        });

    } catch (error) {
        console.error(error);
    }
}

async function deleteUser(id) {

    if (!confirm("Delete this user?")) {
        return;
    }

    await fetch(
        `http://localhost:5000/api/users/${id}`,
        {
            method: "DELETE"
        }
    );

    loadUsers();
}

loadUsers();

async function createUser() {

    const name =
        document.getElementById("name").value;

    const email =
        document.getElementById("email").value;

    const password =
        document.getElementById("password").value;

    const role =
        document.getElementById("role").value;

    const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name,
                email,
                password,
                role
            })
        }
    );

    const data = await response.json();

    alert(data.message);

    loadUsers();
}
