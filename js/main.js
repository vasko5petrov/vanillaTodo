var todoInput = document.getElementById("todo-input");
var todoSubmit = document.getElementById("todo-submit");
var clearBtn = document.getElementById("btn-clear");
var toDoList = document.getElementById('todo-list');
var doneList = document.getElementById('done-list');

var removeBtn, doneCheck, newListItem;
var itemArray = localStorage.itemArray ? JSON.parse(localStorage.getItem("itemArray")) : [];

function updateLocalStorage(data) {
    if(data.length == 0) {
        localStorage.removeItem("itemArray");
    } else {
        localStorage.setItem("itemArray", JSON.stringify(data));
    }
}

function createTodo(item) {
    newListItem = document.createElement("li");
    newListItem.className = "todo-item clearfix";
    newListItem.innerHTML = `
        <p>${item.value}</p>
    `;

    removeBtn = document.createElement("button");
    removeBtn.type = "submit";
    removeBtn.innerHTML = "&#88;";
    removeBtn.className = "todo-remove";
    removeBtn.setAttribute("id", item.id);

    doneCheck = document.createElement("input");
    doneCheck.setAttribute("type", "checkbox");
    doneCheck.type = "checkbox";
    doneCheck.className = "todo-check";
    doneCheck.setAttribute("id", item.id);

    let itemActions = document.createElement("div");
    itemActions.className = "flex";
    itemActions.setAttribute("id", "todo-actions");

    itemActions.appendChild(doneCheck);
    itemActions.appendChild(removeBtn);

    newListItem.appendChild(itemActions);

    if(item.done) {
        doneCheck.setAttribute("checked", true);
        doneList.appendChild(newListItem);
    } else {
        toDoList.appendChild(newListItem);
    }
}

var actionBtns = function() {
    removeBtn.addEventListener('click', function(e) {
        let target = e.target;

        target.parentNode.parentNode.parentNode.removeChild(target.parentNode.parentNode);

        itemArray.forEach(function(current) {
            if(current.id == target.previousSibling.id) {
                itemArray = itemArray.filter(function(item) {
                    return item.id !== current.id;
                });
            }
        });

        updateLocalStorage(itemArray);
    })

    doneCheck.addEventListener('click', function(e) {
        let target = e.target;
        if(target.checked == true) {
            let doneListItem = this.parentNode.parentNode;
            doneList.prepend(doneListItem);
            
            itemArray.forEach(function(current) {
                if(current.id == target.id) {
                    current.done = true;
                }
            });

        } else {
            let undoneListItem = this.parentNode.parentNode;
            toDoList.prepend(undoneListItem);

            itemArray.forEach(function(current) {
                if(current.id == target.id) {
                    current.done = false;
                }
            });
        }

        updateLocalStorage(itemArray);      
    });
}

todoSubmit.addEventListener('click', function(e) {
    e.preventDefault();
    if(!todoInput.value == "") {
        let item = {
            id: (new Date()).getTime(),
            value: todoInput.value,
            done: false
        }

        createTodo(item);        
        actionBtns();
        itemArray.push(item);

        todoInput.value = "";
        updateLocalStorage(itemArray);
    }
});

clearBtn.addEventListener('click', function() {
    if(confirm("WARNING! All toDoList will be permanently deleted!")) {
        let todoItems = document.getElementsByClassName("todo-item");
        
        while (todoItems[0]) {
            todoItems[0].parentNode.removeChild(todoItems[0]);
        }

        itemArray = [];
        updateLocalStorage(itemArray);
    }
});

function preload(array) {
    array.forEach(function(current) {
        
        createTodo(current)

        actionBtns();

    });
}

preload(itemArray);