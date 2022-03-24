import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Icon, Marker as LeafletMarker } from 'leaflet';
import { Marker, Popup } from 'react-leaflet';
import { ICoords } from '../../interfaces';
import { MarkerIcon } from '../icons';

interface IDraggableMarkerProps {
  coords: ICoords;
  setCoords: (x: ICoords) => void;
}

export const DraggableMarker = ({ coords, setCoords }: IDraggableMarkerProps) => {
  const [ draggable, setDraggable ] = useState(false);
  const markerRef = useRef<LeafletMarker>(null);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          setCoords(marker.getLatLng());
        }
      },
    }),
    [],
  );
  const toggleDraggable = useCallback(() => {
    setDraggable((d) => !d);
  }, []);

  return (
    <Marker
      draggable={draggable}
      eventHandlers={eventHandlers}
      position={coords}
      ref={markerRef}
      icon={new Icon({ iconUrl: MarkerIcon })}
    >
      <Popup minWidth={90}>
        <span onClick={toggleDraggable}>
          {draggable
            ? 'Marker is draggable'
            : 'Click here to make marker draggable'}
        </span>
      </Popup>
    </Marker>
  );
}