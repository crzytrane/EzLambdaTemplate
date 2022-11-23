import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Code, Runtime } from "aws-cdk-lib/aws-lambda";
import { Table } from "aws-cdk-lib/aws-dynamodb";

export type ApplicationZone = {
  zoneName: string;
  zoneId: string;
};

export type Domain = {
  url: string;
  certificateArn: string;
  zone: ApplicationZone;
};

export type OIDC = {
  authority: string;
  client: string;
};

export type ApplicationConstructProps = {
  domain?: Domain;
  applicationPath: string;
  oidc?: OIDC;
};

export class ApplicationConstruct extends Construct {
  public handler: cdk.aws_lambda.Function;
  public distribution: cdk.aws_cloudfront.Distribution;

  constructor(scope: Construct, id: string, props: ApplicationConstructProps) {
    super(scope, `${id}_ApplicationConstruct`);

    const sourcePath = Code.fromAsset(props.applicationPath);

    const table1 = new Table(this, `${id}_table`, {
      billingMode: cdk.aws_dynamodb.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: "myid",
        type: cdk.aws_dynamodb.AttributeType.STRING,
      },
    });

    this.handler = new lambda.Function(this, `${id}_lambda`, {
      code: sourcePath,
      handler: "EzLambda",
      runtime: Runtime.DOTNET_6,
      environment: {
        EzLambda_table_1: table1.tableName,
      },
    });

    if (props.oidc?.authority && props.oidc?.client) {
      this.handler.addEnvironment(
        "EzLambda_auth__oidc__authority",
        props.oidc?.authority
      );
      this.handler.addEnvironment(
        "EzLambda_auth__oidc__client",
        props.oidc?.client
      );
    }

    const lambdaUrl = new lambda.FunctionUrl(this, `${id}_url`, {
      function: this.handler,
      authType: lambda.FunctionUrlAuthType.NONE,
      cors: { allowedOrigins: ["*"] },
    });

    const distribution = new cdk.aws_cloudfront.Distribution(
      this,
      `${id}_cloudfront`,
      {
        defaultBehavior: {
          origin: new cdk.aws_cloudfront_origins.HttpOrigin(
            cdk.Fn.select(2, cdk.Fn.split("/", lambdaUrl.url))
          ),
          viewerProtocolPolicy:
            cdk.aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          allowedMethods: cdk.aws_cloudfront.AllowedMethods.ALLOW_ALL,
        },
        domainNames: props.domain ? [props.domain.url] : undefined,
        certificate: props.domain
          ? cdk.aws_certificatemanager.Certificate.fromCertificateArn(
              this,
              `${id}_certificateArn`,
              props.domain.certificateArn
            )
          : undefined,
        additionalBehaviors: {
          "/static/*": {
            origin: new cdk.aws_cloudfront_origins.HttpOrigin(
              cdk.Fn.select(2, cdk.Fn.split("/", lambdaUrl.url))
            ),
            viewerProtocolPolicy:
              cdk.aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            allowedMethods: cdk.aws_cloudfront.AllowedMethods.ALLOW_ALL,
          },
        },
      }
    );

    if (props.domain) {
      const zone = cdk.aws_route53.HostedZone.fromHostedZoneAttributes(
        this,
        `${this}_zone`,
        {
          zoneName: props.domain.zone.zoneName,
          hostedZoneId: props.domain.zone.zoneId,
        }
      );
      const target = new cdk.aws_route53_targets.CloudFrontTarget(distribution);
      new cdk.aws_route53.ARecord(this, `${id}_dns`, {
        target: cdk.aws_route53.RecordTarget.fromAlias(target),
        zone,
        recordName: props.domain.url,
      });
    }

    new cdk.CfnOutput(this, `${id}_output-url`, {
      value: props.domain
        ? `https://${props.domain.url}`
        : `https://${distribution.domainName}`,
      description: "User friendly url",
    });
  }
}
