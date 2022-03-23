import React from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import './App.sass';

const position = [51.505, -0.09]

function App() {
  return (
    <div className="App">
      <h1>Hello world! 🗺</h1>
      <MapContainer className="map" center={position} zoom={13}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default App;
