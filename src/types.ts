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
  color?: string;
}

export interface Circle {
  left?: number | string;
  top?: number | string;
  width?: number | string;
  height?: number | string;
  rotate?: number | string;
  minWidth?: number;
}

export interface ListItemProps { 
  icon?: string; 
  classId?: string; 
  text?: string; 
  type?: string; 
  content?: string; 
  id?: number;
  link?: string;
}

export interface LandingComponent {
	id: string;
	type: string | null;
  color?: string;
  canvas?: string;
  btn?: string;
  textColor?: string;
  titleColor?: string;
  navPosition?: "right" | "top" | "bottom";
  titlePosition?: string;
  title?: string;
  text1?: string;
  text2?: string;
  text3?: string;
  list?: ListItemProps[] | string[];
  showCircles?: boolean;
  circle1?: Circle[];
  circle2?: Circle[];
  textConfig?: Circle[];
  positionConfig?: any;
  showSettings?: boolean;
  showNav?: boolean;
}

export interface ConfProps {
  circle1: Circle[];
  circle2: Circle[];
}

export interface ButtonProps {
  text?: string;
  onClick?: () => void;
  size?: 'small' | 'medium' | 'large' | 'regular' | 'preview';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  left?: string;
  top?: string;
  icon?: React.ReactNode;
  delay?: number;
  labelText?: string;
  labelColor?: string;
  direction?: string;
  section?: number;
}

export interface labelStyles {
  color?: string;
  left?: number | string;
  right?: number | string;
  transform?: string;
  top?: number | string;
  opacity?: number;
  backgroundColor?: string;
}

export interface LabelProps {
  text?: string;
  color?: string;
  direction?: string;
  isHovered?: boolean;
  section?: number;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface SlugResponse {
    success: boolean;
    message?: string;
    id?: string;
    available?: boolean;
}