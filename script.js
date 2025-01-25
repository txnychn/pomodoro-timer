let time = 25 * 60; // Default to 25 minutes
let timerInterval;
let totalDuration = 25 * 60; // Used for progress bar calculations

// Timer durations with LocalStorage validation
const durations = JSON.parse(localStorage.getItem('durations')) || {
    work: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
};

['work', 'shortBreak', 'longBreak'].forEach((key) => {
    if (isNaN(durations[key]) || durations[key] <= 0) {
        durations[key] = key === 'work' ? 25 * 60 : key === 'shortBreak' ? 5 * 60 : 15 * 60;
    }
});

// DOM elements
const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');
const plus10Button = document.getElementById('plus10');
const minus10Button = document.getElementById('minus10');
const tabs = document.querySelectorAll('.tab');
const progressBar = document.getElementById('progress-bar');
const alarmSound = document.getElementById('alarm-sound');
const settingsButton = document.getElementById('settings-button');
const settingsPopup = document.getElementById('settings-popup');
const closePopupButton = document.getElementById('close-popup');
const saveSettingsButton = document.getElementById('save-settings');
const overlay = document.getElementById('settings-popup-overlay');
const workDurationInput = document.getElementById('popup-work-duration');
const shortBreakDurationInput = document.getElementById('popup-short-break-duration');
const longBreakDurationInput = document.getElementById('popup-long-break-duration');
const taskInput = document.getElementById('task-input');
const addTaskButton = document.getElementById('add-task');
const taskList = document.getElementById('task-list');

// Timer functions
function updateTimerDisplay() {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    updateProgressBar();
}
// Enable direct editing of the timer
timerDisplay.addEventListener('click', () => {
    // Create an input element to replace the timer display temporarily
    const timerInput = document.createElement('input');
    timerInput.type = 'text';
    timerInput.value = `${Math.floor(time / 60)}:${String(time % 60).padStart(2, '0')}`;
    
    // Apply the same styles as the timer display to prevent layout shifts
    timerInput.style.textAlign = 'center';
    timerInput.style.width = timerDisplay.offsetWidth + 'px'; // Match width
    timerInput.style.height = timerDisplay.offsetHeight + 'px'; // Match height
    timerInput.style.fontSize = window.getComputedStyle(timerDisplay).fontSize; // Match font size
    timerInput.style.border = 'none';
    timerInput.style.backgroundColor = 'transparent';
    timerInput.style.color = window.getComputedStyle(timerDisplay).color; // Match text color
    timerInput.style.textAlign = 'center';
    timerInput.style.outline = 'none'; // Remove default input border focus style

    // Replace the timer display with the input
    timerDisplay.replaceWith(timerInput);
    timerInput.focus();

    // Handle when the user finishes typing (presses Enter or blurs the input)
    const saveTimerInput = () => {
        const inputTime = timerInput.value.trim();
        const [minutes, seconds] = inputTime.split(':').map(Number);

        // Validate input
        if (!isNaN(minutes) && minutes >= 0 && !isNaN(seconds) && seconds >= 0 && seconds < 60) {
            time = minutes * 60 + seconds;
            totalDuration = time; // Update total duration to match the new time
            updateTimerDisplay();
        }

        // Replace input back with the timer display
        timerInput.replaceWith(timerDisplay);
    };

    // Save the input on Enter key or when losing focus
    timerInput.addEventListener('blur', saveTimerInput);
    timerInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            saveTimerInput();
        }
    });
});



function updateProgressBar() {
    const progress = ((totalDuration - time) / totalDuration) * 100;
    progressBar.style.width = `${progress}%`;
}

function startTimer() {
    if (!timerInterval) {
        startButton.disabled = true;
        timerInterval = setInterval(() => {
            if (time > 0) {
                time--;
                updateTimerDisplay();
            } else {
                clearInterval(timerInterval);
                timerInterval = null;
                startButton.disabled = false;
                alarmSound.play();
                alert('Time is up!');
            }
        }, 1000);
    }
}

function pauseTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    startButton.disabled = false;
}

function resetTimer() {
    pauseTimer();
    time = totalDuration;
    updateTimerDisplay();
}

function adjustTime(seconds) {
    time += seconds;
    if (time < 0) time = 0;
    updateTimerDisplay();
}

// Tab and duration switching
function switchTab(tab) {
    tabs.forEach((t) => t.classList.remove('active'));
    tab.classList.add('active');

    if (tab.id === 'work-tab') totalDuration = durations.work;
    else if (tab.id === 'short-break-tab') totalDuration = durations.shortBreak;
    else if (tab.id === 'long-break-tab') totalDuration = durations.longBreak;

    time = totalDuration;
    updateTimerDisplay();
    pauseTimer();
}

// Popup controls
saveSettingsButton.addEventListener('click', () => {
    // Update durations
    durations.work = parseInt(workDurationInput.value) * 60;
    durations.shortBreak = parseInt(shortBreakDurationInput.value) * 60;
    durations.longBreak = parseInt(longBreakDurationInput.value) * 60;
    localStorage.setItem('durations', JSON.stringify(durations));

    // Reset timers based on the active tab
    const activeTab = document.querySelector('.tab.active');
    if (activeTab.id === 'work-tab') {
        totalDuration = durations.work;
    } else if (activeTab.id === 'short-break-tab') {
        totalDuration = durations.shortBreak;
    } else if (activeTab.id === 'long-break-tab') {
        totalDuration = durations.longBreak;
    }

    time = totalDuration; // Reset the timer
    updateTimerDisplay(); // Update the timer display

    // Close the popup and hide overlay
    settingsPopup.classList.add('hidden');
    overlay.classList.remove('active');
});

settingsButton.addEventListener('click', () => {
    settingsPopup.classList.remove('hidden'); // Show popup
    overlay.classList.add('active'); // Show overlay
});

closePopupButton.addEventListener('click', () => {
    settingsPopup.classList.add('hidden'); // Hide popup
    overlay.classList.remove('active'); // Hide overlay
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !settingsPopup.classList.contains('hidden')) {
        settingsPopup.classList.add('hidden');
        overlay.classList.remove('active');
    }
});


// Task list
function addTask() {
    const taskText = taskInput.value.trim();
    if (!taskText) return;

    const li = document.createElement("li");
    li.textContent = taskText;
    li.tabIndex = 0;
    li.draggable = true; // Enable dragging for the task

    const buttonContainer = document.createElement("div");

    // Complete Button
    const completeButton = document.createElement("button");
    completeButton.innerHTML = "&#10003;";
    completeButton.addEventListener("click", () => markTaskComplete(li));

    // Delete Button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "X";
    deleteButton.addEventListener("click", () => {
        li.remove();
    });

    buttonContainer.appendChild(completeButton);
    buttonContainer.appendChild(deleteButton);

    li.appendChild(buttonContainer);
    taskList.appendChild(li);

    // Drag and Drop Event Listeners
    li.addEventListener("dragstart", handleDragStart);
    li.addEventListener("dragover", handleDragOver);
    li.addEventListener("drop", handleDrop);
    li.addEventListener("dragend", handleDragEnd);

    // Keyboard Interaction for Enter and Backspace
    li.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            markTaskComplete(li); // Mark as complete on Enter key press
        } else if (event.key === "Backspace") {
            li.remove(); // Delete the task on Backspace key press
        }
    });

    taskInput.value = "";
}

// Function to Mark a Task as Complete
function markTaskComplete(task) {
    task.classList.toggle("completed");
    if (task.classList.contains("completed")) {
        taskList.appendChild(task); // Move to the bottom if completed
    } else {
        taskList.insertBefore(task, taskList.firstChild); // Move back to the top if uncompleted
    }
}

// Drag and Drop Handlers
let draggedTask = null;

function handleDragStart(event) {
    draggedTask = event.target; // Store the dragged task
    event.target.style.opacity = "0.7"; // Make the dragged task semi-transparent
    event.target.style.transform = "scale(1.05)"; // Slightly enlarge the dragged task
    event.target.classList.add("dragging"); // Add dragging class
}

function handleDragOver(event) {
    event.preventDefault(); // Allow drop
    const target = event.target.closest("li"); // Ensure we're over a task
    if (target && target !== draggedTask) {
        const bounding = target.getBoundingClientRect();
        const offset = event.clientY - bounding.top;
        if (offset > bounding.height / 2) {
            target.after(draggedTask);
        } else {
            target.before(draggedTask);
        }
    }
}

function handleDrop(event) {
    event.preventDefault(); // Prevent default behavior
}

function handleDragEnd(event) {
    event.target.style.opacity = ""; // Reset the opacity
    event.target.style.transform = ""; // Reset the scale
    draggedTask = null; // Clear the dragged task
    document.querySelectorAll(".dragging").forEach((el) => el.classList.remove("dragging"));
}




function navigateTasks(event) {
    const tasks = Array.from(document.querySelectorAll('#task-list li'));
    if (tasks.length === 0) return;

    const currentIndex = tasks.findIndex((task) => task === document.activeElement);
    if (event.key === 'ArrowDown') tasks[(currentIndex + 1) % tasks.length]?.focus();
    else if (event.key === 'ArrowUp') tasks[(currentIndex - 1 + tasks.length) % tasks.length]?.focus();
}

document.addEventListener('keydown', (event) => {
    if (event.target.tagName === 'LI') navigateTasks(event);
});

// Add task listeners
addTaskButton.addEventListener('click', addTask);
taskInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') addTask();
});

// Initialize
tabs.forEach((tab) => tab.addEventListener('click', () => switchTab(tab)));
startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);
plus10Button.addEventListener('click', () => adjustTime(10));
minus10Button.addEventListener('click', () => adjustTime(-10));
switchTab(document.getElementById('work-tab'));


//CREATING CUSTOM COLORS
