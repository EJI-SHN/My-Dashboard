
// =====================================
// 1. PAGE NAVIGATION
// =====================================

function showPage(pageName) {
    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    document.getElementById(pageName).classList.add("active");
}


// =====================================
// 2. DIGITAL CLOCK
// =====================================

function updateClock() {
    const now = new Date();

    const time = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

    const date = now.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    document.getElementById("clockTime").textContent = time;
    document.getElementById("clockDate").textContent = date;

    document.getElementById("homeClock").textContent = time;
    document.getElementById("homeDate").textContent = date;
}

updateClock();
setInterval(updateClock, 1000);


// =====================================
// 3. TO-DO LIST
// =====================================

let tasks = JSON.parse(localStorage.getItem("myTasks") || "[]");

function saveTasks() {
    localStorage.setItem("myTasks", JSON.stringify(tasks));
}

function displayTasks() {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
        const li = document.createElement("li");

        if (task.completed) {
            li.classList.add("completed");
        }

        const span = document.createElement("span");
        span.textContent = task.text;

        const actions = document.createElement("div");
        actions.className = "task-actions";

        const doneButton = document.createElement("button");
        doneButton.textContent = task.completed ? "Undo" : "Done";
        doneButton.onclick = () => toggleTask(index);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.onclick = () => deleteTask(index);

        actions.append(doneButton, deleteButton);
        li.append(span, actions);
        taskList.appendChild(li);
    });
}

function addTask() {
    const input = document.getElementById("taskInput");
    const taskText = input.value.trim();

    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    tasks.push({
        text: taskText,
        completed: false
    });

    saveTasks();
    displayTasks();

    input.value = "";
}

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    displayTasks();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    displayTasks();
}

document.getElementById("taskInput").addEventListener("keydown", event => {
    if (event.key === "Enter") {
        addTask();
    }
});

displayTasks();


// =====================================
// 4. POMODORO TIMER
// =====================================

let timeLeft = 25 * 60;
let timerInterval = null;

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    document.getElementById("timerDisplay").textContent =
        String(minutes).padStart(2, "0") + ":" +
        String(seconds).padStart(2, "0");
}

function startTimer() {
    if (timerInterval !== null) return;

    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateTimerDisplay();
        } else {
            pauseTimer();
            alert("Time is up! Great job! ♡");
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

function resetTimer() {
    pauseTimer();
    timeLeft = 25 * 60;
    document.getElementById("timerMode").textContent = "Focus Time";
    updateTimerDisplay();
}

function setTimer(minutes, mode) {
    pauseTimer();
    timeLeft = minutes * 60;

    document.getElementById("timerMode").textContent = mode;
    updateTimerDisplay();
}

updateTimerDisplay();


// =====================================
// 5. MINI WEBCAM
// =====================================

let cameraStream = null;

async function startCamera() {
    const video = document.getElementById("video");

    try {
        if (!navigator.mediaDevices ||
            !navigator.mediaDevices.getUserMedia) {
            throw new Error("Camera access is unavailable. Use localhost or HTTPS.");
        }

        if (cameraStream) {
            stopCamera();
        }

        cameraStream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: "user"
            },
            audio: false
        });

        video.srcObject = cameraStream;
        await video.play();

    } catch (error) {
        alert("Unable to access your camera: " + error.message);
    }
}

function takePhoto() {
    const video = document.getElementById("video");
    const canvas = document.getElementById("canvas");
    const gallery = document.getElementById("gallery");

    if (!cameraStream || video.videoWidth === 0) {
        alert("Please start your camera first!");
        return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const photo = document.createElement("img");
    photo.src = canvas.toDataURL("image/png");
    photo.alt = "Captured photo";

    gallery.prepend(photo);
}

function stopCamera() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
    }

    document.getElementById("video").srcObject = null;
}
