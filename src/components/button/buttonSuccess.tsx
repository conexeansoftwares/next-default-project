import { twMerge } from 'tailwind-merge';
import { IButtonDeafult } from './interfaces';
import { buttonBaseStyle } from './constants';

export function ButtonSuccess({ className, children }: IButtonDeafult) {
  return (
    <button
      className={twMerge(
        buttonBaseStyle,
        'bg-green-500 text-white hover:bg-green-600 focus:ring-green-300',
        className,
      )}
    >
      {children}
    </button>
  );
}
