import React, { ReactElement, useEffect, useState } from 'react';
import { MapContainer, TileLayer, MapConsumer } from 'react-leaflet';
import './App.sass';
import { ICoords } from './interfaces';
import { CustomMarker } from './components/custom-marker';
import { MessageFormWrapper } from './components/message-form-wrapper';
import { CommentForm } from './components/comment-form';

const center = {
  lat: 41.505,
  lng: -85.09,
};

export interface IMessage {
  name: string;
  message: string;
  latitude: number;
  longitude: number;
  date: Date;
  _id: string;
}

export const App = (): ReactElement => {
  const [ coords, setCoords ] = useState<ICoords>(center);
  const [ waitLocation, setWaitLocation ] = useState(true);
  const [ messages, setMessages ] = useState<IMessage[]>([]);

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
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/v1/messages`)
      .then((response) => response.json())
      .then((msgs) => {
        setMessages(msgs);
      });
  }, []);
  return (
    <div className="App">
      <MapContainer className="map" center={coords} zoom={4}>
        <MapConsumer>
          {(map) => {
            map.setView(coords, 9);
            return null;
          }}
        </MapConsumer>
        {waitLocation ? (<></>) : (
          <>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {messages.map((message) => (
              <CustomMarker
                key={message._id}
                coords={{ lat: message.latitude, lng: message.longitude }}
                iconUrl="/img/map-marker-red.png"
              >
                <div><em>{message.name}: {new Date(message.date).toLocaleString()}</em></div>
                <div>{message.message}</div>
              </CustomMarker>
            ))}
            <CustomMarker coords={coords}/>
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
