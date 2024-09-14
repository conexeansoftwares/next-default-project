import { twMerge } from 'tailwind-merge';
import { IButtonDeafult } from './interfaces';
import { buttonBaseStyle } from './constants';

export function ButtonSecondary({ className, children }: IButtonDeafult) {
  return (
    <button
      className={twMerge(
        buttonBaseStyle,
        'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-300',
        className,
      )}
    >
      {children}
    </button>
  );
}
