import React from 'react';

import OutlineItem from '../../components/OutlineItem';

import { Container, ProjectArea } from './styles';

import buggyImg from '../../assets/buggy.png';
import diacImg from '../../assets/diac.png';
import lurisImg from '../../assets/luris.png';
import softamostraImg from '../../assets/softamostra.png';
import anatogameImg from '../../assets/anatogame.png';
import scientImg from '../../assets/scient.png';

type MyProjectsType = {
  name: string;
  description: string;
  imgPath: string | undefined;
  url: string | undefined;
};

const myProjects: MyProjectsType[] = [
  {
    name: 'Buggy',
    imgPath: buggyImg,
    description:
      'Buggy offers a great interface for bug management of your projects. Use a management tool in Kanban format to interact with your team on the adjustments that need to be made. Also track bugs on your own apps using our BuggyListener.',
    url: undefined,
  },
  {
    name: 'Dia C',
    imgPath: diacImg,
    description:
      'Created to help university students decide their next steps, more than a vocational fair, "Dia C" is a festival, with the objective of getting to know Cesupa, exploring our laboratories, discovering our extension projects and experiencing the day-to-day of our courses of graduation.',
    url: undefined,
  },
  {
    name: 'Luris',
    imgPath: lurisImg,
    description:
      'Application for mobile devices targeting the physically and visually impaired. He proposes the idea of locating access ramps (for the physically handicapped) and tactile pavements on the sidewalk (for the visually impaired) so that they have the knowledge of where these aids exist, especially as it is very inconsistent in many cities their presence.',
    url: undefined,
  },
  {
    name: 'SoftAmostra',
    imgPath: softamostraImg,
    description:
      'In times of pandemic, digital solutions were needed for face-to-face events. The SoftAmostra portal brings together a Digital Sample of the technological projects of undergraduates in the Bachelor of Computer Science course at CESUPA for "Computação Amostra", which is an event to showcase the projects produced by these students.',
    url: undefined,
  },
  {
    name: 'AnatoGame',
    imgPath: anatogameImg,
    description:
      'Project directed to students of Medicine. Gamification of the Human Anatomy study, play in a room against other medicine students to score the most points. Get to learn more and more about the subjects, and even use it on your free time as a self-study mechanism.',
    url: undefined,
  },
  {
    name: 'Scient',
    imgPath: scientImg,
    description:
      'The new members of bank accounts, find themselves in a sea of possibilities, and in the midst of this they end up not having the best decision to choose, in which they can have the greatest benefit and the lowest operating cost. This project is focused on helping them to create an account at any bank with the greatest ease and indicate a list of the best banks for them, and they can even use our application to travel and find new local banks to use.',
    url: undefined,
  },
];

const Projects: React.FC = () => {
  return (
    <Container>
      <ProjectArea>
        <header>
          <OutlineItem outline={{ color: '#ec1839' }} textColor="#fff">
            my projects
          </OutlineItem>
        </header>

        <section>
          {myProjects.map(project => (
            <div className="project">
              <div className="project-header">
                {project.imgPath && (
                  <img src={project.imgPath} alt={project.name} />
                )}
                <h3>{project.name}</h3>
              </div>

              <p>{project.description}</p>

              {project.url && <a href={project.url}>Acesse aqui</a>}
            </div>
          ))}
        </section>
      </ProjectArea>
    </Container>
  );
};

export default Projects;
