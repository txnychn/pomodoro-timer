let time = 25 * 60; // Default to 25 minutes
let timerInterval;

// Timer durations for each tab
const durations = {
    work: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
};

// DOM elements
const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');
const plus10Button = document.getElementById('plus10');
const minus10Button = document.getElementById('minus10');
const tabs = document.querySelectorAll('.tab');

// Function to update the timer display
function updateTimerDisplay() {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Function to switch tabs
function switchTab(tab) {
    tabs.forEach((t) => t.classList.remove('active')); // Remove active class from all tabs
    tab.classList.add('active'); // Add active class to the selected tab

    // Update timer duration based on the selected tab
    if (tab.id === 'work-tab') {
        time = durations.work;
    } else if (tab.id === 'short-break-tab') {
        time = durations.shortBreak;
    } else if (tab.id === 'long-break-tab') {
        time = durations.longBreak;
    }

    updateTimerDisplay(); // Refresh the timer display
    pauseTimer(); // Stop any running timer
}

// Timer control functions
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
    time = durations[tabs[0].classList.contains('active') ? 'work' : 'shortBreak'];
    updateTimerDisplay();
}

function adjustTime(seconds) {
    time += seconds;
    if (time < 0) time = 0; // Prevent negative time
    updateTimerDisplay();
}

// Event Listeners
tabs.forEach((tab) => {
    tab.addEventListener('click', () => switchTab(tab));
});

startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);
plus10Button.addEventListener('click', () => adjustTime(10));
minus10Button.addEventListener('click', () => adjustTime(-10));

// Initialize the app
switchTab(document.getElementById('work-tab')); // Set the default tab
