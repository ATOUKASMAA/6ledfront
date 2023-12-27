// src/App.js

import React, { useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './App.css';

const App = () => {
  const [buttonColor, setButtonColor] = useState('green');
  const [ledState, setLedState] = useState('on');
  const [visiblePanels, setVisiblePanels] = useState([]);

  const handleMarkerClick = (index) => {
    setVisiblePanels((prevVisiblePanels) => {
      if (prevVisiblePanels.includes(index)) {
        return prevVisiblePanels.filter((item) => item !== index);
      } else {
        return [...prevVisiblePanels, index];
      }
    });
  };

  const handleClick = async () => {
    try {
      const newLedState = ledState === 'on' ? 'off' : 'on';
      const response = await axios.get(`http://localhost:3000/led/${newLedState}`);

      if (response.status === 200) {
        console.log(`LED turned ${newLedState}`);
        setLedState(newLedState);
        setButtonColor(newLedState === 'on' ? 'red' : 'green');
      } else {
        console.error(`Failed to turn ${newLedState} LED:`, response.statusText);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const MyMap = () => {
    const center = [34.0522, -118.2437];
    const zoom = 13;
    const MarkerCoords1 = [34.0523, -118.2438];
    const MarkerCoords2 = [34.0540, -118.2469];

    const customIcon1 = new L.Icon({
      iconUrl: 'trafficlight.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    return (
      <div className="map-container">
        <MapContainer center={center} zoom={zoom} style={{ height: '1000px', width: '1000px' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          <Marker
            position={MarkerCoords1}
            icon={customIcon1}
            interactive={true}
            eventHandlers={{ click: () => handleMarkerClick(0) }}
          >
            <Popup autoPan={false}>
              Marker 1<br />
            </Popup>
          </Marker>

          <Marker
            position={MarkerCoords2}
            icon={customIcon1}
            interactive={true}
            eventHandlers={{ click: () => handleMarkerClick(1) }}
          >
            <Popup autoPan={false}>
              Marker 2<br />
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    );
  };

  const Panel = () => {
    return (
      <div className="panel">
        <img
          src={ledState === 'on' ? 'led-on.gif' : 'led-off.png'}
          alt="LED"
          className="centered-image"
        />
        
      </div>
    );
  };

  const Pane2 = () => {
    return (
      <div className="panel">
        
        <img
          src={ledState === 'on' ? 'led-on-reverse.gif' : 'led-off.png'}
          alt="LED"
          className="centered-image"
        />
        
      </div>
    );
  };

  return (
    <div className="app-container">
      <h1 style={{ fontFamily: 'Arial', fontSize: '24px', marginTop: '20px', color: 'green' }}>Traffic light</h1>
      <div className="map-and-panels">
        <MyMap />
        <div className="panels">
          {visiblePanels.map((index) => (
            <React.Fragment key={index}>
              {index === 0 ? <Panel /> : <Pane2 />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
