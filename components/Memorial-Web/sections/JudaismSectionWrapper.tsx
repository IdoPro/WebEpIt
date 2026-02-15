import React from 'react';
import JewishSection from '../components/JewishSection';

interface JudaismSectionWrapperProps {
  config?: any;
}

const JudaismSectionWrapper: React.FC<JudaismSectionWrapperProps> = ({ config }) => {
  return <JewishSection config={config} />;
};

export default JudaismSectionWrapper;
