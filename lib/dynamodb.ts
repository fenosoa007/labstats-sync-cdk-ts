import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as ssm from "aws-cdk-lib/aws-ssm";

interface DynamoDBStackProps extends cdk.StackProps {
  envVars: { [key: string]: any };
}
export class LabStatsDynamoStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: DynamoDBStackProps) {
    super(scope, id, props);
    const prefix = `${props.envVars.RESOURCE_PREFIX}Dynamo`;

    const table = new dynamodb.Table(this, props.envVars.DYNAMO_TABLE_NAME, {
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });
    new ssm.StringParameter(this, "ParamDynamoTableName", {
      parameterName: props.envVars.PARAMETER_DYNAMO_TABLE_NAME,
      stringValue: table.tableName,
      description: `Dynamo Table Name for ${prefix}`,
    });
  }
}
