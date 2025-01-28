document.getElementById('save').addEventListener('click', () => {
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;

    fetch('/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
    }).then(() => {
        loadTasks();
        document.getElementById('title').value = '';
        document.getElementById('description').value = '';
    });
});

function loadTasks() {
    fetch('/tasks')
        .then(response => response.json())
        .then(data => {
            const table = document.getElementById('task-table');
            table.innerHTML = '';
            data.forEach(task => {
                const row = document.createElement('tr');
                
                // Apply 'line-through' style if task is deleted
                const textDecoration = task[3] ? 'line-through' : 'none';
                
                row.innerHTML = `
                    <td style="text-decoration: ${textDecoration}">${task[1]}</td>
                    <td style="text-decoration: ${textDecoration}">${task[2]}</td>
                    <td>${task[3] ? '<s>Deleted</s>' : 'Active'}</td>
                `;
                row.addEventListener('dblclick', () => {
                    document.getElementById('title').value = task[1];
                    document.getElementById('description').value = task[2];
                });
                table.appendChild(row);
            });
        });
}

document.getElementById('delete').addEventListener('click', () => {
    const confirmation = confirm('Are you sure you want to delete this task?');
    if (!confirmation) {
        return; // Stop the action if "Cancel" is clicked
    }
    const title = document.getElementById('title').value;

    if (!title) {
        alert('Please select a task to delete.');
        return;
    }

    fetch('/tasks')
        .then(response => response.json())
        .then(tasks => {
            const taskToDelete = tasks.find(task => task[1] === title);

            if (taskToDelete) {
                const taskId = taskToDelete[0]; // Get the ID of the task
                fetch(`/delete/${taskId}`, { method: 'POST' })
                    .then(() => {
                        loadTasks(); // Reload the table after marking as deleted
                        document.getElementById('title').value = '';
                        document.getElementById('description').value = '';
                    });
            } else {
                alert('Task not found.');
            }
        });
});

document.getElementById('forcedelete').addEventListener('click', () => {
    const title = document.getElementById('title').value;

    const confirmation = confirm('Are you sure you want to permenantly delete this task?');
    if (!confirmation) {
        return; // Stop the action if "Cancel" is clicked
    }

    if (!title) {
        alert('Please select a task to delete.');
        return;
    }

    fetch('/tasks')
        .then(response => response.json())
        .then(tasks => {
            const taskToDelete = tasks.find(task => task[1] === title);

            if (taskToDelete) {
                const taskId = taskToDelete[0]; // Get the ID of the task
                fetch(`/forcedelete/${taskId}`, { method: 'POST' })
                    .then(() => {
                        loadTasks(); // Reload the table after deleting
                        document.getElementById('title').value = '';
                        document.getElementById('description').value = '';
                    });
            } else {
                alert('Task not found.');
            }
        });
});

document.getElementById('reactivate').addEventListener('click', () => {
    const title = document.getElementById('title').value;

    const confirmation = confirm('Are you sure you want to reactivate this task?');
    if (!confirmation) {
        return; // Stop the action if "Cancel" is clicked
    }

    fetch('/tasks')
        .then(response => response.json())
        .then(tasks => {
            const taskToDelete = tasks.find(task => task[1] === title);

            if (taskToDelete) {
                const taskId = taskToDelete[0]; // Get the ID of the task
                fetch(`/reactivate/${taskId}`, { method: 'POST' })
                    .then(() => {
                        loadTasks(); // Reload the table after deleting
                        document.getElementById('title').value = '';
                        document.getElementById('description').value = '';
                    });
            } else {
                alert('Task not found.');
            }
        });
});

document.getElementById('clear').addEventListener('click', () => {
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
});

// Load tasks on page load
window.onload = loadTasks;
