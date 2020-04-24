import React from 'react';

import OutlineItem from '../../components/OutlineItem';

import { Container, ContactArea } from './styles';

const About: React.FC = () => {
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
          About me
        </OutlineItem>
        <p>
          Here, you can contact me with doubts about what I used to do this
          project, or about freelancing, or about anything really.
        </p>
      </ContactArea>
    </Container>
  );
};

export default About;
