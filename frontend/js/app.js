console.log("✅ app.js loaded successfully!");

// --- 1. DOM Elements ---
const screenStationSelect = document.getElementById('screen-station-select');
const screenWaitingRoom = document.getElementById('screen-waiting-room');
const screenMatchSuccess = document.getElementById('screen-match-success');

const btnFindPool = document.getElementById('btn-find-pool');
const btnCancelSearch = document.getElementById('btn-cancel-search');
const btnFinishRide = document.getElementById('btn-finish-ride');

const waitTimerDisplay = document.getElementById('wait-timer');
const userStatusDisplay = document.getElementById('user-status');
const destinationInput = document.getElementById('destination');
const stationSelect = document.getElementById('metro-station');

let timerInterval;
let secondsWaiting = 0;

// --- 2. Screen Navigation Logic ---
function showScreen(screenToShow) {
    screenStationSelect.classList.remove('active');
    screenStationSelect.classList.add('hidden');
    
    screenWaitingRoom.classList.remove('active');
    screenWaitingRoom.classList.add('hidden');
    
    screenMatchSuccess.classList.remove('active');
    screenMatchSuccess.classList.add('hidden');

    screenToShow.classList.remove('hidden');
    screenToShow.classList.add('active');
}

// --- 3. Timer Logic ---
function updateTimerDisplay() {
    const minutes = String(Math.floor(secondsWaiting / 60)).padStart(2, '0');
    const seconds = String(secondsWaiting % 60).padStart(2, '0');
    waitTimerDisplay.textContent = `${minutes}:${seconds}`;
}

function startTimer() {
    secondsWaiting = 0;
    updateTimerDisplay();
    timerInterval = setInterval(() => {
        secondsWaiting++;
        updateTimerDisplay();
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

// --- 4. Event Listeners ---

// Notice the 'async' keyword added here!
btnFindPool.addEventListener('click', async () => {
    const destValue = destinationInput.value.trim();
    const stationId = stationSelect.value;

    if (destValue === '') {
        alert('Please enter a drop-off location!');
        return;
    }

    // 1. Show the radar waiting screen
    userStatusDisplay.textContent = 'Searching for co-passengers...';
    showScreen(screenWaitingRoom);
    startTimer();

    try {
        // 2. Make the REAL call to the Python FastAPI backend
        // (This uses the function we defined in api.js)
        const matchData = await findPoolMatch(stationId, destValue);

        // 3. HACKATHON TRICK: Pause for 2.5 seconds so judges see the UI animation
        await new Promise(resolve => setTimeout(resolve, 2500));
        
        stopTimer();

        // 4. Handle the Python server's response
        if (matchData && matchData.status === "matched") {
            console.log("🎉 Real match found via backend!");
            
            // Inject the dynamic pool code from the Python server into the HTML
            document.querySelector('.highlight').textContent = matchData.pool_code;
            
            userStatusDisplay.textContent = 'Match Found! Meet your pool.';
            showScreen(screenMatchSuccess);
            
            // Render the Leaflet Map
            if (typeof renderMap === 'function') {
                renderMap();
            }
        } else {
            // If the backend returns "waiting" (e.g., you picked Aluva instead of Edapally)
            userStatusDisplay.textContent = 'Still scanning the station...';
            // We leave them on the radar screen in this case
        }

    } catch (error) {
        console.error("Frontend caught an error:", error);
        stopTimer();
        alert("Could not connect to the backend. Is Uvicorn running?");
        userStatusDisplay.textContent = 'Ready to share your ride.';
        showScreen(screenStationSelect);
    }
});

btnCancelSearch.addEventListener('click', () => {
    stopTimer();
    userStatusDisplay.textContent = 'Ready to share your ride.';
    showScreen(screenStationSelect);
});

btnFinishRide.addEventListener('click', () => {
    destinationInput.value = '';
    userStatusDisplay.textContent = 'Ready to share your ride.';
    showScreen(screenStationSelect);
});