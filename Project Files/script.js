document.addEventListener("DOMContentLoaded", loadTasks);

let selectedDate = null;
let selectedTime = null;
let completedTasksVisible = false;

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const task = taskInput.value.trim();
  if (task === "") return;

  const taskList = document.getElementById("taskList");
  const listItem = document.createElement("li");
  listItem.className = "list-group-item task-item";
  listItem.innerHTML = `
    <span>${task}</span>
    <small class="ml-3">${getFormattedDateTime()}</small>
    <div class="float-right">
      <button class="btn btn-sm btn-success mr-2" onclick="toggleTaskCompletion(event)"><i class="fas fa-check"></i></button>
      <button class="btn btn-sm btn-primary mr-2" onclick="editTask(event)"><i class="fas fa-edit"></i></button>
      <button class="btn btn-sm btn-danger" onclick="deleteTask(event)"><i class="fas fa-trash"></i></button>
    </div>
  `;
  taskList.appendChild(listItem);

  taskInput.value = "";
  clearDateTimeInput();
  saveTasks();
}

function getFormattedDateTime() {
  const taskDate = document.getElementById("dateInput").value;
  const taskTime = document.getElementById("timeInput").value;
  if (taskDate && taskTime) {
    return `Date: ${taskDate}, Time: ${taskTime}`;
  } else if (taskDate) {
    return `Date: ${taskDate}`;
  } else if (taskTime) {
    return `Time: ${taskTime}`;
  } else {
    return "Not set";
  }
}

function clearDateTimeInput() {
  document.getElementById("dateInput").value = "";
  document.getElementById("timeInput").value = "";
}

function toggleTaskCompletion(event) {
    const taskItem = event.target.closest(".task-item");
    const taskTextElement = taskItem.querySelector("span");
    const isCompleted = taskItem.classList.toggle("completed");
    
    if (isCompleted) {
      taskTextElement.innerHTML = `<del>${taskTextElement.textContent}</del>`;
    } else {

      taskTextElement.innerHTML = taskTextElement.textContent;
    }
    
    saveTasks();
  }
  

function editTask(event) {
  const taskItem = event.target.closest(".task-item");
  const taskText = taskItem.querySelector("span").textContent;
  selectedDate = taskItem.querySelector("small").textContent.match(/Date: (.+?), Time:/)[1];
  selectedTime = taskItem.querySelector("small").textContent.match(/Time: (.+)/)[1];

  document.getElementById("taskInput").value = taskText;
  document.getElementById("dateInput").value = selectedDate;
  document.getElementById("timeInput").value = selectedTime;
}

function deleteTask(event) {
  const taskItem = event.target.closest(".task-item");
  taskItem.remove();
  saveTasks();
}

function clearTasks() {
  const taskList = document.getElementById("taskList");
  while (taskList.firstChild) {
    taskList.removeChild(taskList.firstChild);
  }
  saveTasks();
}

function saveTasks() {
  const tasks = [];
  const taskItems = document.getElementsByClassName("task-item");
  for (let i = 0; i < taskItems.length; i++) {
    const item = taskItems[i];
    const taskText = item.querySelector("span").textContent;
    const taskDate = item.querySelector("small").textContent.match(/Date: (.+?), Time:/)[1];
    const taskTime = item.querySelector("small").textContent.match(/Time: (.+)/)[1];
    const isCompleted = item.classList.contains("completed");
    tasks.push({
      text: taskText,
      date: taskDate,
      time: taskTime,
      completed: isCompleted
    });
  }
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks"));
  if (tasks && tasks.length) {
    const taskList = document.getElementById("taskList");
    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      const listItem = document.createElement("li");
      listItem.className = `list-group-item task-item ${task.completed ? "completed" : ""}`;
      listItem.innerHTML = `
        <span>${task.text}</span>
        <small class="ml-3">${task.date ? `Date: ${task.date}` : ""}${task.date && task.time ? ", " : ""}${task.time ? `Time: ${task.time}` : ""}</small>
        <div class="float-right">
          <button class="btn btn-sm btn-success mr-2" onclick="toggleTaskCompletion(event)"><i class="fas fa-check"></i></button>
          <button class="btn btn-sm btn-primary mr-2" onclick="editTask(event)"><i class="fas fa-edit"></i></button>
          <button class="btn btn-sm btn-danger" onclick="deleteTask(event)"><i class="fas fa-trash"></i></button>
        </div>
      `;
      taskList.appendChild(listItem);
    }
  }
}

function toggleCompletedTasksList() {
  const completedTasksList = document.getElementById("completedTasksList");
  const completedTasks = document.getElementById("completedTasks");
  const completedTasksIcon = document.querySelector(".fas.fa-tasks");

  if (!completedTasksVisible) {
    completedTasksList.style.display = "block";
    showCompletedTasks(completedTasks);
    completedTasksVisible = true;
    completedTasksIcon.classList.add("active");
  } else {
    completedTasksList.style.display = "none";
    completedTasksVisible = false;
    completedTasksIcon.classList.remove("active");
  }
}

function showCompletedTasks(container) {
  const tasks = JSON.parse(localStorage.getItem("tasks"));
  if (tasks && tasks.length) {
    const completedTasks = tasks.filter(task => task.completed);
    if (completedTasks.length > 0) {
      container.innerHTML = "";
      for (let i = 0; i < completedTasks.length; i++) {
        const task = completedTasks[i];
        const listItem = document.createElement("div");
        listItem.className = "completed-task-item";
        listItem.innerHTML = `
          <span>${task.text}</span>
          <small class="ml-3">${task.date ? `Date: ${task.date}` : ""}${task.date && task.time ? ", " : ""}${task.time ? `Time: ${task.time}` : ""}</small>
        `;
        container.appendChild(listItem);
      }
    } else {
      container.innerHTML = "<p>No completed tasks yet.</p>";
    }
  }
}