import React, { useState, useEffect } from 'react';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { API, Storage } from 'aws-amplify';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  const fetchTodos = async () => {
    try {
      const todoData = await API.get('todos', '/todos');
      setTodos(todoData);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const addTodo = async () => {
    try {
      if (!newTodo) return;
      const todoDetails = { name: newTodo };
      const newTodoData = await API.post('todos', '/todos', { body: todoDetails });
      setTodos([...todos, newTodoData]);
      setNewTodo('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []); // Fetch todos on component mount

  return (
    <div className="App">
      <h1>My To-Do App</h1>
      <div>
        <input
          type="text"
          placeholder="Add a new todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button onClick={addTodo}>Add Todo</button>
      </div>
      <div>
        <h2>Todos</h2>
        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>{todo.name}</li>
          ))}
        </ul>
      </div>
      <AmplifySignOut />
    </div>
  );
}

export default withAuthenticator(App);
