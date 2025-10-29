import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface ClearIconProps {
  width?: number;
  height?: number;
  color?: string;
}

const ClearIcon: React.FC<ClearIconProps> = ({ width = 24, height = 24, color = '#FFFFFF' }) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 6L6 18"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M6 6L18 18"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default ClearIcon;
