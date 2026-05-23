const input = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const list = document.getElementById('todo-list');
const emptyMessage = document.getElementById('empty-message');

function updateEmptyMessage() {
  emptyMessage.style.display = list.children.length === 0 ? 'block' : 'none';
}

function saveTodos() {
  const todos = Array.from(list.querySelectorAll('li')).map(li => ({
    text: li.querySelector('span').textContent,
    done: li.classList.contains('done'),
  }));
  localStorage.setItem('todos', JSON.stringify(todos));
}

function createTodoItem(text, done = false) {
  const li = document.createElement('li');
  if (done) li.classList.add('done');

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = done;
  checkbox.addEventListener('change', () => {
    li.classList.toggle('done', checkbox.checked);
    saveTodos();
  });

  const span = document.createElement('span');
  span.textContent = text;

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '×';
  deleteBtn.addEventListener('click', () => {
    li.remove();
    saveTodos();
    updateEmptyMessage();
  });

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(deleteBtn);
  return li;
}

function addTodo() {
  const text = input.value.trim();
  if (text === '') return;

  list.appendChild(createTodoItem(text));
  input.value = '';
  saveTodos();
  updateEmptyMessage();
}

function loadTodos() {
  const saved = localStorage.getItem('todos');
  if (!saved) return;
  JSON.parse(saved).forEach(({ text, done }) => {
    list.appendChild(createTodoItem(text, done));
  });
}

addBtn.addEventListener('click', addTodo);

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTodo();
});

loadTodos();
updateEmptyMessage();
