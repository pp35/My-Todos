import React, { useEffect, useState } from "react";
import axios from "axios";

function Todos() {
  const [inputValue, setInputValue] = useState("");
  const [inputDescription, setInputDescription] = useState("");
  const [editTodo, setEditTodo] = useState({});
  const [todosList, setTodosList] = useState([]);

  useEffect(() => {
    // Fetch todos from the backend
    axios.get("http://localhost:8000/todos")
      .then(response => setTodosList(response.data))
      .catch(error => console.log(error));
  }, []);

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setInputDescription(e.target.value);
  };

  const addTodo = (e) => {
    e.preventDefault();
    if (inputValue.trim() && inputDescription.trim()) {
      axios.post("http://localhost:8000/todos", {
        value: inputValue.trim(),
        description: inputDescription.trim(),
        isDone: false,
      })
      .then(response => {
        setTodosList([...todosList, response.data]);
        setInputValue("");
        setInputDescription("");
      })
      .catch(error => console.log(error));
    } else {
      alert("Please add text in the input fields.");
    }
  };

  const deleteTodo = (deleteItem) => {
    axios.delete(`http://localhost:8000/todos/${deleteItem._id}`)
      .then(() => {
        setTodosList(todosList.filter(todo => todo._id !== deleteItem._id));
      })
      .catch(error => console.log(error));
  };

  const handleTodoDone = (doneTodo) => {
    axios.put(`http://localhost:8000/todos/${doneTodo._id}`, {
      ...doneTodo,
      isDone: !doneTodo.isDone,
    })
    .then(response => {
      setTodosList(todosList.map(todo => todo._id === doneTodo._id ? response.data : todo));
    })
    .catch(error => console.log(error));
  };

  const editTodoClick = (todo) => {
    setEditTodo({ ...todo });
  };

  const editTodoSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:8000/todos/${editTodo._id}`, editTodo)
      .then(response => {
        setTodosList(todosList.map(todo => todo._id === editTodo._id ? response.data : todo));
        setEditTodo({});
      })
      .catch(error => console.log(error));
  };

  return (
    <>
      <div className="container  my-4">
        <form onSubmit={addTodo}>
          <div className="mb-3">
            <label htmlFor="todo-value" className="form-label text-light fw-bold fs-5" >
              Todo :
            </label>
            <input
              type="text"
              className="form-control"
              id="todo-value"
              placeholder="Enter todo"
              value={inputValue}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="todo-description" className="form-label text-light fw-bold fs-5">
              Description :
            </label>
            <textarea
              className="form-control"
              id="todo-description"
              rows="3"
              placeholder="Enter description"
              value={inputDescription}
              onChange={handleDescriptionChange}
            ></textarea>
          </div>
          <button type="submit" className="btn btn-success mb-3">
            Add Todo
          </button>
        </form>

        <table className="table table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>Done</th>
              <th>Todo</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {todosList.map((todo, index) => (
              <tr key={todo._id} className={todo.isDone ? "table-success" : ""}>
                <td>{index + 1}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={todo.isDone}
                    onChange={() => handleTodoDone(todo)}
                  />
                </td>
                <td>{todo.value}</td>
                <td>{todo.description}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    data-bs-toggle="modal"
                    data-bs-target="#editModal"
                    onClick={() => editTodoClick(todo)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteTodo(todo)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div
          className="modal fade"
          id="editModal"
          tabIndex="-1"
          aria-labelledby="editModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="editModalLabel">
                  Update Todo
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={editTodoSubmit}>
                  <div className="mb-3">
                    <label htmlFor="edit-todo-value" className="form-label">
                      Todo:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="edit-todo-value"
                      value={editTodo.value || ""}
                      onChange={(e) =>
                        setEditTodo({
                          ...editTodo,
                          value: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="edit-todo-description"
                      className="form-label"
                    >
                      Description:
                    </label>
                    <textarea
                      className="form-control"
                      id="edit-todo-description"
                      rows="3"
                      value={editTodo.description || ""}
                      onChange={(e) =>
                        setEditTodo({
                          ...editTodo,
                          description: e.target.value,
                        })
                      }
                    ></textarea>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      data-bs-dismiss="modal"
                    >
                      Update
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Todos;
