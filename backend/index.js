require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose'); 
const data = require('./database/data.js');
const app = express();
const PORT = process.env.PORT || 8000;

// Configure CORS to allow requests from the Vercel app
const allowedOrigins = ['http://localhost:3000', 'https://my-todos-azure.vercel.app'];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, etc.)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));

app.use(express.json());

data();

const todoSchema = new mongoose.Schema({
    value: String,
    description: String,
    isDone: Boolean
});

const Todo = mongoose.model('Todo', todoSchema);

app.get('/todos', (req, res) => {
    Todo.find()
        .then(todos => res.json(todos))
        .catch(err => res.status(500).json({ error: err.message }));
});

app.post('/todos', (req, res) => {
    const newTodo = new Todo({
        value: req.body.value,
        description: req.body.description,
        isDone: req.body.isDone
    });

    newTodo.save()
        .then(todo => res.status(201).json(todo))
        .catch(err => res.status(500).json({ error: err.message }));
});

app.put('/todos/:id', (req, res) => {
    Todo.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(todo => res.json(todo))
        .catch(err => res.status(404).json({ error: 'Todo not found' }));
});

app.delete('/todos/:id', (req, res) => {
    Todo.findByIdAndDelete(req.params.id)
        .then(() => res.status(204).end())
        .catch(err => res.status(404).json({ error: 'Todo not found' }));
});

app.listen(PORT, () => {
    console.log(`Server is running successfully on PORT ${PORT}`);
});
