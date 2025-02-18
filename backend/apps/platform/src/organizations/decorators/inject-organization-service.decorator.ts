import { Inject } from '@nestjs/common';
import OrganizationsModuleTokens from '@apps/platform/organizations/organizations.module.tokens';

const InjectOrganizationService = () => {
  return Inject(OrganizationsModuleTokens.Services.OrganizationService);
};

export default InjectOrganizationService;
