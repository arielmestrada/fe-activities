const todoToggle = document.querySelector(".todo-toggle");
const todoContainer = document.querySelector(".todo-container");

todoToggle.addEventListener("click", () => {
  const visibility = todoContainer.getAttribute("data-visible");

  if (visibility === "false") {
    todoContainer.setAttribute("data-visible", true);
  } else {
    todoContainer.setAttribute("data-visible", false);
  }
});

const linkToggle = document.querySelector(".link-toggle");
const linkContainer = document.querySelector(".link-container");

linkToggle.addEventListener("click", () => {
  const visibility = linkContainer.getAttribute("data-link-visible");

  if (visibility === "false") {
    linkContainer.setAttribute("data-link-visible", true);
  } else {
    linkContainer.setAttribute("data-link-visible", false);
  }
});

// Todo Start

const todoListBody = document.querySelector(".todo-list-body");
const listsContainer = document.querySelector("[data-lists]");
const newListForm = document.querySelector("[data-new-list-form]");
const newListInput = document.querySelector("[data-new-list-input]");
const newTaskForm = document.querySelector("[data-new-task-form]");
const newTaskInput = document.querySelector("[data-new-task-input]");
const deleteListButton = document.querySelector("[data-delete-list-button]");
const clearCompleteTasksButton = document.querySelector(
  "[data-clear-complete-tasks]"
);
const listDisplayContainer = document.querySelector(
  "[data-list-display-container]"
);
const tasksContainer = document.querySelector("[data-tasks]");
const taskTemplate = document.getElementById("task-template");
const options = document.querySelector("[data-list-id]");
const LOCAL_STORAGE_LIST_KEY = "task.lists";
const LOCAL_STORAGE_SELECTED_LIST_NAME_KEY = "task.selectedListName";
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectedListName = localStorage.getItem(
  LOCAL_STORAGE_SELECTED_LIST_NAME_KEY
);

listsContainer.addEventListener("click", (e) => {
  selectedListName = listsContainer.value;
  const selectedList = lists.find((list) => list.name === selectedListName);
  save();
  clearElement(tasksContainer);
  renderTasks(selectedList);
});

clearCompleteTasksButton.addEventListener("click", (e) => {
  const selectedList = lists.find((list) => list.name === selectedListName);
  selectedList.tasks = selectedList.tasks.filter((task) => !task.complete);
  save();
  clearElement(tasksContainer);
  renderTasks(selectedList);
});

tasksContainer.addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() === "input") {
    const selectedList = lists.find((list) => list.name === selectedListName);
    const selectedTask = selectedList.tasks.find(
      (task) => task.id === e.target.id
    );
    selectedTask.complete = e.target.checked;
    save();
  }
});

deleteListButton.addEventListener("click", (e) => {
  lists = lists.filter((list) => list.name !== selectedListName);
  saveAndRender();
  selectedListName = listsContainer.value;
  clearElement(tasksContainer);
});

newListForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const listName = newListInput.value;
  if (listName == null || listName === "") return;
  const list = createList(listName);
  newListInput.value = null;
  lists.push(list);
  saveAndRender();
  selectedListName = listsContainer.value;
});

newTaskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const taskName = newTaskInput.value;
  if (taskName == null || taskName === "") return;
  const task = createTask(taskName);
  newTaskInput.value = null;
  const selectedList = lists.find((list) => list.name === selectedListName);
  selectedList.tasks.push(task);
  save();
  clearElement(tasksContainer);
  renderTasks(selectedList);
});

function createList(name) {
  return {
    id: Date.now().toString(),
    name: name,
    tasks: [],
  };
}

function createTask(name) {
  return {
    id: Date.now().toString(),
    name: name,
    complete: false,
  };
}

function saveAndRender() {
  save();
  render();
}

function save() {
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));
  localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_NAME_KEY, selectedListName);
}

function render() {
  clearElement(listsContainer);
  renderLists();

  const selectedList = lists.find((list) => list.name === selectedListName);
  if (!listsContainer.firstChild) {
    listsContainer.style.display = "none";
    todoListBody.style.justifyContent = "center";
    todoListBody.style.alignItems = "center";
    newTaskForm.style.display = "none";
    document.querySelector(".todo-deletes").style.display = "none";
  } else {
    listsContainer.style.display = "";
    todoListBody.style.display = "flex";
    todoListBody.style.justifyContent = "";
    todoListBody.style.alignItems = "";
    newTaskForm.style.display = "";
    document.querySelector(".todo-deletes").style.display = "";
    clearElement(tasksContainer);
    renderTasks(selectedList);
  }
}

function renderTasks(selectedList) {
  selectedList.tasks.forEach((task) => {
    const taskElement = document.importNode(taskTemplate.content, true);
    const checkbox = taskElement.querySelector("input");
    checkbox.id = task.id;
    checkbox.checked = task.complete;
    const label = taskElement.querySelector("label");
    label.htmlFor = task.id;
    label.append(task.name);
    tasksContainer.appendChild(taskElement);
  });
}

function renderLists() {
  lists.forEach((list) => {
    const listElement = document.createElement("option");
    listElement.dataset.listId = list.id;
    listElement.innerText = list.name;
    listsContainer.appendChild(listElement);
  });
}

function clearElement(element, elementY) {
  try {
    let x = document.getElementById("test").textContent;
    // console.log(x)
    if (x === elementY) {
      showRandQuote();
    }
  } catch (error) {}
  // console.log(elementY)
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

render();

// Todo End

// Date & Time Start

const dateAndTime = document.querySelector(".datetime");

function updateClock() {
  const now = new Date();
  let nameofDay = now.getDay(),
    mo = now.getMonth(),
    dnum = now.getDate(),
    yr = now.getFullYear(),
    hou = now.getHours(),
    min = now.getMinutes(),
    sec = now.getSeconds(),
    pe = hou >= 12 ? "PM" : "AM";

  if (hou === 0) {
    hou = 12;
  }
  if (hou > 12) {
    hou = hou - 12;
  }

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Augest",
    "September",
    "October",
    "November",
    "December",
  ];
  const week = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const ids = [
    "dayname",
    "month",
    "daynum",
    "year",
    "hour",
    "minutes",
    "seconds",
    "period",
  ];
  const values = [
    week[nameofDay],
    months[mo],
    dnum,
    yr,
    hou.toString().padStart(2, "0"),
    min.toString().padStart(2, "0"),
    sec.toString().padStart(2, "0"),
    pe,
  ];
  for (let i = 0; i < ids.length; i++)
    document.getElementById(ids[i]).innerText = values[i];
}

function initClock() {
  updateClock();
  window.setInterval("updateClock()", 1);
}

function changeBg() {
  const bodyElement = document.querySelector("body");
  const now = new Date();
  let hour = now.getHours();

  if (givePeriod(hour) === "Morning") {
    bodyElement.id = "morning";
  } else if (givePeriod(hour) === "Afternoon") {
    bodyElement.id = "afternoon";
  } else if (givePeriod(hour) === "Evening") {
    bodyElement.id = "night";
  }
}

function givePeriod(hour) {
  if (hour >= 6 && hour <= 11) {
    return "Morning";
  } else if (hour >= 12 && hour <= 18) {
    return "Afternoon";
  } else {
    return "Evening";
  }
}

// Date & Time End

// Name Greetings Start

const userName = document.querySelector(".hero-name");
const userNameInput = document.getElementById("name-input");
const userNameForm = document.querySelector("[data-hero-name-form]");
let userGreeting = document.getElementById("greetings");
const LOCAL_STORAGE_USER_NAME_KEY = "user.name";

userNameForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const nameOfUser = userNameInput.value;
  if (nameOfUser == null || nameOfUser === "") {
    return;
  } else {
    saveUserName(nameOfUser);
    renderNameInput();
  }
});

function saveUserName(name) {
  localStorage.setItem(LOCAL_STORAGE_USER_NAME_KEY, name);
}

function replaceHeroInput() {
  const now = new Date();
  let hour = now.getHours();
  userNameForm.style.transition = "opacity 1000ms ease";
  userNameForm.style.opacity = "0";
  const newH2 = document.createElement("h2");
  newH2.style.opacity = "0";
  // newH2.style.border = "1px solid red"
  newH2.style.transition = "opacity 1000ms ease";
  newH2.innerHTML = `Good ${givePeriod(hour)}, ${localStorage.getItem(
    LOCAL_STORAGE_USER_NAME_KEY
  )}`;
  newH2.id = "greetings";
  setTimeout(() => {
    newH2.style.opacity = "1";
  }, 1000);
  userName.appendChild(newH2);
}

function renderNameInput() {
  if (!localStorage.getItem(LOCAL_STORAGE_USER_NAME_KEY)) {
    document.querySelector("header").style.display = "none";
    document.querySelector("footer").style.display = "none";
    dateAndTime.style.display = "none";
    document.querySelector(".main-focus").style.display = "none";
    document.querySelector(".random-quotes").style.display = "none";
    setTimeout(() => {
      userNameInput.style.opacity = "1";
    }, 1000);
  } else {
    userNameForm.style.display = "none";
    replaceHeroInput();
    document.querySelector("header").style.display = "";
    document.querySelector("footer").style.display = "";
    dateAndTime.style.display = "";
    document.querySelector(".main-focus").style.display = "";
    document.querySelector(".random-quotes").style.display = "";
    setTimeout(() => {
      document.querySelector("header").style.opacity = "1";
      document.querySelector("footer").style.opacity = "1";
      dateAndTime.style.opacity = "1";
      document.querySelector(".main-focus").style.opacity = "1";
      document.querySelector(".random-quotes").style.opacity = "1";
    }, 500);
  }
}

renderNameInput();

function renderAll() {}

// Name Greetings End

// Focus Start

const focusContainer = document.querySelector(".main-focus");
const focusForm = document.querySelector(".focus-form");
const focusLabel = document.querySelector(".focus-label");
const focusInput = document.getElementById("focus-input");
const focusRemoveButton = document.querySelector(".focus-remove-button");
const LOCAL_STORAGE_FOCUS_KEY = "focus";

focusForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const enteredFocus = focusInput.value;
  if (enteredFocus == null || enteredFocus === "") {
    return;
  } else {
    saveFocus(enteredFocus);
    focusInput.value = null;
    renderFocus();
  }
});

focusRemoveButton.addEventListener("click", (e) => {
  localStorage.removeItem("focus");
  clearFocus();
  renderFocus();
});

function saveFocus(focus) {
  localStorage.setItem(LOCAL_STORAGE_FOCUS_KEY, focus);
}

function renderFocus() {
  if (!localStorage.getItem(LOCAL_STORAGE_FOCUS_KEY)) {
    focusForm.style.display = "";
  } else {
    focusForm.style.display = "none";
    createFocus();
  }
}

function createFocus() {
  const textElement = document.createElement("h2");
  textElement.id = "focus-output";
  textElement.innerHTML = `<i style='font-size: 1.5rem;'>Goal for today:</i><br>${localStorage.getItem(
    LOCAL_STORAGE_FOCUS_KEY
  )}`;
  focusContainer.insertBefore(
    textElement,
    focusContainer.children[focusContainer.children.length - 1]
  );
}

function clearFocus() {
  focusContainer.removeChild(document.getElementById("focus-output"));
}

renderFocus();

//Focus End

//Random Quote Start

const randQuotesContainer = document.querySelector(".random-quotes");
const quotesElement = document.querySelector(".quotes");
const quoteElement = document.querySelector(".quote");
const addQuoteForm = document.querySelector(".add-quote-form");
const addQuoteInput = document.querySelector("[data-add-quote-input]");
const addQuoteButton = document.querySelector(".add-quote");
const quoteButton = document.querySelector(".add-or-remove-quote");
// const removeQuoteButton = document.querySelector(".remove-quote");
const LOCAL_STORAGE_QUOTES_KEY = "quotes";
const LOCAL_STORAGE_QUOTES_ARRAY = JSON.parse(
  localStorage.getItem(LOCAL_STORAGE_QUOTES_KEY)
);

quotesElement.addEventListener("click", showRandQuote);

addQuoteForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let quoteValue = addQuoteInput.value;
  if (quoteValue == null || quoteValue === "") {
    return;
  } else {
    saveQuotes();
    clearElement(quotesElement);
    createQuote(quoteValue);
    addQuoteInput.value = null;
  }
});

// removeQuoteButton.addEventListener("click", (e) => {
//   randQuotes = randQuotes.filter((quotes) => quotes !== quoteShowing);
//   saveQuotes();
//   showRandQuote();
// });

let randQuotes =
  JSON.parse(localStorage.getItem(LOCAL_STORAGE_QUOTES_KEY)) || [];
let quoteShowing = document.querySelector("[data-current-quote]");

function createQuote(quote) {
  const createdQuote = document.createElement("li");
  createdQuote.classList.add("quote");
  createdQuote.dataset.currentQuote;
  createdQuote.setAttribute("id", "test");
  createdQuote.innerText = quote;
  randQuotes.push(quote);
  quotesElement.appendChild(createdQuote);
  // quoteShowing = document.querySelector("[data-current-quote]");
}

document.querySelector("[data-current-quote]");

function showRandQuote() {
  if (localStorage.getItem(LOCAL_STORAGE_QUOTES_KEY)) {
    let randomNumber = Math.floor(Math.random() * randQuotes.length);
    let selectedQuote = randQuotes[randomNumber];
    // console.log(selectedQuote)
    // quoteButton.style.display = "none";
    clearElement(quotesElement, selectedQuote);
    createQuote(selectedQuote);
  } else {
    quoteButton.style.display = "flex";
  }
}

function saveQuotes() {
  localStorage.setItem(LOCAL_STORAGE_QUOTES_KEY, JSON.stringify(randQuotes));
}

showRandQuote();

// let sampleQuotes = [
//   "Write it on your heart that every day is the best day in the year.",
//   "Believe that life is worth living and your belief will help create the fact.",
//   "A positive atmosphere nurtures a positive attitude, which is required to take positive action.",
// ];

// localStorage.setItem(LOCAL_STORAGE_QUOTES_KEY, JSON.stringify(sampleQuotes));

window.addEventListener("load", (e) => {
  initClock();
  initBg();
});

function initBg() {
  changeBg();
  window.setInterval("changeBg()", 1);
}

//Random Quote Start

//Links Start
const linkTemplate = document.getElementById("link-template");
const linksUl = document.querySelector(".links");
const addLinkForm = document.querySelector(".add-link-form");
const addNameInput = document.getElementById("new-link-name-input");
const addUrlInput = document.getElementById("new-link-url-input");
const LOCAL_STORAGE_LINKS_KEY = "links";
const deleteButton = document.querySelector("[data-delete-links]");

let links = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LINKS_KEY)) || [];

addLinkForm.addEventListener("keyup", (e) => {
  if (e.code === "Enter") {
    e.preventDefault();
    const nameInput = addNameInput.value;
    const urlInput = addUrlInput.value;
    console.log(nameInput);
    console.log(urlInput);
    if (nameInput == null || urlInput == null) return;
    const createdLink = createLink(nameInput, urlInput);
    addNameInput.value = null;
    addUrlInput.value = null;
    links.push(createdLink);
    saveLinks();
    renderLinks();
  }
});

deleteButton.addEventListener("click", (e) => {
  localStorage.removeItem(LOCAL_STORAGE_LINKS_KEY);
  while (links[0]) {
    links.pop();
  }
  renderLinks();
});

function createLink(linkName, linkUrl) {
  return {
    name: linkName,
    url: linkUrl,
  };
}

function saveLinks() {
  localStorage.setItem(LOCAL_STORAGE_LINKS_KEY, JSON.stringify(links));
}

function renderLinks() {
  clearElement(linksUl);
  links.forEach((link) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    li.classList.add("link");
    a.classList.add("link-url");
    a.setAttribute("href", link.url);
    a.setAttribute("target", "_blank");
    a.innerText = link.name;
    li.append(a);
    linksUl.append(li);
  });
}

renderLinks();

//Links End
