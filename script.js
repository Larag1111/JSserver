document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('addTaskForm');
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');

    form.addEventListener('submit', async function (e) {
        e.preventDefault(); 

        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            try {
                const response = await fetch('http://localhost:3000/todos', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ task: taskText }),
                });

                if (!response.ok) {
                    throw new Error('Failed to add task');
                }

                const newTask = await response.json();
                addTaskToList(newTask);
                taskInput.value = ''; 
            } catch (error) {
                console.error('Error adding task:', error);
            }
        }
    });

    function addTaskToList(task) {
        const taskItem = document.createElement('li');
        taskItem.textContent = task.task;

        
        const completeButton = document.createElement('button');
        completeButton.textContent = 'Klar';
        completeButton.onclick = async function () {
            try {
                const response = await fetch(`http://localhost:3000/todos/${task.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ completed: true }),
                });

                if (!response.ok) {
                    throw new Error('Failed to update task');
                }

                taskItem.style.textDecoration = 'line-through';
                completeButton.disabled = true;
            } catch (error) {
                console.error('Error completing task:', error);
            }
        };

        
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Ta bort';
        deleteButton.onclick = async function () {
            try {
                const response = await fetch(`http://localhost:3000/todos/${task.id}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error('Failed to delete task');
                }

                taskList.removeChild(taskItem);
            } catch (error) {
                console.error('Error deleting task:', error);
            }
        };

        taskItem.appendChild(completeButton);
        taskItem.appendChild(deleteButton);
        taskList.appendChild(taskItem);
    }

    async function fetchTasks() {
        try {
            const response = await fetch('http://localhost:3000/todos');
            if (!response.ok) {
                throw new Error('Failed to fetch tasks');
            }

            const tasks = await response.json();
            tasks.forEach(addTaskToList);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    }

    fetchTasks();
});
