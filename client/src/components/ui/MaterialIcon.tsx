import React from 'react';

type IconType = 'filled' | 'outlined' | 'rounded' | 'sharp' | 'two-tone';

interface MaterialIconProps extends React.HTMLAttributes<HTMLElement> {
  iconName: string;
  type?: IconType;
  size?: number | string;
  color?: string;
  inlineColor?: string;
}

export const MaterialIcon: React.FC<MaterialIconProps> = ({
  iconName,
  type = 'outlined',
  className = '',
  size = 24,
  color,
  inlineColor,
  style,
  ...rest
}) => {

  const getIconClassName = (): string => {
    switch (type) {
      case 'filled': return 'material-icons';
      case 'outlined': return 'material-icons-outlined';
      case 'rounded': return 'material-icons-round';
      case 'sharp': return 'material-icons-sharp';
      case 'two-tone': return 'material-icons-two-tone';
      default: return 'material-icons';
    }
  };

  const inlineStyles: React.CSSProperties = {
    fontSize: typeof size === 'number' ? `${size}px` : size,
    color: inlineColor,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    verticalAlign: 'middle',
    userSelect: 'none',
    ...style,
  };

  return (
    <i 
      className={`${getIconClassName()} ${className} ${color} shrink-0 transition-colors duration-200`} 
      style={inlineStyles} 
      {...rest}>
      {iconName}
    </i>
  );
};

export default MaterialIcon;