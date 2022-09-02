#!/usr/bin/env node
import 'source-map-support/register';
import { AttributeType, BillingMode } from 'aws-cdk-lib/aws-dynamodb';
import { App, RemovalPolicy } from 'aws-cdk-lib';
import { CallCenterStack } from '../lib/nlai-call-center-stack';

const props = {
  account: '',
  partition: 'aws',
  region: 'us-east-1',

  chimePhoneNumber: '+16173718768',
  chimePhoneState: '', // the state code if a new number needs to be provisioned

  botId: 'WYZIO7FS9M',
  botAliasId: 'SKBDC4HZ1E',
  botIntent: 'QnaIntent',
  botDialogAction: 'ElicitSlot',
  botDialogActionData: 'qnaslot',

  ddbTableName: 'CallCenterAgents',
  ddbKey: 'AgentId',
  ddbPartition: AttributeType.STRING,
  ddbTTL: 'TTL',
  ddbBilling: BillingMode.PAY_PER_REQUEST,
  ddbPolicy: RemovalPolicy.DESTROY,
}

const app = new App();
new CallCenterStack(app, 'CallCenterStack', {
  /* If you don't specify 'env', this stack will be environment-agnostic.
   * Account/Region-dependent features and context lookups will not work,
   * but a single synthesized template can be deployed anywhere. */

  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration. */
  // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

  /* Uncomment the next line if you know exactly what Account and Region you
   * want to deploy the stack to. */
  env: { account: props.account, region: props.region },
  chimeInfo: { phoneNumber: props.chimePhoneNumber, phoneState: props.chimePhoneState },
  botInfo: { id: props.botId, aliasId: props.botAliasId, botIntent: props.botIntent, botDialogAction:props.botDialogAction, botDialogActionData: props.botDialogActionData },
  dbInfo: {
    tableName: props.ddbTableName,
    partitionKey: props.ddbKey,
    partitionKeyType: props.ddbPartition,
    ttlAttr: props.ddbTTL,
    billingMode: props.ddbBilling,
    removalPolicy: props.ddbPolicy
  },
  envInfo: { account: props.account, partition: props.partition, region: props.region }

  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
});
