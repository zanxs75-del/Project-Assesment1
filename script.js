// DOMContentLoaded is an event that happens automatically when all the HTML elements have been created
// in other words, when the event happens, the webpage is ready
document.addEventListener("DOMContentLoaded", async function () {

    tasks = await loadTasks();
    // the tasks array is from data.js global scope
    displayTasks(tasks);

    const addTodoButton = document.querySelector("#addTodo");
    addTodoButton.addEventListener("click", function () {
        const name = document.querySelector("#name").value;
        const dueDate = document.querySelector("#dueDate").value;
        const urgency = document.querySelector("#urgency").value;

        addTask(tasks, name, dueDate, urgency);
        saveTasks(tasks);

        displayTasks(tasks);


    })

})

function displayTasks(tasks) {
    // select the task list to append child into later
    const taskListUl = document.querySelector("#taskList");

    // remove all the existing tasks
    taskListUl.innerText = "";


    for (let t of tasks) {
        const liElement = document.createElement("li");
        liElement.className = "list-group-item";
        // alternatively:
        // liElement.classList.add('list-group-item');
        // liElement.classList.add('d-flex');
        // liElement.classList.add('justify-content-between');

        liElement.innerHTML = `
        <div class="row">
            <div class="col-6">${t.name}</div>
            <div class="col">Date Due: ${t.dateDue}</div>
            <div class="col">Urgency: ${t.urgency}</div>
            <div class="col">
                <button class="m-2 btn btn-danger btn-sm delete-btn">Delete</button>
                <button class="m-2 btn btn-success btn-sm update-btn">Update</button>
            </div>
        </div>
        `

        // retrieve the delete button inside liElement
        const deleteBtn = liElement.querySelector(".delete-btn");
        deleteBtn.addEventListener("click", function () {
            deleteTask(tasks, t.id);
            saveTasks(tasks);
            displayTasks(tasks);
        })

        const updateBtn = liElement.querySelector(".update-btn");
        // v1: plain version using prompt
        // updateBtn.addEventListener("click", function(){
        //     const newName = prompt("Enter the new name", t.name);
        //     const newDate = prompt("Enter the new date", t.dateDue);
        //     const newUrgency = prompt("Enter the new urgency", t.urgency);
        //     updateTask(tasks, t.id, newName, newDate, newUrgency);
        //     displayTasks(tasks);
        // })

        // v2: using SweetAlert
        updateBtn.addEventListener("click", function () {
            Swal.fire({
                "title": `Update task: ${t.name}`,
                "html": `
                    <div>
                        <div class="m-2">
                            <label>Task Name</label>
                            <input type="text" id="newName" class="form-control" value="${t.name}" />
                        </div>
                        <div class="m-2">
                            <label>Date Due</label>
                            <input type="date" id="newDueDate" class="form-control" value="${t.dateDue}"/>
                        </div>
                        <div class="m-2">
                            <label>Urgency</label>
                            <select id="newUrgency" class="form-control">
                            <option value="1" ${t.urgency == 1 ? "selected" : ""}>1</option>
                            <option value="2" ${t.urgency == 2 ? "selected" : ""}>2</option>
                            <option value="3" ${t.urgency == 3 ? "selected" : ""}>3</option>
                            <option value="4" ${t.urgency == 4 ? "selected" : ""}>4</option>
                            <option value="5" ${t.urgency == 5 ? "selected" : ""}>5</option>
                            </select>

                        </div>
                    </div>
                                    `,
                showCancelButton: true,
                showCloseButton: true,
                preConfirm: function() {
                    // preConfirm is called when the user pressed on the confirm button
                    let newTaskName = document.querySelector("#newName").value;
                    let newDateDue = document.querySelector("#newDueDate").value;
                    let newUrgency = document.querySelector("#newUrgency").value;
                    
                    updateTask(tasks, t.id, newTaskName, newDateDue, newUrgency);
                    saveTasks(tasks);
                    displayTasks(tasks);
                }
            });
        })

        taskListUl.appendChild(liElement);
    }


}