import React, { useState, useEffect } from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { signIn } from 'aws-amplify/auth';


function App() {
  // State variables
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  // Function to fetch tasks from the middleware
  const fetchTasks = async () => {
    try {
      // Make an API request to fetch tasks from the middleware
      const response = await fetch('<Your_Elastic_Beanstalk_Middleware_URL>/todos', {
        headers: {
          Authorization: `Bearer ${user.signInUserSession.idToken.jwtToken}`,
        },
      });
      // Parse the response as JSON and update the tasks state
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      try {
        const userData = await Auth.currentAuthenticatedUser();
        setUser(userData);
        fetchTasks();
      } catch (err) {
        setUser(null);
      }
    };
  
    checkUser();
  }, [fetchTasks]);

  // Function to add a new task
  const addTask = async () => {
    try {
      // Make an API request to add a new task to the middleware
      const response = await fetch('http://development222.us-east-1.elasticbeanstalk.com/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.signInUserSession.idToken.jwtToken}`,
        },
        body: JSON.stringify({ text: newTask, completed: false }),
      });
      // Parse the response as JSON and update the tasks state
      const data = await response.json();
      setTasks([...tasks, data]);
      // Clear the newTask state after adding a task
      setNewTask('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  // Function to toggle the completion status of a task
  const toggleTask = async (taskId) => {
    try {
      // Find the task by ID in the tasks state
      const taskToUpdate = tasks.find((task) => task.id === taskId);
      // Make an API request to update the task's completion status
      const response = await fetch(`http://development222.us-east-1.elasticbeanstalk.com/todos/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.signInUserSession.idToken.jwtToken}`,
        },
        body: JSON.stringify({ completed: !taskToUpdate.completed }),
      });
      // Parse the response as JSON and update the tasks state
      const updatedTask = await response.json();
      setTasks(tasks.map((task) => (task.id === taskId ? updatedTask : task)));
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  // Function to delete a task
  const deleteTask = async (taskId) => {
    try {
      // Make an API request to delete a task from the middleware
      await fetch(`http://development222.us-east-1.elasticbeanstalk.com/todos/${taskId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.signInUserSession.idToken.jwtToken}`,
        },
      });
      // Update the tasks state by filtering out the deleted task
      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // JSX for rendering the component
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
        {/* Map through tasks and render each task */}
        {tasks.map((task) => (
          <li key={task.id}>
            <span>{task.text}</span>
            {user && (
              <>
                <button onClick={() => toggleTask(task.id)}>Toggle</button>
                <button onClick={() => deleteTask(task.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Export the component with authentication
export default withAuthenticator(App);