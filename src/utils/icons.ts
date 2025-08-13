import * as MuiIcons from "@mui/icons-material";

export const icons = Object.keys(MuiIcons) as (keyof typeof MuiIcons)[];
export type IconName = keyof typeof MuiIcons;