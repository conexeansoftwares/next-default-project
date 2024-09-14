import { Button } from '../button';

interface IFormSubmit {
  text: string;
  isSubmitting: boolean;
  className?: string;
}

export function FormSubmit({ text, isSubmitting, className }: IFormSubmit) {
  return (
    <Button.Primary disabled={isSubmitting} type="submit" className={className}>
      {isSubmitting ? 'Processando...' : text}
    </Button.Primary>
  );
}
