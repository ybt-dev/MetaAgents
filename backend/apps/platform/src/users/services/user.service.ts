import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectTransactionsManager } from '@libs/transactions/decorators';
import { TransactionsManager } from '@libs/transactions/managers';
import { UserRepository } from '@apps/platform/users/repositories';
import { InjectUserRepository, InjectUserEntityToDtoMapper } from '@apps/platform/users/decorators';
import { UserDto } from '@apps/platform/users/dto';
import { UserEntityToDtoMapper } from '@apps/platform/users/entities-mappers';

export interface CreateUserParams {
  address: string;
  organizationId: string;
  firstName?: string;
  lastName?: string;
}

export interface UserService {
  getById(id: string): Promise<UserDto | null>;
  getByAddress(address: string): Promise<UserDto | null>;
  create(params: CreateUserParams): Promise<UserDto>;
}

@Injectable()
export class DefaultUserService implements UserService {
  constructor(
    @InjectUserRepository() private readonly userRepository: UserRepository,
    @InjectUserEntityToDtoMapper() private userEntityToDtoMapper: UserEntityToDtoMapper,
    @InjectTransactionsManager() private readonly transactionsManager: TransactionsManager,
  ) {}

  public async getById(id: string) {
    const user = await this.userRepository.findById(id);

    return user && this.userEntityToDtoMapper.mapOne(user);
  }

  public async getByAddress(address: string) {
    const user = await this.userRepository.findByAddress(address);

    return user && this.userEntityToDtoMapper.mapOne(user);
  }

  public async create(params: CreateUserParams) {
    return this.transactionsManager.useTransaction(async () => {
      const existingUser = await this.userRepository.findByAddress(params.address);

      if (existingUser) {
        throw new UnprocessableEntityException('User with this address already exists.');
      }

      const user = await this.userRepository.createOne({
        firstName: params.firstName,
        lastName: params.lastName,
        address: params.address,
        organization: params.organizationId,
      });

      return this.userEntityToDtoMapper.mapOne(user);
    });
  }
}
