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

export interface IKeyValueObject {
  [key: string]: IMessage[];
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
      .then((msgs: IMessage[]) => {
        const messagesByLocation: IKeyValueObject = {};
        msgs.map((message) => {
          if (!messagesByLocation[`${message.longitude}:${message.latitude}`]) {
            messagesByLocation[`${message.longitude}:${message.latitude}`] = [];
          }
          messagesByLocation[`${message.longitude}:${message.latitude}`].push(message);
        });
        setMessages(messagesByLocation);
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
            {Object.keys(messages).map((key) => {
              const coord = key.split(':');
              return (
                <CustomMarker
                  key={key}
                  coords={{ lat: +coord[1], lng: +coord[0] }}
                  iconUrl="/img/map-marker-red.png"
                >
                  <div className="messages-wrapper">
                    {messages[key].map((message) => (
                      <div className="single-message">
                        <u><em>{message.name}</em></u>: {message.message}
                      </div>
                    ))}
                  </div>
                </CustomMarker>
              )
            })}
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
