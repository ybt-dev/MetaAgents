import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionsModule } from '@libs/transactions';
import { Organization, OrganizationSchema } from './schemas';
import { DefaultOrganizationService } from './services';
import { MongoOrganizationRepository } from './repositories';
import { DefaultOrganizationEntityToDtoMapper } from './entities-mappers';
import OrganizationsModuleTokens from './organizations.module.tokens';

@Module({
  imports: [MongooseModule.forFeature([{ name: Organization.name, schema: OrganizationSchema }]), TransactionsModule],
  providers: [
    {
      provide: OrganizationsModuleTokens.Services.OrganizationService,
      useClass: DefaultOrganizationService,
    },
    {
      provide: OrganizationsModuleTokens.Repositories.OrganizationRepository,
      useClass: MongoOrganizationRepository,
    },
    {
      provide: OrganizationsModuleTokens.EntityMappers.OrganizationEntityToDtoMapper,
      useClass: DefaultOrganizationEntityToDtoMapper,
    },
  ],
  exports: [OrganizationsModuleTokens.Services.OrganizationService],
})
export class OrganizationsModule {
  public static Tokens = OrganizationsModuleTokens;
}
