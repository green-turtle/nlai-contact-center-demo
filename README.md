# Amazon Chime SDK PSTN Lex Bot Contact Center

## What is the Amazon Chime SDK?

The Amazon Chime SDK is a set of real-time communications components that developers can use to quickly add messaging, audio, video, and screen sharing capabilities to their web or mobile applications.  There are three core parts of the SDK:

* Media Services (real-time audio and video, including SDKs for web and mobile)
* Messaging (server and client-side persistent messaging)
* Public Switched Telephone Network (PSTN) Audio capabilities (phone calls/telephony)

By using the Amazon Chime SDK, developers can help reduce the cost, complexity, and friction of creating and maintaining their own real-time communication infrastructure and services.  In addition, those applications can easily take advantage of advanced voice technologies enabled by machine learning.  [Amazon Voice Focus](https://aws.amazon.com/about-aws/whats-new/2020/08/amazon-chime-introduces-amazon-voice-focus-for-noise-suppression/) for PSTN provides deep learning based noise suppression to reduce unwanted noise on calls.  Use text-to-speech in your application through our native integration to [Amazon Polly](https://aws.amazon.com/polly/) or build real-time phone-call voice chat-bots using native integration with [Amazon Lex](https://aws.amazon.com/lex/).

## What is PSTN Audio?

With PSTN Audio, developers can build custom telephony applications using the agility and operational simplicity of a serverless AWS Lambda function.  Your Lambda functions control the behavior of phone calls, such as playing voice prompts, collecting digits, recording calls, routing calls to the PSTN and Session Initiation Protocol (SIP) devices using Amazon Chime Voice Connector. The following topics provide an overview and architectural information about the PSTN Audio service, including how to build Lambda functions to control calls. You can read our introduction of the service [here](https://docs.aws.amazon.com/chime/latest/dg/build-lambdas-for-sip-sdk.html).

PSTN Audio applications are serverless, deployed as [AWS Lambda functions](https://aws.amazon.com/lambda/).  If you can write relatively simple code in javascript or python then you can build an advanced telephony application. 

## What's New in PSTN Audio?

* native integration with Amazon Polly (text-to-speech)
* native integration with Amazon Lex (speech-to-text voice bots)
* native integration with Amazon Voice Focus (noise reduction)
* TransactionAttributes to simplify tracking simple call state

# What to Do First

From the command line (terminal) do the following:

```bash
git clone https://github.com/green-turtle/nlai-contact-center.git
cd ai-contact-center
```

You are now in the root of the code repository.  You can quickly deploy the resources and an example application by this:

```bash
rm '/usr/local/bin/jq'
brew install jq

npm install typescript@latest ts-node@latest
npm install aws-cdk-lib
npm install @aws-sdk/client-chime
npm install @aws-sdk/client-lex-runtime-v2 
npm install @aws-sdk/client-lex-models-v2

make sure tsconfig.json libs section includes "dom"

cdk bootstrap (if CDKToolkit stack not exists, make sure cdk-hnb659fds-assets-ACCOUNT-REGION not exist to run CDK Bootstrap)
yarn deploy
```

That's it.  Just wait for it to finish.  The output will look something like this:

```bash
✅  AIContactCenterStack

✨  Deployment time: 204.06s

Outputs:
AIContactCenterStack.logGroup = /aws/lambda/AIContactCenterStack-smaLambdaF902F845-2OyCzDJoVbjY
AIContactCenterStack.phoneNumber = +15055551212
AIContactCenterStack.smaHandlerArn = arn:aws:lambda:us-east-1:<acct number>:function:AIContactCenter-smaLambdaF902E845-2OyCzDJoVbjY
AIContactCenterStack.smaHandlerName = AIContactCenter-smaLambdaF912E835-2OyCzDJoVbjY
AIContactCenterStack.smaId = d408563b-4a60-4df7-bd59-82660adb1928
Stack ARN:
arn:aws:cloudformation:us-east-1:<acct number>:stack/AIContactCenter/213ac5d0-9df7-11ec-99d6-12f8bc0d6961

✨  Total time: 212.9s

✨  Done in 223.78s.
```

## What Phone Number?

```bash
yarn number
```
It should look something like this:

```bash
yarn run v1.22.17
$ scripts/number
+1505-555-1212
✨  Done in 0.13s.
```


## Cleanup

Deploying resources from this repository will create CloudFormation stacks.  To remove those running resources you can simply delete the stack.  To do that, you can type "yarn destroy" in the folder where you deployed the resources with "yarn deploy."  

NOTE:  since each of the example lessons in the "lambda" lessons deploys it's own small stack for just that lambda, to completely clean up those resources you should also run "yarn destroy" from each folder where you deploy the lambda.

## Disclaimers

Deploying the Amazon Chime SDK demo applications contained in this repository will cause your AWS Account to be billed for services, including the Amazon Chime SDK, used by the application.  

The voice prompt audio files are not encrypted, as would be recommended in a production-grade application.

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

All code in this repository is licensed under the MIT-0 License. See the LICENSE file.

Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: MIT-0