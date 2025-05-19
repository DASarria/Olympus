
import { ButtonHTMLAttributes, FC, ReactNode } from "react";

/**
 * Interface for the Button component props, extending the native HTML button attributes.
 *
 * @interface ButtonProps
 * @extends ButtonHTMLAttributes<HTMLButtonElement>
 */
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
}

/**
 * Button Component
 * 
 * This component renders a customizable button with support for additional styles and functionality
 * by accepting the standard HTML button attributes, including `className`, `onClick`, and more.
 * It supports the display of any React node as its content and has default styles that can be
 * customized through the `className` prop.
 *
 * @component
 * @example
 * // Usage example of the Button component
 * <Button className="bg-blue-500 text-white" onClick={handleClick}>Click Me</Button>
 * 
 * @param {ButtonProps} props - The props for the Button component.
 * @returns {JSX.Element} The rendered button element.
 */
const Button: FC<ButtonProps> = ({ children, className = "", ...props }) => {
  const combinedClasses = `rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${className}`;

  return (
    <button className={combinedClasses} {...props}>
        {children}
    </button>
  );
};

export default Button;
