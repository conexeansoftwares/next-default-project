import { twMerge } from 'tailwind-merge';
import { IButtonDeafult } from './interfaces';
import { buttonBaseStyle } from './constants';

export function ButtonPrimary({ className, children }: IButtonDeafult) {
  return (
    <button
      className={twMerge(
        buttonBaseStyle,
        'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-300',
        className,
      )}
    >
      {children}
    </button>
  );
}
