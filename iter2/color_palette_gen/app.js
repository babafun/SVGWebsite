SVGApp.init(1280, 720);

const palette = document.getElementById('palette');
const generateBtn = document.getElementById('generate-btn');
const toast = document.getElementById('toast');

function randomColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}

function generatePalette() {
  palette.innerHTML = '';
  for (let i = 0; i < 5; i++) {
    const color = randomColor();
    const colorDiv = SVGApp.createSVGElement("div", "color");
    colorDiv.style.background = color;
    colorDiv.textContent = color.toUpperCase();

    colorDiv.addEventListener('click', () => copyColor(color));
    palette.appendChild(colorDiv);
  }
}

function copyColor(color) {
  navigator.clipboard.writeText(color);
  showToast('Copied ' + color + '!');
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 1500);
}

generateBtn.addEventListener('click', generatePalette);

generatePalette();
