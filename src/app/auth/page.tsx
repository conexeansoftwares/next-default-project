'use client';

import { Login } from '@/components/login';
import { useForm } from '@/hooks/useForm';
import { loginValidation } from './_validations/loginValidation';
import { Input } from '@/components/input';
import { Form } from '@/components/form';

export default function Page() {
  const { formData, errors, isSubmitting, handleChange, validateForm } =
    useForm({
      email: {
        initialValue: '',
        validations: loginValidation.email,
      },
      password: {
        initialValue: '',
        validations: loginValidation.password,
      },
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        console.log('Form submitted:', formData);
        // Adicione a lógica de envio de dados aqui
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    }
  };

  return (
    <Login.Root>
      <Login.Title title="Projeto padrão" />
      <Login.Paragraph paragraph="Bem vindo de volta" />
      <Login.Form>
        <Form.Root>
          <Form.Component onSubmit={handleSubmit}>
            <Form.Content className='grid-cols-2'>
              <Input.Root>
                <Input.Label
                  htmlFor="email"
                  text="E-mail"
                  error={!!errors.email}
                />
                <Input.Default
                  name="email"
                  id="email"
                  type="email"
                  value={formData.email}
                  error={!!errors.email}
                  onChange={handleChange}
                />
                <Input.Error error={errors.email} />
              </Input.Root>

              <Input.Root>
                <Input.Label
                  htmlFor="password"
                  text="Senha"
                  error={!!errors.password}
                />
                <Input.Default
                  name="password"
                  id="password"
                  value={formData.password}
                  error={!!errors.password}
                  onChange={handleChange}
                />
                <Input.Error error={errors.password} />
              </Input.Root>    

              <Form.Submit isSubmitting={isSubmitting} text="Fazer login" className='mt-4 justify-start' />  
            </Form.Content>
          </Form.Component>
        </Form.Root>
      </Login.Form>
    </Login.Root>
  );
}

