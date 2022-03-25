import React, { ReactElement, useEffect, useState } from 'react';
import { MapContainer, TileLayer, MapConsumer } from 'react-leaflet';
import './App.sass';
import { ICoords } from './interfaces';
import { DraggableMarker } from './components/draggable-marker';
import { MessageFormWrapper } from './components/message-form-wrapper';
import { CommentForm } from './components/comment-form';

const center = {
  lat: 41.505,
  lng: -85.09,
};

export const App = (): ReactElement => {
  const [ coords, setCoords ] = useState<ICoords>(center);
  const [ waitLocation, setWaitLocation ] = useState(true);
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setCoords({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });
      setWaitLocation(false);
    }, () => {
      fetch(`http://api.ipstack.com/check?access_key=${process.env.REACT_APP_LOCATION_API_ACCESS_TOKEN}`)
        .then(response => response.json())
        .then((data) => {
          setCoords({
            lat: data.latitude,
            lng: data.longitude,
          });
          setWaitLocation(false);
        })
        .catch(console.error);
    });
  }, []);
  return (
    <div className="App">
      <MapContainer className="map" center={coords} zoom={4}>
        <MapConsumer>
          {(map) => {
            map.setView(coords, 4);
            return null;
          }}
        </MapConsumer>
        {waitLocation ? (<></>) : (
          <>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <DraggableMarker coords={coords} setCoords={setCoords}/>
          </>
        )}
      </MapContainer>
      <MessageFormWrapper>
        <CommentForm waitLocation={waitLocation} coords={coords}/>
      </MessageFormWrapper>
    </div>
  );
};

export default App;
