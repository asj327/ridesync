const API_BASE_URL = 'http://127.0.0.1:8000';

// 🛡️ HACKATHON SAFETY NET: Pre-defined Kochi Coordinates
// This guarantees your live demo works instantly, even without Wi-Fi!
const KOCHI_LOCATIONS = {
    "infopark": { lat: 10.0088, lng: 76.3600 },
    "kakkanad": { lat: 10.0261, lng: 76.3323 },
    "cusat": { lat: 10.0436, lng: 76.3244 },
    "lulu mall": { lat: 10.0274, lng: 76.3080 },
    "kalamassery": { lat: 10.0465, lng: 76.3182 }
};

async function getCoordinates(destinationName) {
    const searchKey = destinationName.toLowerCase().trim();
    
    // 1. Check our safety net first
    if (KOCHI_LOCATIONS[searchKey]) {
        console.log(`⚡ Using fast local coordinates for: ${destinationName}`);
        return KOCHI_LOCATIONS[searchKey];
    }

    // 2. If not found locally, try the live Geocoding API
    console.log(`🌍 Live Geocoding: ${destinationName}...`);
    const query = encodeURIComponent(`${destinationName}, Kochi, Kerala`);
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`;

    try {
        const response = await fetch(url, { headers: { 'User-Agent': 'RideSync-Hackathon' } });
        const data = await response.json();
        
        if (data && data.length > 0) {
            return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
        } else {
            throw new Error("Location not found. Try 'InfoPark' or 'CUSAT'.");
        }
    } catch (error) {
        console.error("Geocoding failed:", error);
        throw error;
    }
}

/**
 * Sends the user's real coordinates to the FastAPI backend.
 */
async function findPoolMatch(stationId, destinationText) {
    try {
        // 1. Convert the text (e.g., "InfoPark") into real coordinates
        const coords = await getCoordinates(destinationText);

        // 2. Generate a random User ID for the demo 
        // (So we can simulate multiple different people joining the database)
        const randomUserId = "user_" + Math.floor(Math.random() * 10000);

        // 3. Build the payload for FastAPI
        const payload = {
            user_id: randomUserId,
            station_id: stationId.toLowerCase(),
            dest_lat: coords.lat,
            dest_lng: coords.lng
        };

        console.log("📡 Sending real payload to backend:", payload);

        // 4. Send to our Python SQLite database
        const response = await fetch(`${API_BASE_URL}/api/request-pool`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json' 
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }

        const data = await response.json();
        console.log("📥 Received response from backend:", data);
        return data;

    } catch (error) {
        console.error("❌ API Pipeline Failed:", error);
        
        // Return a clean error object to the frontend UI
        return { 
            status: "error", 
            message: error.message || "Could not connect to server." 
        };
    }
}