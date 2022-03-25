import { FC, ReactElement, useCallback, useEffect, useState } from 'react';
import { Button, Form, FormGroup, Input, Label, Spinner } from 'reactstrap';
import './CommentForm.sass';
import { messageSchema } from './schema';
import { ICoords } from '../../interfaces';
import { toast, Toaster } from 'react-hot-toast';

export interface ICommentFormProps {
  waitLocation?: boolean;
  coords: ICoords;
  children?: never;
}

export const CommentForm: FC<ICommentFormProps> = ({ waitLocation, coords }): ReactElement => {
  const [ name, setName ] = useState('');
  const [ message, setMessage ] = useState('');
  const [ disabled, setDisabled ] = useState(true);
  const [ loading, setLoading ] = useState(false);
  const [ success, setSuccess ] = useState(false);

  const isFormValid = useCallback(() => {
    const result = messageSchema.validate({ name, message });
    return !result.error && !waitLocation && !name && !message && !loading;
  }, [ waitLocation, name, message ]);

  useEffect(() => {
    setDisabled(isFormValid());
  }, [ waitLocation, name, message ]);

  const formSubmit = useCallback(async (event) => {
    event.preventDefault();
    console.log({ name, message });
    setDisabled(true);
    try {
      const userMessage = await messageSchema.validate({ name, message });
      console.log(userMessage);
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify({
          ...userMessage.value,
          longitude: coords.lng,
          latitude: coords.lat,
        }),
      });
      const result = await response.json();
      console.log(result);
      setName('');
      setMessage('');
      toast.success('Thank you for your message!');
      setSuccess(true);
    } catch (e: any) {
      toast.error(e?.message || 'Oops. Some error happened');
    } finally {
      setDisabled(false);
      setLoading(false);
    }
  }, [ name, message ]);

  const nameChangeHandler = useCallback((event) => {
    setName(event.target.value);
  }, []);

  const nameMessageHandler = useCallback((event) => {
    setMessage(event.target.value);
  }, []);

  return (
    <>
      {!success ? (
        <Form onSubmit={formSubmit} className="comment-form">
          {loading && (
            <div className="spinner-wrapper">
              <Spinner color="info">
                Loading...
              </Spinner>
            </div>
          )}
          <FormGroup disabled={waitLocation && loading}>
            <Label for="name">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Your name"
              type="text"
              value={name}
              onChange={nameChangeHandler}
            />
          </FormGroup>
          <FormGroup disabled={waitLocation && loading}>
            <Label for="message">Enter your message</Label>
            <Input
              id="message"
              name="message"
              type="textarea"
              placeholder="Enter a message"
              value={message}
              onChange={nameMessageHandler}
            />
          </FormGroup>
          <div className="text-right">
            <Button color="success" type="submit" disabled={disabled}>Send</Button>
          </div>
          <Toaster/>
        </Form>
      ) : (<div className="text-center">Thank you for sending message!</div>)}
    </>
  );
};

CommentForm.defaultProps = {
  waitLocation: true,
};
