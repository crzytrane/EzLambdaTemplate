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

    new ApplicationConstruct(this, `${id}_temp`, {
      applicationPath: path.join(
        __dirname,
        "../../src/bin/Release/net6.0/publish"
      ),
    });
  }
}
