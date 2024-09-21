import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PageComponent } from '@/components/ui/page';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Book, Cog } from 'lucide-react';

const configSteps = [
  {
    number: 1,
    title: 'Módulo Empresas',
    description: [
      'Clique no menu lateral ',
      { text: 'Empresas', href: '/companies' },
      ', em seguida, em ',
      { text: 'Cadastrar empresa', href: '/companies/create' },
      ' e realize o cadastro das empresas necessárias. É obrigatório informar o NOME e o CNPJ para efetuar o cadastro, pois os demais módulos dependerão dessas informações.',
    ],
  },
  {
    number: 2,
    title: 'Módulo Colaboradores',
    description: [
      'Clique no menu lateral ',
      { text: 'Colaboradores', href: '/contributors' },
      ', em seguida, em ',
      { text: 'Cadastrar colaborador', href: '/contributors/create' },
      ' e realize o cadastro dos colaboradores necessários. É obrigatório informar o NOME, MATRÍCULA e EMPRESAS para efetuar o cadastro. Caso o colaborador pertença a mais de uma empresa, as mesmas devem ser todas selecionadas.',
    ],
  },
  {
    number: 3,
    title: 'Módulo Veículos',
    description: [
      'Clique no menu lateral ',
      { text: 'Veículos', href: '/vehicles' },
      ', em seguida, em ',
      { text: 'Cadastrar veículo', href: '/vehicles/create' },
      ' e realize o cadastro dos veículos necessários. É obrigatório informar o PLACA, MODELO e EMPRESA para efetuar o cadastro.',
    ],
  },
];

const moduleDocumentation = [
  {
    title: 'Página de Empresas',
    path: '/companies',
    description:
      'Nesta página, você pode visualizar todas as empresas cadastradas, filtrar por diferentes critérios e acessar as opções de edição e exclusão.',
    features: [
      'Listagem de empresas',
      'Filtros avançados',
      'Opções de edição rápida',
      'Acesso ao cadastro de nova empresa',
    ],
  },
  {
    title: 'Cadastro de Empresa',
    path: '/companies/create',
    description:
      'Use esta página para adicionar uma nova empresa ao sistema. Preencha todos os campos obrigatórios e certifique-se de fornecer informações precisas.',
    features: [
      'Formulário de cadastro completo',
      'Validação em tempo real',
      'Upload de documentos',
      'Integração com serviços de verificação de CNPJ',
    ],
  },
  {
    title: 'Cadastro de Veículos',
    path: '/companies/create',
    description:
      'Use esta página para adicionar uma nova empresa ao sistema. Preencha todos os campos obrigatórios e certifique-se de fornecer informações precisas.',
    features: [
      'Formulário de cadastro completo',
      'Validação em tempo real',
      'Upload de documentos',
      'Integração com serviços de verificação de CNPJ',
    ],
  },
];

function ConfigurationSteps() {
  return (
    <div className="space-y-6">
      {configSteps.map((step, index) => (
        <div key={step.number} className="flex items-stretch">
          <div className="flex flex-col items-center mr-4">
            <div className="rounded-full bg-primary text-primary-foreground w-8 h-8 flex items-center justify-center font-bold">
              {step.number}
            </div>
            {index < configSteps.length - 1 && (
              <div className="h-full w-0.5 bg-primary mt-2"></div>
            )}
          </div>
          <Card className="flex-grow">
            <CardHeader>
              <CardTitle>{step.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                {step.description.map((part, i) =>
                  typeof part === 'string' ? (
                    part
                  ) : (
                    <Link
                      key={i}
                      href={part.href}
                      className="text-primary hover:underline"
                      target="blank"
                    >
                      {part.text}
                    </Link>
                  ),
                )}
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}

function ModuleDocumentation() {
  return (
    <div className="space-y-6">
      {moduleDocumentation.map((page) => (
        <Card key={page.path} className="shadow-none">
          <CardHeader>
            <CardTitle>{page.title}</CardTitle>
            <CardDescription>Caminho: {page.path}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{page.description}</p>
            <h4 className="font-semibold mb-2">Funcionalidades principais:</h4>
            <ul className="list-disc pl-5">
              {page.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function DocumentationPage() {
  return (
    <PageComponent.Root>
      <PageComponent.Header>
        <div className="flex flex-col">
          <PageComponent.Title text="Documentação do Sistema" />
        </div>
      </PageComponent.Header>
      <PageComponent.Content className="flex-col">
        <Tabs defaultValue="config" className="w-full">
          <TabsList className="w-full justify-start mb-6">
            <TabsTrigger value="config" className="flex-1">
              <Cog className="mr-2 h-5 w-5" />
              Configuração inicial
            </TabsTrigger>
            <TabsTrigger value="pages" className="flex-1">
              <Book className="mr-2 h-5 w-5" />
              Documentação dos módulos
            </TabsTrigger>
          </TabsList>
          <TabsContent value="config">
            <h2 className="text-2xl font-bold mb-4 mt-6">
              Passo a Passo de Configuração
            </h2>
            <ConfigurationSteps />
          </TabsContent>
          <TabsContent value="pages">
            <h2 className="text-2xl font-bold mb-4 mt-6">
              Documentação dos módulos
            </h2>
            <ModuleDocumentation />
          </TabsContent>
        </Tabs>
      </PageComponent.Content>
    </PageComponent.Root>
  );
}
