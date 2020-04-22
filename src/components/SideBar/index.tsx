import React from 'react';
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
      <OutlineItem outlineColor="#ec1839" textColor="#fff">
        B
      </OutlineItem>

      <section>
        <FaHome color="#4f4f4f" size={28} />
        <FaUser color="#4f4f4f" size={28} />
        <FaCode color="#4f4f4f" size={28} />
        <FaEnvelope color="#4f4f4f" size={28} />
      </section>

      <footer>
        <a href="https://github.com/brunodmsi">
          <FaGithub color="#4f4f4f" size={20} />
        </a>
        <a href="https://linkedin.com/in/brunodemasi">
          <FaLinkedinIn color="#4f4f4f" size={20} />
        </a>
        <a href="https://facebook.com/brunodmsi">
          <FaFacebook color="#4f4f4f" size={20} />
        </a>
      </footer>
    </Wrapper>
  );
};

export default SideBar;
