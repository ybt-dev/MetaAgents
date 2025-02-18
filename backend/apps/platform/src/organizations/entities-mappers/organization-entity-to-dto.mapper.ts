import { Injectable } from '@nestjs/common';
import { OrganizationEntity } from '@apps/platform/organizations/entities';
import { OrganizationDto } from '@apps/platform/organizations/dto';

export interface OrganizationEntityToDtoMapper {
  mapOne(entity: OrganizationEntity): OrganizationDto;
  mapMany(entities: OrganizationEntity[]): OrganizationDto[];
}

@Injectable()
export class DefaultOrganizationEntityToDtoMapper implements OrganizationEntityToDtoMapper {
  public mapOne(entity: OrganizationEntity): OrganizationDto {
    return {
      id: entity.getId(),
      name: entity.getName(),
      description: entity.getDescription(),
    };
  }

  public mapMany(entities: OrganizationEntity[]): OrganizationDto[] {
    return entities.map((entity) => this.mapOne(entity));
  }
}
