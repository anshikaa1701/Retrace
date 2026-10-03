import React, { RefObject, CSSProperties, MouseEvent } from 'react';

export interface VariableProximityProps {
  label: string;
  fromFontVariationSettings?: string;
  toFontVariationSettings?: string;
  containerRef?: RefObject<HTMLElement | null>;
  radius?: number;
  falloff?: 'linear' | 'exponential' | 'gaussian';
  className?: string;
  onClick?: (event: MouseEvent<HTMLSpanElement>) => void;
  style?: CSSProperties;
  [key: string]: any;
}

declare const VariableProximity: React.ForwardRefExoticComponent<
  VariableProximityProps & React.RefAttributes<HTMLSpanElement>
>;

export default VariableProximity;
