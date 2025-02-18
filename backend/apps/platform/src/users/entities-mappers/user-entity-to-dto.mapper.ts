import { Injectable } from '@nestjs/common';
import { UserEntity } from '@apps/platform//users/entities';
import { UserDto } from '@apps/platform/users/dto';

export interface UserEntityToDtoMapper {
  mapOne(entity: UserEntity): UserDto;
  mapMany(entities: UserEntity[]): UserDto[];
}

@Injectable()
export class DefaultUserEntityToDtoMapper implements UserEntityToDtoMapper {
  public mapOne(entity: UserEntity): UserDto {
    return {
      id: entity.getId(),
      organizationId: entity.getOrganizationId(),
      address: entity.getAddress(),
      firstName: entity.getFirstName(),
      lastName: entity.getLastName(),
    };
  }

  public mapMany(entities: UserEntity[]): UserDto[] {
    return entities.map((entity) => this.mapOne(entity));
  }
}
