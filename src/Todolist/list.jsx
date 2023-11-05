import { useState, useEffect } from "react";
import { baseRequest } from "../utilies/interceptor";

const Todolist = () => {
  const [todos, setTodos] = useState([]);
  const [addInput, setAddInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const getAll = async (search) => {
    const updatedTodos = await baseRequest.get("/todos", {
      params: { q: search },
    });
    setTodos(updatedTodos.data);
  };

  // useEffect(() => {
  //   getAll();
  // }, []);

  useEffect(() => {
    let timer = setTimeout(async () => {
      console.log(searchTerm);
      getAll(searchTerm);
    }, 3000);
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [searchTerm]);

  const handleChange = (e) => {};

  const handleDelete = async (id) => {
    await baseRequest.delete(`/todos/${id}`);
    getAll();
  };
  const handleEdit = (content) => {};
  const handleDone = async (todo) => {
    const updatedState = todo.isCompleted === "completed" ? false : "completed";
    await baseRequest.patch(
      `/todos/${todo.id}`,
      JSON.stringify({
        isCompleted: updatedState,
      })
    );
    getAll();
  };

  const addTask = async (e) => {
    e.preventDefault();
    await baseRequest.post(
      "/todos",
      JSON.stringify({
        taskName: addInput,
        isCompleted: "",
      })
    );

    getAll();
  };

  return (
    <div className="todolist">
      <div className="search">
        <input
          type="text"
          placeholder="Search ex: todo 1"
          style={{ color: "white" }}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <form className="addTask" onSubmit={addTask}>
        <input
          type="text"
          onChange={(e) => {
            setAddInput(e.target.value);
          }}
          placeholder="Add a task........"
        />
        <button className="addtask-btn">Add Task</button>
      </form>
      <div className="lists">
        {todos?.map((todo, id) => (
          <div
            key={id}
            className={`list ${todo.isCompleted ? "completed" : ""}`}
          >
            <p> {todo.taskName}</p>
            <div className="span-btns">
              {!todo.isCompleted && (
                <span onClick={() => handleDone(todo)} title="completed">
                  ✓
                </span>
              )}
              <span
                className="delete-btn"
                onClick={() => handleDelete(todo.id)}
                title="delete"
              >
                x
              </span>
              <span
                className="edit-btn"
                onClick={() => handleDone(todo)}
                title="edit"
              >
                ↻
              </span>
            </div>
          </div>
        ))}
        {!todos?.length && <h1>No Records</h1>}
      </div>
    </div>
  );
};

export default Todolist;
