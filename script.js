let time = 25 * 60; // 25 minutes in seconds
let timerInterval;

const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');
const plus10Button = document.getElementById('plus10');
const minus10Button = document.getElementById('minus10');

function updateTimerDisplay() {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function startTimer() {
    if (!timerInterval) {
        timerInterval = setInterval(() => {
            if (time > 0) {
                time--;
                updateTimerDisplay();
            } else {
                clearInterval(timerInterval);
                alert('Time is up!');
            }
        }, 1000);
    }
}

function pauseTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

function resetTimer() {
    pauseTimer();
    time = 25 * 60;
    updateTimerDisplay();
}

function adjustTime(seconds) {
    time += seconds;
    if (time < 0) time = 0;
    updateTimerDisplay();
}

startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);
plus10Button.addEventListener('click', () => adjustTime(10));
minus10Button.addEventListener('click', () => adjustTime(-10));

updateTimerDisplay();


// Timer Functionality

