import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Chime } from './chime-stack';
import { Sma } from './sma-stack';
import { Database } from './dynamo-stack';
import { BotInfo, ChimeInfo, DynamoInfo } from './prop-type'

interface nlaiStackProps extends StackProps {
  envInfo: { account: string; region: string; partition: string };
  chimeInfo: ChimeInfo;
  botInfo: BotInfo;
  dbInfo: DynamoInfo;
}

export class CallCenterStack extends Stack {
  constructor(scope: Construct, id: string, props: nlaiStackProps) {
    super(scope, id, props);

    const agentDB = new Database(this, 'Database', { dbProps: props.dbInfo });
    const sma = new Sma(this, 'Sma', { botInfo: props.botInfo, agentTable: agentDB.ddbTable, envInfo: props.envInfo });

    const chime = new Chime(this, 'Chime', {
      chimeInfo: props.chimeInfo,
      smaLambdaEndpointArn: sma.smaLambdaEndpointArn,
    });

    new CfnOutput(this, 'phoneNumber', { value: chime.phoneNumber });
    new CfnOutput(this, 'smaId', { value: chime.smaId });
    new CfnOutput(this, 'smaHandlerArn', { value: sma.smaLambdaEndpointArn });
    new CfnOutput(this, 'smaHandlerName', { value: sma.smaLambdaName });
    new CfnOutput(this, 'logGroup', { value: sma.handlerLambdaLogGroupName });
  }
}

