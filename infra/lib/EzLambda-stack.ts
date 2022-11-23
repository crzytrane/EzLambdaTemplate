import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { ApplicationConstruct } from "../constructs/application-construct";
import * as path from "path";

export class EzLambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // new ApplicationConstruct(this, `${id}_stack`, {
    //   domain: {
    //     url: "test-thingy-2.crzytrane.com",
    //     certificateArn:
    //       "arn:aws:acm:us-east-1:645105341796:certificate/e1989655-6f21-431a-add0-050a0241622b",
    //     zone: {
    //       zoneName: "crzytrane.com",
    //       zoneId: "Z062379920K1UIAZ4P2UT",
    //     },
    //   },
    //   applicationPath: path.join(
    //     __dirname,
    //     "../../src/bin/Release/net6.0/publish"
    //   ),
    // });

    const userPool = new cdk.aws_cognito.UserPool(this, `${id}_userpool`, {
      selfSignUpEnabled: true,
      signInAliases: { email: true, username: false },
      standardAttributes: {
        email: { required: true, mutable: false },
        preferredUsername: { required: true },
        givenName: { required: true },
        familyName: { required: true },
      },
    });

    new cdk.aws_cognito.UserPoolResourceServer(this, `${id}_resourceserver`, {
      identifier: "EzLambda",
      userPool: userPool,
      scopes: [
        new cdk.aws_cognito.ResourceServerScope({
          scopeName: "user",
          scopeDescription: "Authenticated user",
        }),
      ],
    });

    const userPoolDomain = new cdk.aws_cognito.UserPoolDomain(
      this,
      `${id}_userpooldomain`,
      {
        userPool: userPool,
        cognitoDomain: {
          domainPrefix: "EzLambda".toLowerCase(),
        },
      }
    );

    const client = new cdk.aws_cognito.UserPoolClient(this, `${id}_client`, {
      userPool: userPool,
      preventUserExistenceErrors: true,
      oAuth: {
        flows: { authorizationCodeGrant: true },
        scopes: [
          cdk.aws_cognito.OAuthScope.EMAIL,
          cdk.aws_cognito.OAuthScope.OPENID,
        ],
        // logoutUrls:
        //   props.environment === "dev"
        //     ? [
        //         `http://localhost:9000/`,
        //         `https://${props.subDomain}.${props.domainName}/`,
        //       ]
        //     : [`https://${props.subDomain}.${props.domainName}/`],
        // callbackUrls:
        //   props.environment === "dev"
        //     ? [
        //         `http://localhost:9000/callback/`,
        //         `https://${props.subDomain}.${props.domainName}/callback/`,
        //       ]
        //     : [`https://${props.subDomain}.${props.domainName}/callback/`],
      },

      // check if this is ok
      authFlows: {
        userSrp: true,
      },
    });

    new ApplicationConstruct(this, `${id}_temp`, {
      applicationPath: path.join(
        __dirname,
        "../../src/bin/Release/net6.0/publish"
      ),
      oidc: {
        authority: `cognito-idp.${props?.env?.region}.amazonaws.com/${userPool.userPoolId}`,
        client: client.userPoolClientId,
      },
    });

    new cdk.CfnOutput(this, `${id}_userpool_output`, {
      value: userPool.userPoolId,
    });
  }
}
