import { Constants } from "@usyd/cdk-constructs";
import { vars as commonVars } from "./common";

const domainZone = "myuni.edu.au";
const domainPrefix = "labstats";
const domainName = `${domainPrefix}.${domainZone}`;

export const vars: Record<string, any> = {
  ...commonVars,
  ACCOUNT: Constants.ACCOUNT.CODERS,
  RESOURCE_PREFIX: `${commonVars["APP_ABBREVIATION"]}CICDcoders}`,
  NODE_ENV: "development",
  CORS_ALLOWED_ORIGINS: [
    `https://${domainName.toLowerCase()}`,
    "http://localhost:3000"
  ],
  BITBUCKET_BRANCH: "coders"
};
