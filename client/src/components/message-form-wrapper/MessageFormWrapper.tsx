import React, { FC, ReactElement } from 'react';
import { Card, CardText, CardTitle } from 'reactstrap';
import './MessageFormWrapper.sass';
import { CommentForm } from '../comment-form';

export interface IMessageFormWrapper {
  waitLocation?: boolean;
}

export const MessageFormWrapper: FC<IMessageFormWrapper> = ({ waitLocation }): ReactElement => {
  return (
    <Card body className="message-form-wrapper">
      <CardTitle tag="h5" className="text-center">Welcome to StreetMap guestbook!</CardTitle>
      <CardText className="text-center">Leave a message with your location!</CardText>
      <CardText className="text-center">Thanks for stopping by!</CardText>
      <CommentForm waitLocation={waitLocation}/>
    </Card>
  );
};

MessageFormWrapper.defaultProps = {
  waitLocation: true,
};
