"use client";
import '@/app/styles/components/atoms/toggle.scss';
import { ReactNode } from "react";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  thumbIcon?: ReactNode;
}

const Toggle = ({ checked, onChange, label, thumbIcon }: ToggleProps) => {
  return (
    <label className={`toggle${thumbIcon ? ' has-thumb-icon' : ''}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
      />
      <span className="slider">
        {thumbIcon && <span className="toggle-thumb-icon">{thumbIcon}</span>}
      </span>
      {label && <span className="toggle-label">{label}</span>}
    </label>
  );
};

export default Toggle;