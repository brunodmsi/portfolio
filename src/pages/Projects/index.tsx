import React from 'react';

import OutlineItem from '../../components/OutlineItem';

import { Container, Github } from './styles';

const Projects: React.FC = () => {
  function handleSubmit(data: object): void {
    console.log(data);
  }

  return (
    <Container>
      <Github>
        <header>
          <OutlineItem outline={{ color: '#ec1839' }} textColor="#fff">
            github projects
          </OutlineItem>
        </header>
      </Github>
    </Container>
  );
};

export default Projects;
