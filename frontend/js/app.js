const API_URL = "https://project-task-management-api.onrender.com/api/tasks";

const role = localStorage.getItem("role");
const userId = localStorage.getItem("userId");

document.addEventListener("DOMContentLoaded", () => {

    if (role !== "manager") {
        document.getElementById("taskForm").style.display = "none";
    }

});

// Fetch all tasks
async function fetchTasks() {
    const response = await fetch(`${API_URL}?userId=${userId}&role=${role}`);
    const tasks = await response.json();

    let total = tasks.length;
let pending = 0;
let inProgress = 0;
let completed = 0;

// Dashboard Counts
tasks.forEach(task => {
    if (task.status === "Pending") pending++;
    if (task.status === "In Progress") inProgress++;
    if (task.status === "Completed") completed++;
});

document.getElementById("totalTasks").innerText = total;
document.getElementById("pendingTasks").innerText = pending;
document.getElementById("inProgressTasks").innerText = inProgress;
document.getElementById("completedTasks").innerText = completed;

    const tasksDiv = document.getElementById("tasks");
    tasksDiv.innerHTML = "";

    // Render Tasks
    tasks.forEach(task => {

    let today = new Date();
let deadlineDate = new Date(task.deadline);

let isOverdue = deadlineDate < today && task.status !== "Completed";

let overdueClass = isOverdue ? "overdue" : "";
let overdueLabel = isOverdue ? "<p class='overdue-label'>⚠ Overdue</p>" : "";

    let deleteButton = "";
    if (role === "manager") {
        deleteButton = `<button onclick="deleteTask('${task._id}')">Delete</button>`;
    }

    tasksDiv.innerHTML += `
        <div class="task-item ${overdueClass}">
            <h3>${task.title}</h3>
            <p><b>Assigned to:</b> ${task.assignedTo?.name || "N/A"}</p>
            <p><b>Assigned by:</b> ${task.assignedBy?.name || "N/A"}</p>
            <p><b>Task Description:</b> ${task.description}</p>
            <p><b>Deadline:</b> ${new Date(task.deadline).toLocaleDateString()}</p>
            <p><b>Status:</b> ${task.status}</p>
            ${overdueLabel}

            <select onchange="updateStatus('${task._id}', this.value)">
                <option value="Pending" ${task.status==="Pending"?"selected":""}>Pending</option>
                <option value="In Progress" ${task.status==="In Progress"?"selected":""}>In Progress</option>
                <option value="Completed" ${task.status==="Completed"?"selected":""}>Completed</option>
            </select>

            ${deleteButton}
        </div>
    `;

});
}

// Add new task
async function addTask() {

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const deadline = document.getElementById("deadline").value;
    const assignedTo = document.getElementById("assignedTo").value;
    const assignedBy = localStorage.getItem("userId");

    if (!title || !description || !deadline || !assignedTo) {
        alert("Please fill all fields and select employee");
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title,
                description,
                deadline,
                assignedTo,
                assignedBy
            })
        });

        const data = await response.json();
        localStorage.setItem("userId", data.id);
        localStorage.setItem("userName", data.name);
        localStorage.setItem("role", data.role);
        localStorage.setItem("token", data.token);
        console.log("Task Created:", data);

        // Clear fields
        document.getElementById("title").value = "";
        document.getElementById("description").value = "";
        document.getElementById("deadline").value = "";
        document.getElementById("assignedTo").value = "";

        fetchTasks();

    } catch (error) {
        console.error("Error adding task:", error);
    }
}

async function deleteTask(id) {
    await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });
    fetchTasks();
}

async function updateStatus(id, status) {
    await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
    });
    fetchTasks();
}

function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", () => {
    const name = localStorage.getItem("name");
    document.getElementById("welcomeUser").innerText = "Welcome, " + name;
});

async function loadEmployees() {
    if (role !== "manager") return;

    const response = await fetch("https://project-task-management-api.onrender.com/api/auth/employees");
    const employees = await response.json();

    const dropdown = document.getElementById("assignedTo");

    employees.forEach(emp => {
        dropdown.innerHTML += `<option value="${emp._id}">${emp.name}</option>`;
    });
}

document.addEventListener("DOMContentLoaded", loadEmployees);

// Load tasks on page load
fetchTasks();