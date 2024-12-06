const express = require('express');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
dotenv.config();


app.use(cors({ origin: '*' }));


app.use(express.json());

const PORT = process.env.PORT || 3000;

let todos = [
    { id: 1, task: 'Städa', completed: false },
    { id: 2, task: 'Plugga', completed: false },
];

app.get('/todos', (req, res) => {
    res.status(200).json(todos);
});

app.post('/todos', (req, res) => {
    const { task } = req.body;
    if (!task) {
        return res.status(400).json({ message: 'Task is required' });
    }
    const newTodo = {
        id: todos.length > 0 ? todos[todos.length - 1].id + 1 : 1,
        task,
        completed: false,
    };
    todos.push(newTodo);
    res.status(201).json(newTodo);
});

app.put('/todos/:id', (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;

    const todo = todos.find(t => t.id === parseInt(id));
    if (!todo) {
        return res.status(404).json({ message: 'Todo not found' });
    }

    todo.completed = completed !== undefined ? completed : todo.completed;
    res.status(200).json(todo);
});

app.patch('/todos/:id', (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;

    const todo = todos.find(t => t.id === parseInt(id));
    if (!todo) {
        return res.status(404).json({ message: 'Todo not found' });
    }

    todo.completed = completed !== undefined ? completed : todo.completed;
    res.status(200).json(todo);
});

app.delete('/todos/:id', (req, res) => {
    const { id } = req.params;
    const index = todos.findIndex(t => t.id === parseInt(id));
    if (index === -1) {
        return res.status(404).json({ message: 'Todo not found' });
    }
    todos.splice(index, 1);
    res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
