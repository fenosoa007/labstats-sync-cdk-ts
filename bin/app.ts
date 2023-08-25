#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { IctUtils } from "@usyd/cdk-constructs";

import { EnvironmentVariables } from "../config";
import { LabStatsDynamoStack } from "../lib/dynamodb";
import { LabStatsSyncLambdaStack } from "../lib/synclambda";
import { LabStatsGetLambdaStack } from "../lib/getlambda";
const app = new cdk.App();
const account =
  app.node.tryGetContext("account") || process.env.CDK_DEFAULT_ACCOUNT;
console.log({ account });
const envVars = EnvironmentVariables(account);

const tagProps = {
  app: envVars.APP_ABBREVIATION,
  repoName: envVars.BITBUCKET_REPO,
};

const dynamoDBStack = new LabStatsDynamoStack(app, "LabStatsDynamoStack", {
  env: {
    account: envVars.ACCOUNT,
    region: envVars.REGION,
  },
  description: "LabStats Dynamo DB resources",
  envVars,
  stackName: `${envVars.RESOURCE_PREFIX}Dynamo`,
});

const syncLambdaStack = new LabStatsSyncLambdaStack(
  app,
  "LabStatsSyncLambdaStack",
  {
    env: {
      account: envVars.ACCOUNT,
      region: envVars.REGION,
    },
    description: "LabStats Sync Lambda resources",
    envVars,
    stackName: `${envVars.RESOURCE_PREFIX}SyncLambda`,
  },
);
syncLambdaStack.addDependency(dynamoDBStack);

const getLambdaStack = new LabStatsGetLambdaStack(
  app,
  "LabStatsGetLambdaStack",
  {
    env: {
      account: envVars.ACCOUNT,
      region: envVars.REGION,
    },
    description: "LabStats Get Lambda resources",
    envVars,
    stackName: `${envVars.RESOURCE_PREFIX}GetLambda`,
  },
);
getLambdaStack.addDependency(dynamoDBStack);
