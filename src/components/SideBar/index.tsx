import React from 'react';
import { Link } from 'react-router-dom';
import Tooltip from 'little-react-tooltip';
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
        <Link to="/">
          <Tooltip
            tooltipText="Home"
            position="right"
            colors={{
              background: '#333',
              font: '#E086D3',
            }}
          >
            <FaHome size={28} />
          </Tooltip>
        </Link>

        <Link to="/code">
          <Tooltip
            tooltipText="Projects"
            position="right"
            colors={{
              background: '#333',
              font: '#E086D3',
            }}
          >
            <FaCode size={28} />
          </Tooltip>
        </Link>

        <Link to="/about">
          <Tooltip
            tooltipText="About me"
            position="right"
            colors={{
              background: '#333',
              font: '#E086D3',
            }}
          >
            <FaUser size={28} />
          </Tooltip>
        </Link>
        <Link to="/contact">
          <Tooltip
            tooltipText="Contact"
            position="right"
            colors={{
              background: '#333',
              font: '#E086D3',
            }}
          >
            <FaEnvelope size={28} />
          </Tooltip>
        </Link>
      </section>

      <footer>
        <a href="https://github.com/brunodmsi">
          <Tooltip
            colors={{
              background: '#333',
              font: '#E086D3',
            }}
            tooltipText="Github"
            size="small"
          >
            <FaGithub size={20} />
          </Tooltip>
        </a>

        <a href="https://linkedin.com/in/brunodemasi">
          <Tooltip
            colors={{
              background: '#333',
              font: '#E086D3',
            }}
            tooltipText="Linkedin"
            size="small"
          >
            <FaLinkedinIn size={20} />
          </Tooltip>
        </a>

        <a href="https://facebook.com/brunodmsi">
          <Tooltip
            colors={{
              background: '#333',
              font: '#E086D3',
            }}
            tooltipText="Facebook"
            size="small"
          >
            <FaFacebook size={20} />
          </Tooltip>
        </a>
      </footer>
    </Wrapper>
  );
};

export default SideBar;
