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
  fileUrl?: string;
  fileBase64?: any;
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
  imageConfig?: Circle[];
  positionConfig?: any;
  showSettings?: boolean;
  showNav?: boolean;
}

export interface PaymentData {
  amount?: number; 
  product?: string;
  targetId?: number;
}

export interface PromoCodeResponse {
  success: boolean;
  message?: string;
  promoCode?: {
    id: number;
    code: string;
    description?: string;
    discountPct?: number;
    bonusDays?: number;
    customType?: string;
    usageLimit?: number;
    usedCount?: number;
    active?: boolean;
    expiresAt?: string;
  };
}

export interface Payment {
  id: string;
  amount: { value: string; currency: string };
  income_amount: { value: string; currency: string };
  status: string;
  created_at: string;
  description: string;
  paid: boolean;
  payment_method: { type: string; title: string };
  captured_at: string;
};

export interface PaymentResponse {
  success: boolean;
  confirmationUrl?: string;
  message?: string;
  status?: string;
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

export interface Voting {
  id: number;
  title: string;
  description: string;
  level: number;
  status: string;
  createdAt: string;
  creatorId: number;
}

export interface VotingResponse {
	success?: boolean;
	message?: string;     
	voting?: Voting;          
	my?: {
		votings: Voting[];
		totalPages: number;
		currentPage: number;
		totalCount: number;
	};
	all?: {
		votings: Voting[];
		totalPages: number;
		currentPage: number;
		totalCount: number;
	};
}