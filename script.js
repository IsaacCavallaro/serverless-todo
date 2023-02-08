document.addEventListener("DOMContentLoaded", function() {
  let todoList = document.getElementById("todo-list");
  let addButton = document.getElementById("add-button");
  let newTodo = document.getElementById("new-todo");
  let dueDate = document.getElementById("due-date");
  let priority = document.getElementById("priority");
  
  addButton.addEventListener("click", function() {
  let todo = newTodo.value;
  let due = dueDate.value;
  let pri = priority.value;

  if(!todo || !due || !pri){
    if(!todo) newTodo.classList.add("error");
    if(!due) dueDate.classList.add("error");
    if(!pri) priority.classList.add("error");
    alert("Please fill in all fields before adding a new to-do item.");
  }
  else {
    fetch('https://zhk0hp0vei.execute-api.ap-southeast-2.amazonaws.com/prod', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ item: todo, due: due, priority: pri })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      let newLi = document.createElement("li");
      newLi.innerHTML = `<input type="checkbox"><span>${todo}</span> <b>Due:</b> ${due} <b>Priority: </b>${pri} <button class="done-button">Done</button><button class="delete-button">Delete</button>`;
      todoList.appendChild(newLi);
      newTodo.value = "";
      dueDate.value = "";
      priority.value = "";
      newTodo.classList.remove("error");
      dueDate.classList.remove("error");
      priority.classList.remove("error");
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
  }
  
  });

  todoList.addEventListener('click', function(e){
      if(e.target.className === 'delete-button'){
          e.target.parentElement.remove();
      }
      if(e.target.className === 'done-button'){
          e.target.parentElement.classList.toggle('completed');
      }
  });
});
