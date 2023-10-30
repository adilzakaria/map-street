import { MapContainer, TileLayer, CircleMarker, useMapEvents, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useState, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet-polylinedecorator';

function MapComponent() {
    // Set the initial map center to Malang, Indonesia
    const position = [-7.98, 112.63]
    const zoom = 13

    // State to hold the markers
    const [markers, setMarkers] = useState([]);

    // State to hold the lines
    const [lines, setLines] = useState([]);

    // State to hold the marker to connect
    const [markerToConnect, setMarkerToConnect] = useState(null);

    // Function to add a new marker
    const addMarker = (position) => {
        const newMarkers = [...markers, position];
        setMarkers(newMarkers);
    }

    // Function to remove a marker
    const removeMarker = (markerToRemove) => {
        const newMarkers = markers.filter(marker => marker !== markerToRemove);
        setMarkers(newMarkers);

        // Also remove any lines that start or end at the removed marker
        const newLines = lines.filter(line => !line.includes(markerToRemove));
        setLines(newLines);
    }

    // Function to start connecting markers
    const startConnecting = (marker) => {
        setMarkerToConnect(marker);
    }

    // Function to finish connecting markers
    const finishConnecting = (marker) => {
        if (markerToConnect) {
            setLines([...lines, [markerToConnect, marker]]);
            setMarkerToConnect(null);
        }
    }

    return (
        <MapContainer center={position} zoom={zoom} style={{ height: "100vh", width: "100%" }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            <MapEvents addMarker={addMarker} />
            {markers.map((position, idx) => 
                <CircleMarker center={position} radius={5} key={idx} pathOptions={{ color: markerToConnect === position ? 'red' : 'blue' }} eventHandlers={{ click: () => { finishConnecting(position) } }}>
                    <Popup>
                        <button onClick={() => removeMarker(position)}>Delete</button>
                        <button onClick={() => startConnecting(position)}>Connect</button>
                    </Popup>
                </CircleMarker>
            )}
            <ArrowDecorator lines={lines} />
        </MapContainer>
    )
}

function MapEvents({ addMarker }) {
    useMapEvents({
        mousemove: (e) => {
            window.currentMousePos = e.latlng;
        },
        keydown: (e) => {
            if (e.originalEvent.key === 'm') {
                addMarker(window.currentMousePos);
            }
        }
    });

    return null;
}

function ArrowDecorator({ lines }) {
    const map = useMap();

    useEffect(() => {
        // Remove all existing polylines and decorators
        map.eachLayer((layer) => {
            if (layer instanceof L.Polyline || layer instanceof L.PolylineDecorator) {
                map.removeLayer(layer);
            }
        });

        // Add new polylines and decorators
        lines.forEach((line) => {
            const polyline = L.polyline(line, {color: 'blue'}).addTo(map);
            L.polylineDecorator(polyline, {
                patterns: [
                    {offset: '100%', repeat: 0, symbol: L.Symbol.arrowHead({pixelSize: 15, polygon: false, pathOptions: {stroke: true}})}
                ]
            }).addTo(map);
        });
    }, [lines, map]);

    return null;
}

export default MapComponent
