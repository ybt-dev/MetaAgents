import { Inject } from '@nestjs/common';
import OrganizationsModuleTokens from '@apps/platform/organizations/organizations.module.tokens';

const InjectOrganizationRepository = () => {
  return Inject(OrganizationsModuleTokens.Repositories.OrganizationRepository);
};

export default InjectOrganizationRepository;
