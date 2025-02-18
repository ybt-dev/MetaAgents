import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectTransactionsManager } from '@libs/transactions/decorators';
import { TransactionsManager } from '@libs/transactions/managers';
import { MongodbTransaction } from '@libs/mongodb-transactions';
import { Organization } from '@apps/platform/organizations/schemas';
import { OrganizationEntity, MongoOrganizationEntity } from '@apps/platform/organizations/entities';

interface CreateOrganizationEntityParams {
  name: string;
  description?: string;
}

export interface OrganizationRepository {
  findByName(name: string): Promise<OrganizationEntity | null>;
  createOne(params: CreateOrganizationEntityParams): Promise<OrganizationEntity>;
}

@Injectable()
export class MongoOrganizationRepository implements OrganizationRepository {
  public constructor(
    @InjectModel(Organization.name) private readonly organizationModel: Model<Organization>,
    @InjectTransactionsManager() private readonly transactionsManager: TransactionsManager<MongodbTransaction>,
  ) {}

  public async findByName(name: string) {
    const organization = await this.organizationModel
      .findOne({ name }, undefined, {
        session: this.transactionsManager.getCurrentTransaction()?.getSession(),
        lean: true,
      })
      .exec();

    return organization ? new MongoOrganizationEntity(organization) : null;
  }

  public async createOne(params: CreateOrganizationEntityParams) {
    const [organization] = await this.organizationModel.create([params], {
      session: this.transactionsManager.getCurrentTransaction()?.getSession(),
    });

    return new MongoOrganizationEntity(organization);
  }
}
