import { twMerge } from 'tailwind-merge';
import { IButtonDeafult } from './interfaces';
import { buttonBaseStyle } from './constants';

export function ButtonDanger({ className, children }: IButtonDeafult) {
  return (
    <button
      className={twMerge(
        buttonBaseStyle,
        'bg-red-500 text-white hover:bg-red-600 focus:ring-red-300',
        className,
      )}
    >
      {children}
    </button>
  );
}
