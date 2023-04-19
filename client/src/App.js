import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './App.css';

function App() {

  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {

    const currentUserId = localStorage.getItem('UserId');
    
    if(currentUserId) {

      // Get request to find all tasks for this user
      fetch('http://localhost:8000/', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        mode: 'cors',
        body: JSON.stringify({currentUserId})
      })
      .then(res => res.json())
      .then(data => {
        console.log(data)

        // If the user has been found
        if (data.success) {
          setCurrentUser(data.currentUser)
        }
      })
      .catch(err => console.log(err))
    }

  }, [])

  return (
    <div className="App">
      
      <h1>Home</h1>

      {(currentUser && currentUser.tasks.length > 0)
        ?
        <div className='allTasks'>
          {currentUser.tasks.map(task => {
            return (
              <div className='individualTask' key={task._id}>
                <p>{task.title}</p>
              </div>
            )
          })}
        </div>
        :
        <div className='noTasks'>
          <p>The task list is empty.</p>
          <Link to='/tasks/add'><button>Add Task</button></Link>
        </div>
      }
   
    </div>
  );
}

export default App;
