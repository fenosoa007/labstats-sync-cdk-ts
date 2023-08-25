import { Construct } from "constructs";
import * as path from "path";
import * as cdk from "aws-cdk-lib";
import * as ssm from "aws-cdk-lib/aws-ssm";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambda_nodejs from "aws-cdk-lib/aws-lambda-nodejs";

interface ApiLambdaStackProps extends cdk.StackProps {
  envVars: { [key: string]: any };
}

export class LabStatsSyncLambdaStack extends cdk.Stack {
  public readonly apiLambda: lambda.Function;

  constructor(scope: Construct, id: string, props: ApiLambdaStackProps) {
    super(scope, id, props);
    const prefix = props.envVars.RESOURCE_PREFIX;

    const lambdaDir = path.join(__dirname, "..", "lambda");

    this.apiLambda = new lambda_nodejs.NodejsFunction(
      this,
      `${prefix}APILambda`,
      {
        functionName: `${prefix}APILambda`,
        description:
          "Lambda function to operate as a medium between API Gateway and LabStats",
        environment: {
          CORS_ALLOWED_ORIGINS: props.envVars.CORS_ALLOWED_ORIGINS.join(","),
          RESOURCE_PREFIX: props.envVars.RESOURCE_PREFIX,
          LABSTATS_API: props.envVars.LABSTATS_API,
          LABSTATS_API_KEY: props.envVars.LABSTATS_API_KEY,
          REGION: props.envVars.REGION,
          DYNAMO_TABLE_NAME: props.envVars.DYNAMO_TABLE_NAME,
        },
        entry: path.join(lambdaDir, "labstats-sync", "LabStatsSync.ts"),
        runtime: lambda.Runtime.NODEJS_16_X,
        handler: "handler",
        timeout: cdk.Duration.seconds(10),
      },
    );
    this.apiLambda.addToRolePolicy(
      new cdk.aws_iam.PolicyStatement({
        effect: cdk.aws_iam.Effect.ALLOW,
        resources: ["*"],
        actions: ["lambda:InvokeFunction", "dynamodb:*", "sqs:*"],
      }),
    );
    new ssm.StringParameter(this, "ParamLambdaSyncArn", {
      parameterName: props.envVars.PARAMETER_LAMBDA_SYNC_ARN,
      stringValue: this.apiLambda.functionArn,
      description: `SYNC Lambda ARN for ${prefix}`,
    });
  }
}
