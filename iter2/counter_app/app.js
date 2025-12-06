SVGApp.init(800, 600);

const state = SVGApp.loadData();
let count = state.count || 0;

const el = document.getElementById("count");
const incBtn = document.getElementById("incBtn");
const exportBtn = document.getElementById("exportBtn");

function render() {
    el.textContent = "Count: " + count;
}

incBtn.onclick = () => {
    count++;
    SVGApp.saveData({ count });
    render();
};

exportBtn.onclick = () => {
    SVGApp.saveData({ count });
    SVGApp.exportSVG();
}

render();
