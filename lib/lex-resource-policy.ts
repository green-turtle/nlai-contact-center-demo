export const BotAccess = {
    Version: '2012-10-17',
    Statement: [
      {
        Sid: 'AllowChimePstnAudioUseBot',
        Effect: 'Allow',
        Principal: {
          Service: 'voiceconnector.chime.amazonaws.com',
        },
        Action: 'lex:StartConversation',
        Resource: `varLexArn`,
        Condition: {
          StringEquals: {
            'AWS:SourceAccount': `varAccountNumber`,
          },
          ArnEquals: {
            'AWS:SourceArn': `varVoiceConnectorAr:*`,
          },
        },
      },
    ],
  };