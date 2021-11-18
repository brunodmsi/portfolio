import React from 'react';
import Tooltip from 'little-react-tooltip';

import OutlineItem from '../../components/OutlineItem';

import { Container, AboutArea, SkillsArea } from './styles';
import brunoImg from '../../assets/bruno.jpeg';
import reactImg from '../../assets/react.png';
import nodeImg from '../../assets/nodejs.png';
import digitalImg from '../../assets/digitalocean.png';
import pythonImg from '../../assets/python.png';
import postgresImg from '../../assets/postgres.png';
import laravelImg from '../../assets/laravel.png';

const usedTechnology = [
  {
    name: 'Digital Ocean',
    imgPath: digitalImg,
  },
  {
    name: 'Node.js',
    imgPath: nodeImg,
  },
  {
    name: 'Laravel',
    imgPath: laravelImg,
  },
  {
    name: 'Python',
    imgPath: pythonImg,
  },
  {
    name: 'Postgres',
    imgPath: postgresImg,
  },
  {
    name: 'React.js',
    imgPath: reactImg,
  },
];

const About: React.FC = () => {
  return (
    <Container>
      <AboutArea>
        <OutlineItem outline={{ color: '#ec1839' }} textColor="#fff" size={70}>
          About me
        </OutlineItem>

        <img src={brunoImg} alt="Bruno De Masi" />

        <p>
          In 2017, I started my degree in Computer Science with no actual
          intentions of loving it, but I did. Coding is what I have been doing
          since that year, and I don't pretend to stop. The idea of writing some
          lines of code and seeing it transform into different responses and in
          different shapes and forms on my screen got me obsessed. The
          never-ending puzzles and practical problems to solve keeps my mind
          working 24/7, always thinking on how to improve an existing code, or
          on what I should work on to improve myself as a coder.
        </p>

        <p>
          In the past few years, I did the following things: created Android and
          iOS apps; developed Web Applications; APIs; micro-services; deployed
          Linux servers; made tools to improve my workflow; scraped pages on the
          web; deployed multiple apps (although they didn't worked out in the
          end haha). To me it doesn't look like a lot, despite it being... I
          guess it is just that part of my mind scratching to do and learn more.
        </p>

        <p>
          Skills/Interests: JavaScript, Node, React, Redux, Webpack/Babel, HTML,
          CSS, Git, Gitlab, PostgreSQL, TDD, Docker, nginx, UI/UX, Laravel, PHP,
          Python.
        </p>
      </AboutArea>

      <SkillsArea>
        <h1>used in a daily basis</h1>

        <section>
          {usedTechnology.map(tech => (
            <Tooltip
              tooltipText={tech.name}
              position="bottom"
              colors={{
                background: '#1e242c',
                font: '#fefefe',
              }}
            >
              <img src={tech.imgPath} alt="Node.js" />
            </Tooltip>
          ))}
        </section>
      </SkillsArea>
    </Container>
  );
};

export default About;
