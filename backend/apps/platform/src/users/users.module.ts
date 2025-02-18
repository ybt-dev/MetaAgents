import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionsModule } from '@libs/transactions';
import { User, UserSchema } from './schemas';
import { DefaultUserService } from './services';
import { MongoUserRepository } from './repositories';
import { DefaultUserEntityToDtoMapper } from './entities-mappers';
import UsersModuleTokens from './users.module.tokens';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), TransactionsModule],
  providers: [
    {
      provide: UsersModuleTokens.Services.UserService,
      useClass: DefaultUserService,
    },
    {
      provide: UsersModuleTokens.Repositories.UserRepository,
      useClass: MongoUserRepository,
    },
    {
      provide: UsersModuleTokens.EntityMappers.UserEntityToDtoMapper,
      useClass: DefaultUserEntityToDtoMapper,
    },
  ],
  exports: [UsersModuleTokens.Services.UserService],
})
export class UsersModule {
  public static Tokens = UsersModuleTokens;
}
