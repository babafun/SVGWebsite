SVGApp.init(720, 480);

let todos = SVGApp.loadData().todos || [];

const todosList = document.getElementById("todosList");
const listInput = document.getElementById("listInput");
const addBtn = document.getElementById("addBtn");
const exportBtn = document.getElementById("exportBtn");

function save() {
    SVGApp.saveData({ todos });
}

function render() {
    todosList.innerHTML = "";

    todos.forEach((todo, index) => {
        const listItem = SVGApp.createSVGElement("div", "listItem");

        const checkbox = SVGApp.createSVGElement("input");
        checkbox.setAttribute("type", "checkbox");
        if (todo.done) {
            checkbox.setAttribute("checked", "true");
        }

        checkbox.onclick = () => {
            todo.done = !todo.done;
            save();
        };

        const text = SVGApp.createSVGElement("span", "listItemLabel");
        text.textContent = todo.text;
        if (todo.done) text.style.textDecoration = "line-through";

        const arrows = SVGApp.createSVGElement("div", "listItemArrows");

        const up = SVGApp.createSVGElement("button");
        up.textContent = "▲";
        up.onclick = () => {
            if (index > 0) {
                [todos[index - 1], todos[index]] = [todos[index], todos[index - 1]];
                save();
                render();
            }
        };

        const down = SVGApp.createSVGElement("button");
        down.textContent = "▼";
        down.onclick = () => {
            if (index < todos.length - 1) {
                [todos[index + 1], todos[index]] = [todos[index], todos[index + 1]];
                save();
                render();
            }
        };

        const deleteItem = SVGApp.createSVGElement("button", "listItemDelete");
        deleteItem.textContent = "✖";
        deleteItem.onclick = () => {
            todos = todos.filter((_, i) => i !== index);
            save();
            render();
        };

        arrows.appendChild(up);
        arrows.appendChild(down);

        listItem.appendChild(checkbox);
        listItem.appendChild(text);
        listItem.appendChild(arrows);
        listItem.appendChild(deleteItem);

        todosList.appendChild(listItem);
    });
}

addBtn.onclick = () => {
    const text = listInput.value.trim();
    if (!text) {
        return;
    }

    todos.push({ 
        text, 
        done: false,
        created: Date.now()
    });

    listInput.value = "";
    save();
    render();
};

exportBtn.onclick = () => {
    save();
    SVGApp.exportSVG();
};

render();