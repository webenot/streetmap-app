import React, { FC, ReactElement, ReactNode } from 'react';
import { Icon } from 'leaflet';
import { Marker, Popup } from 'react-leaflet';
import { ICoords } from '../../interfaces';
import { MarkerIcon } from '../icons';

interface ICustomMarkerProps {
  coords: ICoords;
  iconUrl?: string;
  children?: ReactNode;
}

export const CustomMarker: FC<ICustomMarkerProps> = ({
  coords,
  iconUrl,
  children,
}: ICustomMarkerProps): ReactElement => {
  return (
    <Marker
      position={coords}
      icon={new Icon({ iconUrl })}
    >
      <Popup minWidth={90}>
        {children}
      </Popup>
    </Marker>
  );
};

CustomMarker.defaultProps = {
  iconUrl: MarkerIcon,
  children: <span>Your current position! Please, leave your message</span>,
};