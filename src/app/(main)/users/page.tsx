import { PageComponent } from '../../../components/ui/page';
import { columns } from './columns';
import { DataTable } from './dataTable';
import { User } from './types';
import { Button } from '../../../components/ui/button';
import { UserRoundPlus } from 'lucide-react';
import Link from 'next/link';

async function getData(): Promise<User[]> {
  return [
    {
      id: '728ed52f',
      name: 'Pedro',
      lastname: 'Correa',
      email: 'pedro.correa@conexean.com.br',
    },
  ];
}

export default async function PageUser() {
  const data = await getData();

  return (
    <PageComponent.Root>
      <PageComponent.Header>
        <div className="flex flex-col">
          <PageComponent.Title text="Usuários" />
        </div>
      </PageComponent.Header>
      <PageComponent.Content className="flex-col">
        <div className="flex w-full justify-end">
          <Link href={'/users/create'}>
            <Button className="mb-2">
              <UserRoundPlus className="w-4 h-4 me-2" />
              Cadastar usuário
            </Button>
          </Link>
        </div>
        <DataTable columns={columns} data={data} />
      </PageComponent.Content>
    </PageComponent.Root>
  );
}
