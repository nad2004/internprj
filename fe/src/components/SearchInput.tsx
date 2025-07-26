import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', ...props }, ref) => (
    <input
      ref={ref}
      className={`px-3 py-2 rounded-md bg-gray-100 border border-gray-200 outline-none focus:border-black ${className}`}
      {...props}
    />
  ),
);

Input.displayName = 'Input';
export default Input;
