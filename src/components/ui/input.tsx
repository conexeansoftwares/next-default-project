import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  mask?: string;
  onChange?: (value: string) => void;
}

const applyMask = (value: string, mask: string) => {
  let maskedValue = '';
  let unmaskedIndex = 0;

  for (let i = 0; i < mask.length; i++) {
    if (unmaskedIndex >= value.length) break;

    if (mask[i] === '#') {
      maskedValue += value[unmaskedIndex];
      unmaskedIndex++;
    } else {
      maskedValue += mask[i];
      if (value[unmaskedIndex] === mask[i]) {
        unmaskedIndex++;
      }
    }
  }

  return maskedValue;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, mask, onChange, ...props }, ref) => {
    const [inputValue, setInputValue] = React.useState('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      let newValue = value;

      if (mask) {
        newValue = applyMask(value.replace(/\D/g, ''), mask);
      }

      setInputValue(newValue);
      if (onChange) {
        onChange(newValue);
      }
    };

    return (
      <input
        type={type}
        className={cn(
          'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        value={inputValue}
        onChange={handleChange}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };
