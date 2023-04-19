import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddTask = () => {
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [status, setStatus] = useState();
  const [dueDate, setDueDate] = useState();
  const navigate = useNavigate();

  const addTaskFormSubmit = (e) => {
    e.preventDefault();

    const currentUserId = localStorage.getItem("UserId");

    fetch(`http://localhost:8000/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      mode: "cors",
      body: JSON.stringify({
        currentUserId,

        title,
        description,
        status,
        dueDate,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("Task added successfully!");
          navigate("/");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <h2>Add Task</h2>
      <form onSubmit={addTaskFormSubmit}>
        <label>
          Title:
          <input
            type="text"
            name="title"
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <label>
          Description:
          <textarea
            name="description"
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </label>
        <label>
          Status:
          <select onChange={(e) => setStatus(e.target.value)}>
            <option value="">Select status</option>
            <option value="Not started">Not started</option>
            <option value="In progress">In progress</option>
            <option value="Completed">Completed</option>
          </select>
        </label>
        <label>
          Due Date:
          <input
            type="date"
            name="dueDate"
            onChange={(e) => setDueDate(e.target.value)}
          />
        </label>
        <button type="submit">Add Task</button>
      </form>
    </div>
  );
};

export default AddTask;


