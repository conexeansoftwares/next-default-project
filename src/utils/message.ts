export const MESSAGE = {
  COMMON: {
    GENERIC_ERROR_TITLE: 'Ah não. Algo deu errado!',
    GENERIC_ERROR_MESSAGE:
      'Ocorreu um erro, entre em contato com a administração.',
    GENERIC_WARNING_TITLE: 'Atenção!',
  },
  SHORTCUT: {
    CREATED_SUCCESS: 'Atalho registrado com sucesso.',
    NOT_FOUND: 'Atalho não encontrado.',
    DELETED_SUCCESS: 'Atalho deletado com sucesso.',
    UPDATED_SUCCESS: 'Atalho atualizado com sucesso.',
    ALL_NOT_FOUND: 'Nenhum atalho encontrado.',
  },
  COMPANY: {
    CREATED_SUCCESS: 'Empresa registrada com sucesso.',
    EXISTING_CNPJ: 'CNPJ já registrado.',
    NOT_FOUND: 'Empresa não encontrada ou invativa.',
    ALL_NOT_FOUND: 'Nenhuma empresa encontrada.',
    DEACTIVATED_SUCCESS: 'Empresa desativada com sucesso.',
    UPDATED_SUCCESS: 'Informações da empresa atualizadas com sucesso.',
    EXISTING_DEPENDENCIES: 'Não é possível desativar a empresa devido a veículo(s), colaborador(es) e/ou usuário(s) vinculados. Desative essas entidades antes de desativar a empresa.',

  },
  EMPLOYEE: {
    CREATED_SUCCESS: 'Colaborador registrado com sucesso.',
    EXISTING_REGISTRATION: 'Matrícula já registrada.',
    NOT_FOUND: 'Colaborador não encontrado ou inativo.',
    DEACTIVATED_SUCCESS: 'Colaborador desativado com sucesso.',
    UPDATED_SUCCESS: 'Informaçãoes do colaborador atualizadas com sucesso.',
    ALL_NOT_FOUND: 'Nenhum colaborador encontrado.',
    EXISTING_DEPENDENCIES: 'Não é possível desativar colaborador devido a usuário vinculado. Desative essas entidades antes de desativar a empresa.',
  },
  VEHICLE: {
    EXISTING_LICENSE_PLATE: 'Placa já registrada.',
    CREATED_SUCCESS: 'Veículo registrado com sucesso.',
    NOT_FOUND: 'Veículo não encontrado ou inativo.',
    DEACTIVATED_SUCCESS: 'Veículo desativado com sucesso.',
    UPDATED_SUCCESS: 'Veículo desativado com sucesso.',
    ALL_NOT_FOUND: 'Nenhum veículo encontrado.',
  },
  USER: {
    EXISTING_EMAIL: 'E-mail já registrado.',
    CREATED_SUCCESS: 'Usuário registrado com sucesso.',
    NOT_FOUND: 'Usuário não encontrado ou inativo.',
    DEACTIVATED_SUCCESS: 'Usuário desativado com sucesso.',
    UPDATED_SUCCESS: 'Usuário atualizado com sucesso.',
    ALL_NOT_FOUND: 'Nenhum usuário encontrado.',
    PASSWORD_UPDATED_SUCCESS: 'Senha atualizada com sucesso.',
    EXISTING_USER_TO_EMPLOYEE: 'Já existe um usuário registrado para o colaborador.',
  },
  LOGIN: {
    FAIL: 'Usuário ou senha incorretos.',
    SUCCESS: 'Usuário autenticado com sucesso.',
  },
  MOVEMENT: {
    REQUIRED_INFORMATIONS_TITLE: 'Informações obrigatórias!',
    EMPLOYEE_REQUIRED: 'Por favor, selecione um colaborador.',
    LICENSE_PLATE_REQUIRED: 'Por favor, informe a placa do veículo.',
  },
  EMPLOYEE_MOVEMENT: {
    CREATED_SUCCESS: 'Movimentação do colaborador realizada com sucesso.',
    NOT_FOUND: 'Movimentação sem registros para o período informado.',
  },
  VEHICLE_MOVEMENT: {
    CREATED_SUCCESS: 'Movimentação do veículo realizada com sucesso.',
    NOT_FOUND: 'Movimentação sem registros para o período informado.',
  },
  VISITOR_MOVEMENT: {
    CREATED_SUCCESS: 'Movimentação do visitante realizada com sucesso.',
    NOT_FOUND: 'Movimentação sem registros para o período informado.',
  },
  HISTORICAL: {
    DATES_REQUIRED: 'Por favor, selecione as datas inial e final.',
  },
};
