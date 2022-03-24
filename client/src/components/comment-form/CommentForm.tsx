import { FC, ReactElement, useCallback, useEffect, useState } from 'react';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';

export interface ICommentFormProps {
  waitLocation?: boolean;
}

export const CommentForm: FC<ICommentFormProps> = ({ waitLocation }): ReactElement => {
  const [ name, setName ] = useState('');
  const [ message, setMessage ] = useState('');
  const [ disabled, setDisabled ] = useState(true);

  useEffect(() => {
    setDisabled(!waitLocation && !name && !message);
  }, [ waitLocation, name, message ]);

  const formSubmit = useCallback((event) => {
    event.preventDefault();
    setDisabled(true);
    console.log({ name, message });
    setName('');
    setMessage('');
    setDisabled(false);
  }, [ name, message ]);

  const nameChangeHandler = useCallback((event) => {
    setName(event.target.value);
  }, []);

  const nameMessageHandler = useCallback((event) => {
    setMessage(event.target.value);
  }, []);

  return (
    <Form onSubmit={formSubmit}>
      <FormGroup>
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
      <FormGroup>
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
    </Form>
  );
};

CommentForm.defaultProps = {
  waitLocation: true,
};
