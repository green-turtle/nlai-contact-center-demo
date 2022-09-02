import 'source-map-support/register';
import { LexRuntimeV2Client, PutSessionCommand } from '@aws-sdk/client-lex-runtime-v2'
import { DynamoDB } from 'aws-sdk';
import * as sa from './smaActions';

const botId = process.env['BOT_ID'] || '<paste bot id here>'
const botAliasId = process.env['BOT_ALIAS_ID'] || '<paste bot alias id here>'
const intent = process.env['BOT_INTENT'] || '<paste bot intent name here>'
const dialogActionType = process.env['DIALOG_ACTION_TYPE'] || '<paste dialog action type here>' // ElicitSlot or ElicitIntent
const dialogActionData = process.env['DIALOG_ACTION_DATA'] || '<paste dialog action data here>' // slotToElicit or welcomeMessage

const agentTable = process.env['AGENT_TABLE'] || '<paste ddb table name here>'
const lex = new LexRuntimeV2Client({ region: process.env.AWS_REGION });

exports.handler = async (event: any, context: any, callback: any) => {

  console.log(`Lambda is invoked with calldetails:\n ${JSON.stringify(event)}`);
  // console.log(`Lambda is invoked with context:\n ${JSON.stringify(context)}`);

  const response = generalResponse;

  try {
    switch (event.InvocationEventType) {
      case sa.invocationType.newInboundCall:
        speakAndGetDigit('Hello! Please enter 1 for general questions, enter 2 to speak to an agent.');
        break;

      case sa.invocationType.actionSuccessful:
        if (event.ActionData.Type == sa.actionType.speakAndGetDigits) {
          if (event.ActionData.ReceivedDigits == sa.handlerType.speakToAgent) {
            bridgeCall();
          }
          else if (event.ActionData.ReceivedDigits == sa.handlerType.generalQuestion) {
            await startBotSession();
            setConversationAction(`What question I can help answer?`);
          }
        }
        else if (event.ActionData.Type == sa.actionType.startBotConversation) {
          if (event.ActionData.IntentResult.SessionState.Intent.State == sa.botSessionState.fulfilled) {
            if (event.ActionData.IntentResult.SessionState.SessionAttributes.qnabot_qid == 'back-to-caller') {
              speakAndGetDigit('If you would like to speak to an agent, press 2; or hang up to terminate the call.');
            }
            else {
              setConversationAction(`Any other question I can help answer?`);
            }
          }
          else if (event.ActionData.IntentResult.SessionState.Intent.State == sa.botSessionState.failed) {
            speakAndGetDigit('Please enter 1 for general questions, enter 2 to speak to an agent.');
          }
        }
        break;

      case sa.invocationType.actionFailed:
        if (event.ActionData.Type == sa.actionType.callAndBridge &&
          [sa.callError.notAnswered, sa.callError.rejected].includes(event.ErrorType)) {
          // bridge to the next agent
          bridgeCall();
        }
        else /*if (event.ErrorType == sa.callError.alreadyBridged)*/ {
          response.Actions = [];
        }
        break;

      case sa.invocationType.hangUp:
        // clean up and release resources
        break;

      default:
        sa.speak.Parameters.Text = `Thanks for calling, goodbye!`;
        response.Actions = [sa.pause, sa.speak, sa.hangup];
        break;
    }
  } catch (error) {
    console.log(`Error occurred:\n ${JSON.stringify(error)}`);
  }

  console.log(`Sending response:\n ${JSON.stringify(response)}`);
  callback(null, response);


  function bridgeCall() {
    response.Actions = [sa.pause];
    sa.callAndBridgePSTNEndpoint.Parameters.CallerIdNumber = event.CallDetails.Participants[0].From;
    // add call transaction and status columns in DDB
    // find an available agent not have been reached in the transaction
    getAgentFromDB('1').then((val) => {
      sa.callAndBridgePSTNEndpoint.Parameters.Endpoints[0].Uri = `+${val}`;
      response.Actions.push(sa.callAndBridgePSTNEndpoint);
    });
  }

  async function startBotSession() {
    const input = {
      botAliasId: botAliasId,
      botId: botId,
      localeId: 'en_US',
      sessionId: event.CallDetails.Participants[0].CallId,
      sessionState: {
        SessionAttributes: {
          phoneNumber: event.CallDetails.Participants[0].From,
        },
        intent: {
          name: intent,
        },
        dialogAction: { type: dialogActionType, slotToElicit: dialogActionData },
      },
    };

    if (dialogActionType == sa.botDialogActionType.elicitIntent) {
      // set welcome message
    }

    await lex.send(new PutSessionCommand(input));
  }

  function setConversationAction(prompt: string) {
    const arnTokens = context.invokedFunctionArn.split(':');
    const botAliasArn = `arn:${arnTokens[1]}:lex:${process.env.AWS_REGION}:${arnTokens[4]}:bot-alias/${botId}/${botAliasId}`;
    console.log(`Bot alias: ${botAliasArn}`);
    sa.speak.Parameters.Text = prompt;
    sa.startBotConversation.Parameters.BotAliasArn = botAliasArn;
    sa.startBotConversation.Parameters.Configuration.SessionState.SessionAttributes.phoneNumber = event.CallDetails.Participants[0].From;
    response.Actions = [sa.pause, sa.speak, sa.startBotConversation];
  }

  function speakAndGetDigit(prompt: string) {
    sa.speakAndGetDigits.Parameters.SpeechParameters.Text = prompt;
    sa.speakAndGetDigits.Parameters.CallId = event.CallDetails.Participants[0].CallId;
    response.Actions = [sa.pause, sa.speakAndGetDigits];
  }

};


interface smaAction {
  Type: string;
  Parameters: {};
};

interface smaActions extends Array<smaAction> { };

interface smaResponse {
  SchemaVersion: string;
  Actions: smaActions;
  TransactionAttributes?: Object;
};

const generalResponse: smaResponse = {
  SchemaVersion: '1.0',
  Actions: [],
};

async function getAgentFromDB(agentId: string) {
  const dynamo = new DynamoDB.DocumentClient();
  const params: DynamoDB.DocumentClient.GetItemInput = {
    TableName: agentTable,
    Key: { AgentId: agentId }
  };

  const result = await dynamo.get(params).promise();
  console.log(`Agent DDB record: ${JSON.stringify(result.Item)}\n${result.Item?.AgentNumber}`);
  return result.Item?.AgentNumber;
}
