export type Point = { x: number; y: number };

export interface TriangleData {
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  points: Point[];
  phase: number;
  startX: number;      
  startY: number;      
  scatterX: number;    
  scatterY: number;    
  scale: number;   
  z: number;
  targetX?: number;
  targetY?: number;
  targetRotation?: number;
  targetColor?: string;
  targetPoints?: Point[];
  inactive?: boolean;
  orbitAngle?: number;
  orbitRadius?: number;
  orbitSpeed?: number;
  alpha?: number;
}

export interface TypingTextProps {
  text: string;
  className?: string;
  delayPerChar?: number; 
  delayPerWord?: number; 
  showCursor?: boolean;
}

interface Circle {
  left: number;
  top: number;
  width: number;
  height: number;
  rotate: number;
}

export interface ConfProps {
  circle1: Circle;
  circle2: Circle;
}

export interface ButtonProps {
  text?: string;
  onClick?: () => void;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  borderColor?: string;
  left?: string;
  top?: string;
  icon?: React.ReactNode;
  bg?: string;
  delay?: number;
  labelText?: string;
  labelColor?: string;
  direction?: string;
  section?: number;
}

export interface labelStyles {
  color?: string;
  left?: number;
  right?: number;
  transform?: string;
  top?: number;
  opacity?: number;
}

export interface LabelProps {
  text?: string;
  color?: string;
  direction?: string;
  isHovered?: boolean;
  section?: number;
}