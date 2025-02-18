import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectTransactionsManager } from '@libs/transactions/decorators';
import { TransactionsManager } from '@libs/transactions/managers';
import { MongodbTransaction } from '@libs/mongodb-transactions';
import { User } from '@apps/platform/users/schemas';
import { UserEntity, MongoUserEntity } from '@apps/platform//users/entities';

interface CreateUserEntityParams {
  organization: string;
  address: string;
  firstName?: string;
  lastName?: string;
}

export interface UserRepository {
  findById(id: string): Promise<UserEntity | null>;
  findByAddress(address: string): Promise<UserEntity | null>;
  createOne(params: CreateUserEntityParams): Promise<UserEntity>;
}

@Injectable()
export class MongoUserRepository implements UserRepository {
  public constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectTransactionsManager() private readonly transactionsManager: TransactionsManager<MongodbTransaction>,
  ) {}

  public async findById(id: string) {
    const user = await this.userModel
      .findById(id, undefined, { session: this.transactionsManager.getCurrentTransaction()?.getSession(), lean: true })
      .exec();

    return user ? new MongoUserEntity(user) : null;
  }

  public async findByAddress(address: string) {
    const user = await this.userModel
      .findOne({ address }, undefined, {
        session: this.transactionsManager.getCurrentTransaction()?.getSession(),
        lean: true,
      })
      .exec();

    return user ? new MongoUserEntity(user) : null;
  }

  public async createOne(params: CreateUserEntityParams) {
    const [user] = await this.userModel.create([params], {
      session: this.transactionsManager.getCurrentTransaction()?.getSession(),
    });

    return new MongoUserEntity(user);
  }
}
