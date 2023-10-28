import { MapContainer, TileLayer, CircleMarker, useMapEvents, Polyline} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useState } from 'react';

function MapComponent() {
    // Set the initial map center to Malang, Indonesia
    const position = [-7.98, 112.63]
    const zoom = 13

    // State to hold the markers
    const [markers, setMarkers] = useState([]);

    // State to hold polyline coordinates
    const [polyline, setPolyline] = useState([]);

    // State to hold the currently selected marker (for manual drawing)
    const [selectedMarker, setSelectedMarker] = useState(null);

    // Function to add a new marker
    const addMarker = (position) => {
        const newMarkers = [...markers, position];
        setMarkers(newMarkers);
    }

    // Function to clear all markers and polyline
    const clearMarkers = () => {
        setMarkers([]);
        setPolyline([]);
        setSelectedMarker(null);
    }

    // Function to remove a marker
    const removeMarker = (markerToRemove, index) => {
        const newMarkers = markers.filter((marker, idx) => idx !== index);
        setMarkers(newMarkers);

        // Update the polyline coordinates
        const newPolyline = [...polyline];
        newPolyline.splice(index, 1);
        setPolyline(newPolyline);
    }

    // Function to draw a line manually
    const drawLine = (position) => {
        if (selectedMarker) {
            const newPolyline = [...polyline, [selectedMarker, position]];
            setPolyline(newPolyline);
            setSelectedMarker(null);
        } else {
            setSelectedMarker(position);
        }
    }

    return (
        <MapContainer center={position} zoom={zoom} style={{ height: "100vh", width: "100%" }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            <MapEvents addMarker={addMarker} clearMarkers={clearMarkers} drawLine={drawLine} />
            {markers.map((position, idx) => 
                <CircleMarker center={position} radius={10} key={idx} eventHandlers={{ contextmenu: () => { removeMarker(position, idx) } }} />
            )}
            <Polyline positions={polyline} color="blue" />
        </MapContainer>
    )
}

function MapEvents({ addMarker, clearMarkers, drawLine }) {
    useMapEvents({
        mousemove: (e) => {
            window.currentMousePos = e.latlng;
        },
        keydown: (e) => {
            if (e.originalEvent.key === 'm') {
                addMarker(window.currentMousePos);
            } else if (e.originalEvent.key === 'h') {
                clearMarkers();
            }  else if (e.originalEvent.key === 'l') {
                drawLine(window.currentMousePos);
            }
        }
    });
    return null;
}

export default MapComponent;
