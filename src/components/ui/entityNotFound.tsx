import { CircleArrowLeft } from 'lucide-react';
import { PageComponent } from './page';
import { Button } from './button';
import Link from 'next/link';

interface IEntityNotFound {
  title: string;
  href: string;
}

export function EntityNotFound({ title, href }: IEntityNotFound) {
  return (
    <PageComponent.Root>
      <PageComponent.Header>
        <PageComponent.Title text="Editar empresa" />
      </PageComponent.Header>
      <PageComponent.Content className="items-center justify-center">
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground">
            Clique no botão abaixo e volta a página principal.
          </p>
          <Link href={href}>
            <Button className="mt-4">
              <CircleArrowLeft className="w-4 h-4 me-2" /> Voltar
            </Button>
          </Link>
        </div>
      </PageComponent.Content>
    </PageComponent.Root>
  );
}
