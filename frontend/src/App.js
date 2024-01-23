import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_ENDPOINT = 'http://44.203.151.27:5000';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('API_ENDPOINT/tasks');
      setTasks(response.data.tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const createTask = async () => {
    try {
      await axios.post('API_ENDPOINT/tasks', { title: newTaskTitle });
      setNewTaskTitle('');
      fetchTasks();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`API_ENDPOINT/tasks/${taskId}`);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div>
      <h1>Task Manager</h1>
      <div>
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <button onClick={createTask}>Add Task</button>
      </div>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.title}
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
