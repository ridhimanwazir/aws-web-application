// File: server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3001;

// Enable CORS
app.use(cors());

// Parse JSON requests
app.use(bodyParser.json());

// Simple in-memory todo list
let todos = [
  { id: 1, text: 'Learn AWS Amplify', completed: false },
  { id: 2, text: 'Build a React app', completed: true },
];

// Get all todos
app.get('/todos', (req, res) => {
  res.json(todos);
});

// Add a new todo
app.post('/todos', (req, res) => {
  const newTodo = { id: todos.length + 1, text: req.body.text, completed: false };
  todos.push(newTodo);
  res.json(newTodo);
});

// Update a todo
app.put('/todos/:id', (req, res) => {
  const todoId = parseInt(req.params.id);
  const updatedTodo = req.body;
  todos = todos.map((todo) => (todo.id === todoId ? { ...todo, ...updatedTodo } : todo));
  res.json(updatedTodo);
});

// Delete a todo
app.delete('/todos/:id', (req, res) => {
  const todoId = parseInt(req.params.id);
  todos = todos.filter((todo) => todo.id !== todoId);
  res.json({ message: 'Todo deleted successfully' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

