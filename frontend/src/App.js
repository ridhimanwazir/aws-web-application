import React, { useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';

function App() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    checkUser();
    fetchTasks();
  }, []);

  const checkUser = async () => {
    try {
      const userData = await Auth.currentAuthenticatedUser();
      setUser(userData);
    } catch (err) {
      setUser(null);
    }
  };

  const fetchTasks = async () => {
    // You can fetch tasks from your middleware/backend here
    // For simplicity, let's mock some tasks
    setTasks([
      { id: 1, text: 'Learn AWS Amplify', completed: false },
      { id: 2, text: 'Build a React app', completed: true },
    ]);
  };

  const addTask = () => {
    // Implement the logic to add a task to the backend here
    // For simplicity, let's update the state only
    setTasks([...tasks, { id: tasks.length + 1, text: newTask, completed: false }]);
    setNewTask('');
  };

  const toggleTask = (taskId) => {
    // Implement the logic to toggle task completion on the backend here
    // For simplicity, let's update the state only
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const deleteTask = (taskId) => {
    // Implement the logic to delete a task from the backend here
    // For simplicity, let's update the state only
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
  };

  return (
    <div>
      <h1>Welcome, {user ? user.username : 'Guest'}</h1>
      {user && (
        <div>
          <input
            type="text"
            placeholder="New task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button onClick={addTask}>Add Task</button>
        </div>
      )}
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task.id)}
            />
            <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
              {task.text}
            </span>
            {user && (
              <button onClick={() => deleteTask(task.id)} style={{ marginLeft: '10px' }}>
                Delete
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default withAuthenticator(App);

