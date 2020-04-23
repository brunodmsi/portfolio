import React from 'react';
import * as Yup from 'yup';
import { Form, Input, Textarea } from '@rocketseat/unform';

import OutlineItem from '../../components/OutlineItem';
import PrettyJSON from '../../components/PrettyJSON';
import contactJSON from '../../json/contact.json';

import { Container, ContactArea } from './styles';

const schema = Yup.object().shape({
  name: Yup.string().required('Name is a required field'),
  email: Yup.string().required('E-mail is a required field'),
  message: Yup.string()
    .min(10, 'You need to insert a minimum of 10 characters')
    .required('You need to insert a message'),
});

const Contact: React.FC = () => {
  function handleSubmit(data: object): void {
    console.log(data);
  }

  return (
    <Container>
      <ContactArea>
        <OutlineItem
          outline={{ color: '#ec1839' }}
          textColor="#fefefe"
          size={70}
        >
          Contact me
        </OutlineItem>
        <p>
          Here, you can contact me with doubts about what I used to do this
          project, or about freelancing, or about anything really.
        </p>

        <Form onSubmit={handleSubmit} schema={schema}>
          <Input name="name" placeholder="Your name" />
          <Input name="email" placeholder="Your e-mail" />
          <Textarea name="message" placeholder="Your message" />

          <button type="submit">Send message</button>
        </Form>
      </ContactArea>

      <PrettyJSON
        jsonObject={contactJSON}
        colors={{
          punctuation: '#fff',
          key: '#a3fff3',
          value: '#49cabe',
          string: '#49caeb',
        }}
      />
    </Container>
  );
};

export default Contact;
