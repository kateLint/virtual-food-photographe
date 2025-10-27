import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface LoaderIconProps {
  width?: number;
  height?: number;
  color?: string;
}

const LoaderIcon: React.FC<LoaderIconProps> = ({ width = 24, height = 24, color = 'currentColor' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </Svg>
);

export default LoaderIcon;
