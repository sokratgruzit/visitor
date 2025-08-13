import * as MuiIcons from "@mui/icons-material";

import styles from "./Svg.module.css";

interface Size {
    xs: number; 
    sm: number;  
    md: number;  
    lg: number; 
}

interface SvgProps {
    svgName: keyof typeof MuiIcons;
    classId?: string;
    color?: string;
    size?: Size;
}

export const Svg: React.FC<SvgProps> = ({
    svgName,
    classId,
    color = "#63C5AB",
    size
}) => {
    const IconComponent = MuiIcons[svgName] as React.ElementType;

    if (!IconComponent) {
        console.warn(`Иконка "${svgName}" не найдена в @mui/icons-material`);
        return null;
    }

    return (
        <IconComponent
            className={classId ? styles[classId] : undefined}
            sx={{
                color,
                fontSize: size ?? "clamp(16px, 5vw, 64px)"
            }}
        />
    );
};
