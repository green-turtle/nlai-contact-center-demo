// import * as cdk from 'aws-cdk-lib';
// import { Template } from 'aws-cdk-lib/assertions';
// import { CallCenterStack } from '../lib/nlai-call-center-stack';

// // example test. To run these tests, uncomment this file along with the
// // example resource in lib/nlai-call-center-stack.ts
// test('SQS Queue Created', () => {
//     const app = new cdk.App();
//     // WHEN
//     const stack = new CallCenterStack(app, 'MyCallCenterStack', {
//         env: { account: '123456789012', region: 'us-east-1' },
//         chimeInfo: { phoneNumber: '', phoneState: 'MD' },
//         botInfo: { id: '321', alias: 'abc' },
//     });
//     // THEN
//     const template = Template.fromStack(stack);

//     template.hasResourceProperties('AWS::SQS::Queue', {
//         VisibilityTimeout: 300
//     });
// });
