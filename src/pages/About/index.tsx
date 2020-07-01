import React from 'react';
import { Link } from 'react-router-dom';
import Tooltip from 'little-react-tooltip';

import OutlineItem from '../../components/OutlineItem';

import { Container, AboutArea, SkillsArea } from './styles';
import brunoImg from '../../assets/bruno.jpeg';
import reactImg from '../../assets/react.png';
import nodeImg from '../../assets/nodejs.png';
import digitalImg from '../../assets/digitalocean.png';
import mongoImg from '../../assets/mongo.png';
import postgresImg from '../../assets/postgres.png';
import redisImg from '../../assets/redis.png';

const About: React.FC = () => {
  return (
    <Container>
      <AboutArea>
        <OutlineItem outline={{ color: '#ec1839' }} textColor="#fff" size={70}>
          About me
        </OutlineItem>

        <img src={brunoImg} alt="Bruno De Masi" />

        <p>
          Graduating in Computer Science since 2017, learning about everything
          that has about programming. I code and manage teams using the Agile
          Methodology, already acquired a lot of project, time and team
          management skills while effectively meeting milestones and deadlines.
        </p>

        <p>
          I work with a set of tools and programming languages, but as every
          developer I have a favorite, and mine is JavaScript. Using React and
          Node, I created a lot of projects for real use in my university, you
          can check out some of them at <Link to="/code">My Projects</Link>.
        </p>
      </AboutArea>

      <SkillsArea>
        <h1>used in a daily basis</h1>

        <section>
          <Tooltip
            tooltipText="React.js"
            position="bottom"
            colors={{
              background: '#1e242c',
              font: '#fefefe',
            }}
          >
            <img src={reactImg} alt="React.js" />
          </Tooltip>

          <Tooltip
            tooltipText="Node.js"
            position="bottom"
            colors={{
              background: '#1e242c',
              font: '#fefefe',
            }}
          >
            <img src={nodeImg} alt="Node.js" />
          </Tooltip>

          <Tooltip
            tooltipText="Postgres"
            position="bottom"
            colors={{
              background: '#1e242c',
              font: '#fefefe',
            }}
          >
            <img src={postgresImg} alt="Postgres" />
          </Tooltip>

          <Tooltip
            tooltipText="Redis"
            position="bottom"
            colors={{
              background: '#1e242c',
              font: '#fefefe',
            }}
          >
            <img src={redisImg} alt="Redis" />
          </Tooltip>

          <Tooltip
            tooltipText="Digital Ocean"
            position="bottom"
            colors={{
              background: '#1e242c',
              font: '#fefefe',
            }}
          >
            <img src={digitalImg} alt="Digital Ocean" />
          </Tooltip>

          <Tooltip
            tooltipText="MongoDB"
            position="bottom"
            colors={{
              background: '#1e242c',
              font: '#fefefe',
            }}
          >
            <img src={mongoImg} alt="MongoDB" />
          </Tooltip>
        </section>
      </SkillsArea>
    </Container>
  );
};

export default About;
