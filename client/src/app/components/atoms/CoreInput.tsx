import "@/app/styles/components/atoms/input.scss";
import { useId } from "react";

interface CoreInputProps {
  label: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  name?: string;
}

const CoreInput = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder = " ", // must be a single space for floating label
  disabled = false,
  name,
}: CoreInputProps) => {
  const id = useId();
  return (
    <div className="floating-label-input">
      <input
        className="input"
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
};

export default CoreInput;