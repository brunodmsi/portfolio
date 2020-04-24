import React from 'react';
import { Link } from 'react-router-dom';
import PrettyJSON from 'react-prettify-json';

import OutlineItem from '../../components/OutlineItem';
import homeJSON from '../../json/home.json';

import { Container, Introduction } from './styles';

const Home: React.FC = () => {
  return (
    <Container>
      <Introduction>
        <code>&lt;/&gt;</code>

        <h1>Hi, I&apos;m</h1>

        <OutlineItem
          outline={{ color: '#ec1839' }}
          textColor="#fefefe"
          size={70}
        >
          Bruno De Masi
        </OutlineItem>

        <h3>Full Stack developer</h3>
        <span>Working mainly with JavaScript technologies.</span>

        <Link to="/contact">Contact me</Link>
      </Introduction>

      <PrettyJSON
        jsonObject={homeJSON}
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

export default Home;
