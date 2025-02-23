document.addEventListener("DOMContentLoaded", () => {
    const taskList = JSON.parse(localStorage.getItem("tasks")) || [];

    const todoList = document.getElementById('todoList');
    const inProgressList = document.getElementById('inProgressList');
    const completedList = document.getElementById('completedList');
    const filterDateInput = document.getElementById('filterDate');
    const notification = document.getElementById('notification');

    function showNotification(message) {
        notification.textContent = message;
        notification.classList.add("show");

        setTimeout(() => {
            notification.classList.remove("show");
        }, 2000);
    }

    function renderTasks(dateFilter) {
        todoList.innerHTML = '';
        inProgressList.innerHTML = '';
        completedList.innerHTML = '';

        const filteredTasks = taskList.filter(task => task.date === dateFilter);

        filteredTasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${task.time} - ${task.name}</span>
                <select class="status-select" data-index="${index}">
                    <option value="todo" ${task.status === 'todo' ? 'selected' : ''}>To Do</option>
                    <option value="inProgress" ${task.status === 'inProgress' ? 'selected' : ''}>In Progress</option>
                    <option value="completed" ${task.status === 'completed' ? 'selected' : ''}>Completed</option>
                </select>
                <button class="edit-btn" data-index="${index}">
                <img src="image/edit.png" alt="Edit" width="28px" height="35px">
                </button>
                <button class="delete-btn" data-index="${index}">
                <img src="image/trash.png" alt="trash" width="35px" height="35px">
                </button>
            `;

            if (task.status === 'todo') {
                todoList.appendChild(li);
            } else if (task.status === 'inProgress') {
                inProgressList.appendChild(li);
            } else {
                completedList.appendChild(li);
            }
        });

        addEventListeners();
    }

    function addEventListeners() {
        document.querySelectorAll('.status-select').forEach(select => {
            select.addEventListener('change', (event) => {
                const index = event.target.getAttribute('data-index');
                taskList[index].status = event.target.value;
                localStorage.setItem("tasks", JSON.stringify(taskList));
                renderTasks(filterDateInput.value);
                showNotification("Task status updated!");
            });
        });

        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const index = event.target.getAttribute('data-index');
                const newName = prompt("Edit task name:", taskList[index].name);
                if (newName) {
                    taskList[index].name = newName;
                    localStorage.setItem("tasks", JSON.stringify(taskList));
                    renderTasks(filterDateInput.value);
                    showNotification("Task updated!");
                }
            });
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const index = event.target.getAttribute('data-index');
                if (confirm("Are you sure you want to delete this task?")) {
                    taskList.splice(index, 1);
                    localStorage.setItem("tasks", JSON.stringify(taskList));
                    renderTasks(filterDateInput.value);
                    showNotification("Task deleted!");
                }
            });
        });
    }

    if (document.getElementById('addTaskForm')) {
        document.getElementById('addTaskForm').addEventListener('submit', (event) => {
            event.preventDefault();
    
            const taskName = document.getElementById('taskName').value;
            const taskDate = document.getElementById('taskDate').value;
            const taskTime = document.getElementById('taskTime').value;
    
            if (taskName.trim() === "" || taskDate.trim() === "" || taskTime.trim() === "") {
                showNotification("Please fill in all fields!");
                return;
            }
    
            taskList.push({ name: taskName, date: taskDate, time: taskTime, status: 'todo' });
    
            localStorage.setItem("tasks", JSON.stringify(taskList));
            showNotification("Task added successfully!");
    
            // Reset form setelah berhasil tambah task
            document.getElementById('addTaskForm').reset();
        });    
    } else {
        // Set default filter date ke hari ini
        filterDateInput.value = new Date().toISOString().split('T')[0];

        // Render tugas berdasarkan tanggal yang dipilih
        filterDateInput.addEventListener("change", () => {
            renderTasks(filterDateInput.value);
        });

        renderTasks(filterDateInput.value);
    }
});