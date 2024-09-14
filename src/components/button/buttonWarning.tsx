import { twMerge } from 'tailwind-merge';
import { IButtonDeafult } from './interfaces';
import { buttonBaseStyle } from './constants';

export function ButtonWarning({ className, children }: IButtonDeafult) {
  return (
    <button
      className={twMerge(
        buttonBaseStyle,
        'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-300',
        className,
      )}
    >
      {children}
    </button>
  );
}
