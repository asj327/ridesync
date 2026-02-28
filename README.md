<p align="center">
  <img src="./img.png" alt="Ridesync" width="100%">
</p>

# RideSync 🎯

## Basic Details

### Team Name: Hoverers

### Team Members
- Member 1: Anna Sara Joji - Model Engineering College
 

### Hosted Project Link
 https://ridesync-kq1e.vercel.app/

### Project Description
 RideSync is a hyper-local ride-sharing coordinator designed to solve the "Last Mile" connectivity gap at Kochi Metro stations. It intelligently groups passengers heading from the same station to the same destination zone, reducing individual travel costs by up to 60%.

Key Features
Proximity-Based Matching: Uses the Haversine Formula to group users based on destination coordinates, not just text strings.

Hackathon Safety Net: Integrated local coordinate fallback for Kochi landmarks (InfoPark, CUSAT, etc.) to ensure 100% uptime during demos.

Real-Time Persistence: Powered by a FastAPI + SQLite backend to maintain a live queue of waiting passengers.

In-App Coordination: Integrated lightweight chat system for matched pools to coordinate meeting points (e.g., "Meet at Pillar 42").

### The Problem statement
The Core Problem: The "Last Mile" Financial & Logistical Friction
While the Kochi Metro is efficient, the journey from the Metro Station to the final destination (InfoPark, CUSAT, Kakkanad) is broken.

The Price Gap: A Metro ticket might cost ₹30, but the short auto-rickshaw or taxi ride for the final 3km can cost ₹100–₹150. This makes the total commute expensive and unsustainable for daily workers and students.

The Information Silo: At any given moment at a station like Edapally, there are likely 10 people all heading to InfoPark. However, because they don't know each other, they take 10 separate vehicles, causing:

Higher Costs: No one to split the fare with.

Traffic Congestion: 10 vehicles on the road instead of 3 or 4.

Environmental Impact: Increased carbon footprint per passenger.

The "Safety & Trust" Barrier: Randomly asking strangers at a station to share a ride is awkward, socially difficult, and perceived as unsafe.

### The Solution
**RideSync acts as the Digital Coordinator. It removes the social awkwardness of "asking to share" by automating the matching process through a secure, coordinate-based algorithm.
RideSync solves this 'Last Mile' friction. By using our proximity-matching engine, we turn those 10 expensive, individual rides into 3 affordable, shared pools—saving users 60%
on their commute while reducing the number of vehicles on Kochi's congested roads.**
---

## Technical Details

### Technologies/Components Used

**For Software:**
 
Frontend: Vanilla JavaScript, HTML5, CSS3 (Mobile-First)
Backend: Python 3.12+, FastAPI (Asynchronous)
Database: SQLite (SQLAlchemy ORM)
APIs: OpenStreetMap (Nominatim) for Geocoding

 
## Features
1. Proximity-Based Matching
Uses the Haversine formula to group passengers based on destination coordinates within a 5km radius, not just names.

2. Landmark Safety Net
Pre-loaded coordinates for Kochi hubs (InfoPark, CUSAT) ensure instant, "zero-lag" matching even if external Map APIs fail.

3. Persistent Queue Engine
A FastAPI and SQLite backend maintains a live waiting list, allowing the system to match users who join at different times.

4. Unique Pool Identifiers
Instantly generates a shared Pool Code (e.g., #KCH-7F21) for matched users to identify their group at the station.
---


## Project Documentation

### For Software:

#### Screenshots (Add at least 3)

 destination and location
 (https://drive.google.com/file/d/1Q00UNB7f09NkEVg7d9XdmuGW1178QSog/view?usp=drive_link)

 waiting page
 https://drive.google.com/file/d/1xJvNkP6dQZuaLLpnSRBp7ixVROhBAOIV/view?usp=drive_link

matched with co-passengers
 https://drive.google.com/file/d/1xwqOHLlOGpruBNnq24db4DhX5KuoiwRy/view?usp=drive_link
 https://drive.google.com/file/d/1_LQtSVN9-F3-SbPI_Em2osx7boQ7BQJJ/view?usp=drive_link
 
#### Diagrams

**System Architecture:**

![Architecture Diagram](docs/architecture.png)
*Explain your system architecture - components, data flow, tech stack interaction*

**Application Workflow:**

![Workflow](docs/workflow.png)
*Add caption explaining your workflow*

---
## License

This project is licensed under the [LICENSE_NAME] License - see the [LICENSE](LICENSE) file for details.

 

