/**
 * map.js
 * Renders the interactive map showing the Metro Station and drop-off points.
 */

let mapInstance = null; // Keeps track of the map so we don't duplicate it

function renderMap() {
    console.log("🗺️ Rendering the route map...");
    
    const mapContainer = document.getElementById('route-map');
    
    // If a map already exists from a previous demo run, remove it to start fresh
    if (mapInstance !== null) {
        mapInstance.remove();
    }

    // 1. Coordinates for the Kochi demo
    const edapallyStation = [10.0261, 76.3084]; // Edapally Metro
    
    // Dummy drop-off points simulating a shared auto heading towards Kakkanad/InfoPark
    const drop1 = [10.0210, 76.3180]; // Passenger B
    const drop2 = [10.0150, 76.3250]; // YOU
    const drop3 = [10.0080, 76.3350]; // Passenger C

    // 2. Initialize the map inside our div, zoomed in on Edapally
    mapInstance = L.map('route-map', {
        zoomControl: false // Hides the +/- buttons for a cleaner UI
    }).setView(edapallyStation, 14);

    // 3. Add the free OpenStreetMap dark-themed tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap contributors, © CARTO',
        maxZoom: 19
    }).addTo(mapInstance);

    // 4. Create custom markers (Optional: you can replace these with custom icons later)
    L.marker(edapallyStation).addTo(mapInstance)
        .bindPopup("<b>📍 Start:</b> Edapally Auto Stand").openPopup();
    
    L.marker(drop1).addTo(mapInstance).bindPopup("Drop 1 (₹25)");
    L.marker(drop2).addTo(mapInstance).bindPopup("<b>You</b> (Drop 2 - ₹35)");
    L.marker(drop3).addTo(mapInstance).bindPopup("Drop 3 (₹45)");

    // 5. Draw the shared auto route connecting the points
    const routeCoords = [edapallyStation, drop1, drop2, drop3];
    const routeLine = L.polyline(routeCoords, {
        color: '#3b82f6', // Matches your primary blue theme
        weight: 4,
        dashArray: '10, 10' // Makes it a dashed line to indicate a planned route
    }).addTo(mapInstance);

    // 6. Automatically zoom the map so all points fit perfectly on the screen
    mapInstance.fitBounds(routeLine.getBounds(), { padding: [30, 30] });

    // 7. THE HACKATHON LIFESAVER: 
    // Maps often render as a grey box if they are drawn while hidden (display: none).
    // This forces the map to recalculate its size right after the screen transitions.
    setTimeout(() => {
        mapInstance.invalidateSize();
    }, 200);
}