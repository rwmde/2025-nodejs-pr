// Demo JavaScript file for Live Server

function updateTime() {
  const timeElement = document.getElementById('time');
  if (timeElement) {
    const now = new Date();
    timeElement.textContent = now.toLocaleTimeString();
  }
}

setInterval(updateTime, 1000);
updateTime();

let count = 0;

function increment() {
  count++;
  updateCountDisplay();
}

function decrement() {
  count--;
  updateCountDisplay();
}

function updateCountDisplay() {
  const countElement = document.getElementById('count');
  if (countElement) {
    countElement.textContent = count;
  }
}

console.log('Demo script loaded!');
