import { NestedStack, NestedStackProps, Names } from 'aws-cdk-lib';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { DynamoInfo } from './prop-type';

interface DatabaseProps extends NestedStackProps {
  dbProps: DynamoInfo;
}

export class Database extends NestedStack {

  public readonly ddbTable: Table;

  constructor(scope: Construct, id: string, props: DatabaseProps) {
    super(scope, id);

    this.ddbTable = new Table(this, 'table', {
      tableName: `${props.dbProps.tableName}-${Names.uniqueId(this).toLowerCase().slice(-8)}`,
      partitionKey: {
        name: props.dbProps.partitionKey,
        type: props.dbProps.partitionKeyType,
      },
      removalPolicy: props.dbProps.removalPolicy,
      timeToLiveAttribute: props.dbProps.ttlAttr,
      billingMode: props.dbProps.billingMode,
    });
  }
}
