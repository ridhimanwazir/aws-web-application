import React, { useState, useEffect } from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { signIn } from 'aws-amplify/auth';


function App() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

// eslint-disable-next-line react-hooks/exhaustive-deps
useEffect(() => {
  checkUser();
  fetchTasks();
}, [fetchTasks]);


  const checkUser = async () => {
    try {
      const userData = await signIn.currentAuthenticatedUser();
      setUser(userData);
    } catch (err) {
      setUser(null);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://development222.us-east-1.elasticbeanstalk.com/todos/', {
        headers: {
          Authorization: `Bearer ${user.signInUserSession.idToken.jwtToken}`,
        },
      });
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const addTask = async () => {
    try {
      const response = await fetch('http://development222.us-east-1.elasticbeanstalk.com/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.signInUserSession.idToken.jwtToken}`,
        },
        body: JSON.stringify({ text: newTask }),
      });
      const data = await response.json();
      setTasks([...tasks, data]);
      setNewTask('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const toggleTask = async (taskId) => {
    try {
      const response = await fetch(`http://development222.us-east-1.elasticbeanstalk.com/todos/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.signInUserSession.idToken.jwtToken}`,
        },
        body: JSON.stringify({ completed: !tasks.find((task) => task.id === taskId).completed }),
      });
      const updatedTask = await response.json();
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === taskId ? updatedTask : task))
      );
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await fetch(`http://development222.us-east-1.elasticbeanstalk.com/todos/${taskId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.signInUserSession.idToken.jwtToken}`,
        },
      });
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
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
