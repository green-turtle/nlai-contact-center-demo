export const voiceFocus = {
    Type: 'VoiceFocus',
    Parameters: {
        Enable: true,
        CallId: ''
    }
}

export const speak = {
    Type: 'Speak',
    Parameters: {
        Engine: 'neural',      // Required. Either standard or neural
        LanguageCode: 'en-US', // Optional
        Text: 'Thanks for calling, goodbye!',  // Required
        TextType: 'text',      // Optional. Defaults to text
        VoiceId: 'Joanna'      // Required
    }
}

export const speakAndGetDigits = {
    Type: 'SpeakAndGetDigits',
    Parameters: {
        CallId: 'call-id-1',          // required
        InputDigitsRegex: '^[1-2]$', // optional
        SpeechParameters: {
            Text: 'Hello! Please enter 1 for general questions, enter 2 to speak to an agent.',      // required
            Engine: 'neural',         // optional. Defaults to standard
            LanguageCode: 'en-US',    // optional
            TextType: 'text',         // optional
            VoiceId: 'Joanna'         // optional. Defaults to Joanna
        },
        FailureSpeechParameters: {
            Text: `You've entered a wrong number, please try again.`,      // required
            Engine: 'neural',         // optional. Defaults to the Engine value in SpeechParameters
            LanguageCode: 'en-US',    // optional. Defaults to the LanguageCode value in SpeechParameters
            TextType: 'text',         // optional. Defaults to the TextType value in SpeechParameters
            VoiceId: 'Joanna'         // optional. Defaults to the VoiceId value in SpeechParameters
        },
        MinNumberOfDigits: 1,         // optional
        MaxNumberOfDigits: 1,         // optional
        TerminatorDigits: ['#'],      // optional
        InBetweenDigitsDurationInMilliseconds: 5000,  // optional
        Repeat: 3,                    // optional
        RepeatDurationInMilliseconds: 10000           // required
    }
}

export const pause = {
    Type: 'Pause',
    Parameters: {
        DurationInMilliseconds: '1000'
    }
}

export const hangup = {
    Type: 'Hangup',
    Parameters: {
        SipResponseCode: '0',
        ParticipantTag: ''
    }
}

export const playAudio = {
    Type: 'PlayAudio',
    Parameters: {
        ParticipantTag: 'LEG-A',
        AudioSource: {
            Type: 'S3',
            BucketName: 'bucket-name',
            Key: 'audio-file.wav'
        }
    }
}

export const playAudioAndGetDigits = {
    Type: 'PlayAudioAndGetDigits',
    Parameters: {
        CallId: 'call-id-1',
        ParticipantTag: 'LEG-A',
        InputDigitsRegex: '^\d{2}#$',
        AudioSource: {
            Type: 'S3',
            BucketName: 'bucket-name',
            Key: 'audio-file-1.wav'
        },
        FailureAudioSource: {
            Type: 'S3',
            BucketName: 'bucket-name',
            Key: 'audio-file-failure.wav'
        },
        MinNumberOfDigits: 3,
        MaxNumberOfDigits: 5,
        TerminatorDigits: ['#'],
        InBetweenDigitsDurationInMilliseconds: 5000,
        Repeat: 3,
        RepeatDurationInMilliseconds: 10000
    }
}

export const receiveDigits = {
    Type: 'ReceiveDigits',
    Parameters: {
        CallId: 'call-id-1',
        ParticipantTag: 'LEG-A',
        InputDigitsRegex: '^\d{2}#$',
        InBetweenDigitsDurationInMilliseconds: 1000,
        FlushDigitsDurationInMilliseconds: 10000
    }
}

export const sendDigits = {
    Type: 'SendDigits',
    Parameters: {
        CallId: 'call-id-1',
        Digits: ',,*1234,56,7890ABCD#',
        ToneDurationInMilliseconds: 100
    }
}

export const recordAudio = {
    Type: 'RecordAudio',
    Parameters: {
        DurationInSeconds: '10',
        RecordingTerminators: ['#'],
        RecordingDestination: {
            Type: 'S3',
            BucketName: 'bucket-name'
        }
    }
}

export const startCallRecording = {
    Type: 'StartCallRecording',
    Parameters: {
        CallId: 'call-id-1',
        Track: 'BOTH',
        Destination: {
            Type: 'S3',
            Location: 'valid-bucket-name-and-optional-prefix'
        }
    }
}

export const pauseCallRecording = {
    Type: 'PauseCallRecording',
    Parameters: {
        CallId: 'call-id-1'
    }
}

export const resumeCallRecording = {
    Type: 'ResumeCallRecording',
    Parameters: {
        CallId: 'call-id-1'
    }
}

export const callAndBridgePSTNEndpoint = {
    Type: 'CallAndBridge',
    Parameters: {
        CallTimeoutSeconds: 60,
        CallerIdNumber: 'e164PhoneNumber',
        Endpoints: [{
            BridgeEndpointType: 'PSTN',
            Uri: 'e164PhoneNumber'
        }]
    }
}

export const callAndBridgeVoiceConnector = {
    Type: 'CallAndBridge',
    Parameters: {
        CallTimeoutSeconds: 60,
        CallerIdNumber: 'e164PhoneNumber',
        RingbackTone: {
            Type: 'S3',
            BucketName: 's3_bucket_name',
            Key: 'audio_file_name'
        },
        Endpoints: [{
            BridgeEndpointType: 'AWS',
            Arn: 'arn:aws:chime:us-east-1:0123456789101:vc/abcdefg1hijklm2nopq3rs', // voice connector or connector group arn
            Uri: 'ValidString',
        }],
        SipHeaders: {
        }
    }
}

export const joinChimeMeeting = {
    Type: 'JoinChimeMeeting',
    Parameters: {
        JoinToken: 'meeting-attendee-join-token',
        CallId: 'call-id-1',
        participantTag: 'LEG-A',
        MeetingId: 'meeting-id'
    }
}

export const modifyChimeMeetingAttendees = {
    Type: 'ModifyChimeMeetingAttendees',
    Parameters: {
        Operation: 'Mute',
        MeetingId: 'meeting-id',
        CallId: 'call-id',
        ParticipantTag: 'LEG-B',
        AttendeeList: ['attendee-id-1', 'attendee-id-2']
    }
}

export const startBotConversation = {
    Type: 'StartBotConversation',
    Parameters: {
        BotAliasArn: 'string',
        Configuration: {
            SessionState: {
                SessionAttributes: {
                    phoneNumber: '',
                },
            },
        },
    }
}

// Chime SDK StartBotConversation only supports ElicitIntent and Delegate
// export const startBotConversation = {
//     Type: 'StartBotConversation',
//     Parameters: {
//         BotAliasArn: 'string',
//         LocaleId: 'en_US',
//         Configuration: {
//             SessionState: {
//                 SessionAttributes: {
//                     phoneNumber: ''
//                 },
//                 DialogAction: {
//                     Type: 'ElicitSlot',
//                     SlotToElicit: 'qnaslot'
//                 }
//             }
//         }
//     }
// }


export const invocationType = {
    newInboundCall: 'NEW_INBOUND_CALL',
    ringing: 'RINGING',
    newOutboundCall: 'NEW_OUTBOUND_CALL',
    callAnswered: 'CALL_ANSWERED',
    actionSuccessful: 'ACTION_SUCCESSFUL',
    digitsReceived: 'DIGITS_RECEIVED',
    callUpdateRequested: 'CALL_UPDATE_REQUESTED',
    hangUp: 'HANGUP',
    actionFailed: 'ACTION_FAILED',
    actionInterrupted: 'ACTION_INTERRUPTED',
    invalidLambdaResponse: 'INVALID_LAMBDA_RESPONSE'
}

export const actionType = {
    speakAndGetDigits: 'SpeakAndGetDigits',
    receiveDigits: 'ReceiveDigits',
    voiceFocus: 'VoiceFocus',
    startBotConversation: 'StartBotConversation',
    callAndBridge: 'CallAndBridge'
}

export const handlerType = {
    generalQuestion: '1',
    speakToAgent: '2'
}

export const botSessionState = {
    fulfilled: 'Fulfilled',
    failed: 'Failed',
}

export const callError = {
    notAnswered: 'CallNotAnswered',
    rejected: 'CallRejected',
    alreadyBridged: 'CallAlreadyBridged',
    invalidNumberOfCallLegs: 'InvalidNumberOfCallLegs',
}

export const botDialogActionType = {
    elicitSlot: 'ElicitSlot',
    elicitIntent: 'ElicitIntent',
}