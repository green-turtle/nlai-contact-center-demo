import { Construct } from 'constructs';
import { NestedStackProps, NestedStack } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as chime from 'cdk-amazon-chime-resources';
import { ChimeInfo } from './prop-type';


interface ChimeProps extends NestedStackProps {
  chimeInfo: ChimeInfo
  smaLambdaEndpointArn: string;
}

export class Chime extends NestedStack {
  public readonly phoneNumber: string;
  public readonly smaId: string;

  constructor(scope: Construct, id: string, props: ChimeProps) {
    super(scope, id, props);

    const phoneNumber = props.chimeInfo.phoneNumber.length == 0
      ? (new chime.ChimePhoneNumber(this, 'phoneNumber', {
        phoneState: props.chimeInfo.phoneState.length == 0 ? 'MD' : props.chimeInfo.phoneState,
        phoneNumberType: chime.PhoneNumberType.LOCAL,
        phoneProductType: chime.PhoneProductType.SMA,
      })).phoneNumber
      : props.chimeInfo.phoneNumber;

    const sipMediaApp = new chime.ChimeSipMediaApp(this, 'sipMediaApp', {
      region: this.region,
      endpoint: props.smaLambdaEndpointArn,
    });

    const sipRule = new chime.ChimeSipRule(this, 'sipRule', {
      triggerType: chime.TriggerType.TO_PHONE_NUMBER,
      triggerValue: phoneNumber,
      targetApplications: [{
        region: this.region,
        priority: 1,
        sipMediaApplicationId: sipMediaApp.sipMediaAppId,
      }]
    });

    const pstnPollyRole = new iam.Role(this, 'pstnPollyRole', {
      assumedBy: new iam.ServicePrincipal('voiceconnector.chime.amazonaws.com'),
    });
    pstnPollyRole.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: ['*'],
      actions: ['polly:SynthesizeSpeech'],
    }));


    this.phoneNumber = phoneNumber;
    this.smaId = sipMediaApp.sipMediaAppId;
  }
}
