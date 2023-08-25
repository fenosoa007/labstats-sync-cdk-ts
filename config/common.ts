import { Constants } from "@usyd/cdk-constructs";

export const vars: Record<string, any> = {
  REGION: "ap-southeast-2",
  APP_ABBREVIATION: "lbst",

  // CodeBuild - infra
  BASE_REPO_NAME: "node",
  BASE_REPO_TAG: "latest",
  CODE_PATH_INFRA: "infra",
  BUILD_TRIGGER_PATH_INFRA: "^infra/.*$",

  // CodeBuild - app
  CODE_PATH_APP: "app",
  BUILD_TRIGGER_PATH_APP: "^app/.*$",

  // Bitbucket
  BITBUCKET_OWNER: "sydneyuni",
  BITBUCKET_REPO: "labstats",
  PARENT_VPC_STACK: "ictdevawsvpc",

  // Environment Parameters
  PARAMETER_SYNC_LAMBDA_ARN: "/labstats/lambda/sync/arn",
  PARAMETER_GET_LAMBDA_ARN: "/labstats/lambda/get/arn",
  PARAMETER_DYNAMO_TABLE_NAME: "/labstats/dynamo/table/name",
  PARAMETER_DYNAMO_TABLE_ARN: "/labstats/dynamo/table/arn",
  PARAMETER_LABSTATS_API: "/labstats/api/url", //"https://sea-api.labstats.com",
  PARAMETER_LABSTATS_API_KEY: "/labstats/api/key", //"c120c47a-63cc-402c-9491-8fba2f66aa1f",
  DYNAMO_TABLE_NAME: "LabStatsTable",
};
