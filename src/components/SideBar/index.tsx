import React from 'react';
import { Link } from 'react-router-dom';

import {
  FaHome,
  FaCode,
  FaUser,
  FaEnvelope,
  FaGithub,
  FaLinkedinIn,
  FaFacebook,
} from 'react-icons/fa';

import OutlineItem from '../OutlineItem';
import Tooltip from '../Tooltip';

import { Wrapper } from './styles';

const SideBar: React.FC = () => {
  return (
    <Wrapper>
      <OutlineItem
        outline={{
          color: '#ec1839',
        }}
        textColor="#fefefe"
        clickable={{
          cursor: true,
          goTo: '/',
        }}
      >
        B
      </OutlineItem>

      <section>
        <Tooltip
          tooltipText="Home"
          colors={{
            background: '#333',
            font: '#E086D3',
          }}
        >
          <Link to="/">
            <FaHome size={28} />
          </Link>
        </Tooltip>
        <Tooltip
          tooltipText="Projects"
          colors={{
            background: '#333',
            font: '#E086D3',
          }}
        >
          <Link to="/">
            <FaCode size={28} />
          </Link>
        </Tooltip>
        <Tooltip
          tooltipText="About me"
          colors={{
            background: '#333',
            font: '#E086D3',
          }}
        >
          <Link to="/about">
            <FaUser size={28} />
          </Link>
        </Tooltip>
        <Tooltip
          tooltipText="Contact"
          colors={{
            background: '#333',
            font: '#E086D3',
          }}
        >
          <Link to="/contact">
            <FaEnvelope size={28} />
          </Link>
        </Tooltip>
      </section>

      <footer>
        <Tooltip
          colors={{
            background: '#333',
            font: '#E086D3',
          }}
          tooltipText="Github"
          size="small"
        >
          <a href="https://github.com/brunodmsi">
            <FaGithub size={20} />
          </a>
        </Tooltip>

        <Tooltip
          colors={{
            background: '#333',
            font: '#E086D3',
          }}
          tooltipText="Linkedin"
          size="small"
        >
          <a href="https://linkedin.com/in/brunodemasi">
            <FaLinkedinIn size={20} />
          </a>
        </Tooltip>

        <Tooltip
          colors={{
            background: '#333',
            font: '#E086D3',
          }}
          tooltipText="Facebook"
          size="small"
        >
          <a href="https://facebook.com/brunodmsi">
            <FaFacebook size={20} />
          </a>
        </Tooltip>
      </footer>
    </Wrapper>
  );
};

export default SideBar;
