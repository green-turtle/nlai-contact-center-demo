import { RemovalPolicy } from 'aws-cdk-lib';
import { BillingMode, AttributeType} from 'aws-cdk-lib/aws-dynamodb';

export interface EnvInfo {
  account: string;
  partition: string;
  region: string;
}

export interface BotInfo {
  id: string;
  aliasId: string;
  botIntent: string;
  botDialogAction: string;
  botDialogActionData: string;
}

export interface ChimeInfo { 
  phoneNumber: string;
  phoneState: string;
}

export interface DynamoInfo {
  tableName: string;
  partitionKey: string;
  partitionKeyType: AttributeType;
  ttlAttr: string;
  billingMode: BillingMode;
  removalPolicy: RemovalPolicy;
}
