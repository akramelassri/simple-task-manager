// script.js


/* 
Changes to be made to improve code quality
maybe each td needs to have its own id instead of always checking its parent.parent

+parent.id.slice(4); its better to change this to split at -

innerhtml is known to be dangerous so might aswell switch it with a remove()

third we rerender everything once we make a change it's fine for this but for performance it would nice to only update what's needed tho that seems extremely harder than just rendering everything

*/
const tasks = [
    { id_task: 0, content: 'Do laundury', priority: 'low', completed: false },
    { id_task: 1, content: 'Clean dishes', priority: 'low', completed: false },
    { id_task: 2, content: 'Study', priority: 'high', completed: false },
    { id_task: 3, content: 'Eat', priority: 'medium', completed: true },
    { id_task: 4, content: 'Do laundury', priority: 'low', completed: true },
    { id_task: 5, content: 'Clean dishes', priority: 'low', completed: true },
    { id_task: 6, content: 'Study', priority: 'high', completed: true },
]

const modal = document.querySelector('.modal');
const taskPriority = document.querySelector('#task-priority');
const taskName = document.querySelector('#task-name');
let action;


function createTableRow(task) {
    const tableRow = document.createElement('tr');
    tableRow.id = `row-${task.id_task}`;

    const doneColumn = document.createElement('td');
    const checkInput = document.createElement('input');
    checkInput.type = 'checkbox';

    checkInput.checked = task.completed;
    doneColumn.append(checkInput);

    const nameColumn = document.createElement('td');
    nameColumn.classList.add('task-name-td')

    nameColumn.textContent = task.content;

    const priorityColumn = document.createElement('td');
    priorityColumn.textContent = task.priority;

    const actionsColumn = document.createElement('td');

    const modifyBtn = document.createElement('button');
    modifyBtn.textContent = 'Modify';
    modifyBtn.classList.add('action-btn');

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('action-btn');

    actionsColumn.append(modifyBtn, deleteButton);

    if (task.completed) {
        modifyBtn.disabled = true;
        deleteButton.disabled = true;
    }

    tableRow.append(doneColumn, nameColumn, priorityColumn, actionsColumn);
    return tableRow
}

function removeTaskById(tasks, taskId) {
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id_task === taskId) {
            tasks.splice(i, 1);
            return;
        }
    }
}
function renderOngoingingTasks(tasks) {
    const ongoingTasksContainer = document.querySelector('.ongoing tbody');
    ongoingTasksContainer.innerHTML = '';

    const ongoingTasks = tasks.filter(task => !task.completed).sort((a, b) => {
        const conversion = {
            high: 3,
            medium: 2,
            low: 1,
        }
        return - conversion[a.priority] + conversion[b.priority];
    });

    ongoingTasks.forEach(task => {
        const tableRow = createTableRow(task);
        ongoingTasksContainer.append(tableRow);
    });
    let ongoingTasksCount = ongoingTasks.reduce((acc) => acc + 1, 0);
    document.querySelector('.tasks-ongoing-count').textContent = `Total count: ${ongoingTasksCount}`;


}
function renderCompletedTasks(tasks) {
    const completedTasksContainer = document.querySelector('.completed tbody');
    completedTasksContainer.innerHTML = '';

    const completedTasks = tasks.filter(task => task.completed);
    completedTasks.forEach(task => {
        const tableRow = createTableRow(task);
        completedTasksContainer.append(tableRow);
    });

    let completedTasksCount = completedTasks.reduce((acc) => acc + 1, 0);
    document.querySelector('.tasks-completed-count').textContent = `Total count: ${completedTasksCount}`;

}

function renderAllTasks(tasks) {
    renderOngoingingTasks(tasks);
    renderCompletedTasks(tasks);
}

function getTaskId(object) {
    const parent = object.parentElement.parentElement;
    return +parent.id.slice(4); // change it to split at -
}

document.querySelectorAll('tbody').forEach(e => {
    e.addEventListener('click', (e) => {
        switch (e.target.type) {
            case 'checkbox':
                const taskId = getTaskId(e.target);
                tasks.forEach(element => {
                    if (element.id_task === taskId) {
                        element.completed = e.target.checked;
                    }
                });
                renderAllTasks(tasks);
                break;
            case 'submit':
                if (e.target.textContent === 'Modify') {
                    const taskId = getTaskId(e.target);
                    action = { action: 'modify', taskId };
                    const taskToModify = tasks.find(e => e.id_task == action.taskId);
                    taskName.value = taskToModify.content;
                    taskPriority.value = taskToModify.priority;
                    modal.style.display = 'block';
                } else if (e.target.textContent === 'Delete') {
                    const taskId = getTaskId(e.target);
                    let answer = confirm('Do you really want to delete the task');
                    if (answer) {
                        removeTaskById(tasks, taskId);
                        renderAllTasks(tasks);
                    }
                }
                break;
        }
    });
});


document.querySelector('.cancel-btn').addEventListener('click', e => {
    // clear inputs
    modal.style.display = 'none';
    taskName.value = '';
}
)
document.querySelector('.add-task-btn').addEventListener('click', e => {
    modal.style.display = 'block';
    action = { action: 'add', taskId: null };
});

document.querySelector('.confirm-btn').addEventListener('click', e => {
    switch (action.action) {
        case 'add':
            let newTaskName = taskName.value;
            let newTaskPriority = taskPriority.value;
            let newTaskId = tasks.reduce((acc, curr) => acc < curr.id_task ? curr.id_task : acc, 0) + 1;
            tasks.push({ id_task: newTaskId, content: newTaskName, priority: newTaskPriority, completed: false });
            break;

        case 'modify':
            const taskToModify = tasks.find(e => e.id_task == action.taskId);
            taskToModify.content = taskName.value;
            taskToModify.priority = taskPriority.value;
            break;
    }

    taskName.value = '';
    modal.style.display = 'none';
    renderAllTasks(tasks);
}
);


renderAllTasks(tasks);