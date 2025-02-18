import { Inject } from '@nestjs/common';
import OrganizationsModuleTokens from '@apps/platform/organizations/organizations.module.tokens';

const InjectOrganizationEntityToDtoMapper = () => {
  return Inject(OrganizationsModuleTokens.EntityMappers.OrganizationEntityToDtoMapper);
};

export default InjectOrganizationEntityToDtoMapper;
