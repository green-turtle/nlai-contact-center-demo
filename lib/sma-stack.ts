import { Construct } from 'constructs';
import { Duration, NestedStackProps, NestedStack, aws_lex as lex } from 'aws-cdk-lib';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Role, ServicePrincipal, PolicyDocument, PolicyStatement, ManagedPolicy } from 'aws-cdk-lib/aws-iam';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { BotInfo, EnvInfo } from './prop-type';
import { BotAccess } from './lex-resource-policy';

interface SmaProps extends NestedStackProps {
  botInfo: BotInfo;
  agentTable: Table;
  envInfo: EnvInfo;
}

export class Sma extends NestedStack {
  public readonly smaLambdaName: string;
  public readonly smaLambdaEndpointArn: string;
  public readonly handlerLambdaLogGroupName: string;

  constructor(scope: Construct, id: string, props: SmaProps) {
    super(scope, id, props);

    const smaRole = new Role(this, 'smaRole', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      inlinePolicies: {
        ['chimePolicy']: new PolicyDocument({
          statements: [
            new PolicyStatement({
              resources: ['*'],
              actions: ['chime:*'],
            }),
          ],
        }),
      },
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName(
          'service-role/AWSLambdaBasicExecutionRole',
        ),
        ManagedPolicy.fromAwsManagedPolicyName(
          // could be agent table readonly
          'AmazonDynamoDBFullAccess',
        ),
        ManagedPolicy.fromAwsManagedPolicyName(
          // could be QnA bot put session command and start conversation
          'AmazonLexFullAccess',
        ),
      ],
    });

    const smaLambda = new NodejsFunction(this, 'smaLambda', {
      entry: 'src/smaLambda.ts',
      handler: 'handler',
      bundling: {
        sourceMap: true,
        minify: false,
        externalModules: ['aws-sdk'],
        nodeModules: ['uuid',],
      },
      environment: {
        NODE_OPTIONS: '--enable-source-maps',
        BOT_ALIAS_ID: props.botInfo.aliasId,
        BOT_ID: props.botInfo.id,
        BOT_INTENT: props.botInfo.botIntent,
        DIALOG_ACTION_TYPE: props.botInfo.botDialogAction,
        DIALOG_ACTION_DATA: props.botInfo.botDialogActionData,
        AGENT_TABLE: props.agentTable.tableName,
      },
      runtime: Runtime.NODEJS_14_X,
      role: smaRole,
      timeout: Duration.seconds(60),
    });

    BotAccess.Statement[0].Resource = `arn:${props.envInfo.partition}:lex:${props.envInfo.region}:${props.envInfo.account}:bot-alias/${props.botInfo.id}/${props.botInfo.aliasId}`;
    BotAccess.Statement[0].Condition.StringEquals['AWS:SourceAccount'] = `${props.envInfo.account}`;
    BotAccess.Statement[0].Condition.ArnEquals['AWS:SourceArn'] = `arn:${props.envInfo.partition}:voiceconnector:${props.envInfo.region}:${props.envInfo.account}:*`;
    new lex.CfnResourcePolicy(this, 'LexResourcePolicy', {
      policy: BotAccess,
      resourceArn: BotAccess.Statement[0].Resource,
    });

    this.smaLambdaName = smaLambda.functionName;
    this.smaLambdaEndpointArn = smaLambda.functionArn;
    this.handlerLambdaLogGroupName = smaLambda.logGroup.logGroupName;
  }
}
