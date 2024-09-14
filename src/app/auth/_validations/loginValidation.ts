import { required } from '@/utils/validationRules';

export const loginValidation = {
  email: [required('E-mail')],
  password: [required('Senha')],
};
