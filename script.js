var tasks = [];
var taskForm = document.getElementById("taskForm");
var taskInput = document.getElementById("taskInput");
var prioritySelect = document.getElementById("prioritySelect");
var errorMsg = document.getElementById("errorMsg");
var taskList = document.getElementById("taskList");
var taskCounter = document.getElementById("taskCounter");
var filterBtns = document.querySelectorAll(".filter-btn");

// Get tasks from localstroage, then render
window.onload = function() {
  var saved = localStorage.getItem("myTasks");
  if (saved) {
    tasks = JSON.parse(saved);
  }
  renderTasks("all");
};

// Add Task
taskForm.addEventListener("submit", function(e) {
  e.preventDefault(); // prevent reloading page
  var text = taskInput.value.trim();
  var priority = prioritySelect.value; // low, med or high


  // Create task object
  var newTask = {
    text: text,
    done: false,
    priority: priority
  };

  tasks.push(newTask);

  // save to localstorage
  localStorage.setItem("myTasks", JSON.stringify(tasks));

  // Clear the input after adding task
  taskInput.value = "";

  // re-render
  renderTasks("all");
});

// Filter button click handlers
filterBtns.forEach(function(btn) {
  btn.addEventListener("click", function() {
    var filterType = btn.getAttribute("data-filter");
    renderTasks(filterType);
  });
});

// Render tasks based on the filter: all, active or done
function renderTasks(filter) {
  taskList.innerHTML = "";
  // Decide which tasks to show
  var tasksToShow = [];
  if (filter === "active") {
    tasksToShow = tasks.filter(function(t) {
      return !t.done;
    });
  } else if (filter === "done") {
    tasksToShow = tasks.filter(function(t) {
      return t.done;
    });
  } else {
    tasksToShow = tasks;
  }

  // loop through array and create a list item for each
  for (var i = 0; i < tasksToShow.length; i++) {
    var task = tasksToShow[i];
    createTaskListItem(task);
  }

  // Update counter for active tasks
  updateCounter();
}

//create new list item element for task
function createTaskListItem(task) {
  var li = document.createElement("li");

  // If task is done, add "done" class
  if (task.done) {
    li.classList.add("done");
  }

  var textContainer = document.createElement("div");
  textContainer.className = "task-text";

  var mainText = document.createElement("span");
  mainText.className = "main-text";
  mainText.textContent = task.text;
  textContainer.appendChild(mainText);

  var priorityLabel = document.createElement("span");
  priorityLabel.className = "priority-label";
  priorityLabel.textContent = "Priority: " + task.priority;
  textContainer.appendChild(priorityLabel);

  li.appendChild(textContainer);

  // create done button
  var doneBtn = document.createElement("button");
  doneBtn.textContent = "Done";
  doneBtn.addEventListener("click", function() {
    // Toggle done in tasks array
    task.done = !task.done;
    saveTasks();
    renderTasks("all");
  });
  li.appendChild(doneBtn);

  // create remove button
  var removeBtn = document.createElement("button");
  removeBtn.textContent = "Remove";
  removeBtn.addEventListener("click", function() {
    var index = tasks.indexOf(task);
    if (index !== -1) {
      tasks.splice(index, 1);
    }
    saveTasks();
    renderTasks("all");
  });
  li.appendChild(removeBtn);

  taskList.appendChild(li);
}

// updates task counter
function updateCounter() {
  var activeCount = 0;
  for (var i = 0; i < tasks.length; i++) {
    if (!tasks[i].done) {
      activeCount++;
    }
  }
  taskCounter.textContent = "Tasks left: " + activeCount;
}

// saves task to local storage
function saveTasks() {
  localStorage.setItem("myTasks", JSON.stringify(tasks));
}