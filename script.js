let todos = JSON.parse(localStorage.getItem("todos")) || [];

const form = document.querySelector(".todo-form");
const input = document.querySelector(".todo-input");
const list = document.querySelector(".todo-list");
const emptyState = document.querySelector(".empty-state");
const itemsLeft = document.querySelector(".items-count");
const clearBtn = document.querySelector(".clear-btn");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  const newTodo = {
    id: Date.now(),
    text: text,
    completed: false,
    isEditing: false,
    createdAt: new Date().toLocaleString(),
  };

  todos.unshift(newTodo);
  input.value = "";
  saveAndLoad();
});

function saveAndLoad() {
  localStorage.setItem("todos", JSON.stringify(todos));
  loadTodos();
}

function loadTodos() {
  list.innerHTML = "";
  emptyState.style.display = todos.length === 0 ? "block" : "none";

  todos.forEach((todo) => {
    const li = document.createElement("li");
    li.className = `todo-item ${todo.completed ? "completed-item" : ""}`;

    if (todo.isEditing) {
      li.innerHTML = `
                        <div class="todo-wrapper">
                        <div class="todo-content">
                            <input type="text" class="edit-input" value="${todo.text}">
                        </div>
                        <div class="actions">
                            <button onclick="saveEdit(${todo.id})" class="action-btn" style="color: #1d4ed8">Save</button>
                            <button onclick="toggleEdit(${todo.id})" class="action-btn">Cancel</button>
                        </div>
                        </div>
                    `;
    } else {
      li.innerHTML = `
                        <div class="todo-wrapper">
                        <div class="todo-content">
                            <div onclick="toggleComplete(${todo.id})" class="checkbox ${todo.completed ? "checked" : ""}">
                                ${todo.completed ? "✔" : ""}
                            </div>
                            <span class="todo-text ${todo.completed ? "completed" : ""}">${todo.text}</span>
                        </div>
                        <div class="actions">
                            <button onclick="toggleEdit(${todo.id})" class="action-btn edit-btn">Edit</button>
                            <button onclick="deleteTodo(${todo.id})" class="action-btn delete-btn">Delete</button>
                        </div>
                        </div>
                        <div class="todo-date">Added on: ${todo.createdAt}</div>
                    `;
    }
    list.appendChild(li);
  });

  const activeCount = todos.filter((t) => !t.completed).length;
  itemsLeft.innerText = `${activeCount} item${activeCount !== 1 ? "s" : ""} left`;
}

function toggleComplete(id) {
  todos = todos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo,
  );
  saveAndLoad();
}

function toggleEdit(id) {
  todos = todos.map((todo) =>
    todo.id === id ? { ...todo, isEditing: !todo.isEditing } : todo,
  );
  loadTodos();
}

function saveEdit(id) {
  const editInput = document.querySelector(".edit-input");
  const newText = editInput.value.trim();
  if (newText) {
    todos = todos.map((todo) =>
      todo.id === id ? { ...todo, text: newText, isEditing: false } : todo,
    );
    saveAndLoad();
  }
}

function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  saveAndLoad();
}

function clearCompleted() {
  todos = todos.filter((todo) => !todo.completed);
  saveAndLoad();
}

clearBtn.addEventListener("click", clearCompleted);
window.addEventListener("load", loadTodos);
