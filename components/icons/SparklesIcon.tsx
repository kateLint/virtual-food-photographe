import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface SparklesIconProps {
  width?: number;
  height?: number;
  color?: string;
}

const SparklesIcon: React.FC<SparklesIconProps> = ({ width = 24, height = 24, color = 'currentColor' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="m12 3-1.9 5.8-5.8 1.9 5.8 1.9 1.9 5.8 1.9-5.8 5.8-1.9-5.8-1.9Z"/>
    <Path d="M5 3v4"/>
    <Path d="M19 17v4"/>
    <Path d="M3 5h4"/>
    <Path d="M17 19h4"/>
  </Svg>
);

export default SparklesIcon;
