import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectTransactionsManager } from '@libs/transactions/decorators';
import { TransactionsManager } from '@libs/transactions/managers';
import { OrganizationRepository } from '@apps/platform/organizations/repositories';
import {
  InjectOrganizationRepository,
  InjectOrganizationEntityToDtoMapper,
} from '@apps/platform/organizations/decorators';
import { OrganizationDto } from '@apps/platform/organizations/dto';
import { OrganizationEntityToDtoMapper } from '@apps/platform/organizations/entities-mappers';

export interface CreateOrganizationParams {
  name: string;
  description?: string;
}

export interface OrganizationService {
  create(params: CreateOrganizationParams): Promise<OrganizationDto>;
}

@Injectable()
export class DefaultOrganizationService implements OrganizationService {
  constructor(
    @InjectOrganizationRepository() private readonly organizationRepository: OrganizationRepository,
    @InjectOrganizationEntityToDtoMapper() private organizationEntityToDtoMapper: OrganizationEntityToDtoMapper,
    @InjectTransactionsManager() private readonly transactionsManager: TransactionsManager,
  ) {}

  public async create(params: CreateOrganizationParams) {
    return this.transactionsManager.useTransaction(async () => {
      const organization = await this.organizationRepository.findByName(params.name);

      if (organization) {
        throw new UnprocessableEntityException('Organization with this name already exists.');
      }

      const organizationEntity = await this.organizationRepository.createOne({
        name: params.name,
        description: params.description,
      });

      return this.organizationEntityToDtoMapper.mapOne(organizationEntity);
    });
  }
}
