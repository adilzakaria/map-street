import React from 'react';
import MapComponent from './components/MapComponent'; // adjust the path according to your file structure
import './App.css'; // make sure to create this file
import DarkMode from './components/DarkMode/DarkMode';


function App() {
  return (
    <div className="App">
      <h1 className="title">Hole Detection Map</h1>
      <DarkMode />
      <div className="map-container">
        <MapComponent />
      </div>
    </div>
  );
}

export default App;