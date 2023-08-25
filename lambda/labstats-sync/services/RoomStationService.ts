import * as AWS from "aws-sdk";
import { AttributeValue } from "aws-sdk/clients/dynamodb";

export default class RoomStationService {
  private readonly dynamoDB: AWS.DynamoDB.DocumentClient =
    new AWS.DynamoDB.DocumentClient();
  private readonly tableName: string;
  static readonly HASH = "Id";
  static readonly RANGE = "SyncDate";
  private static readonly VALUE = "JSON";
  private readonly dateFormat = "yyyy-MM-dd/HH-mm";

  constructor(tableName: string) {
    this.tableName = tableName;
    if (!tableName) {
      throw new Error("No DynamoDB Table Name specified");
    }
  }

  async insert(item: RoomStation[]): Promise<void> {
    const values: { [key: string]: AttributeValue } = {};
    values[RoomStationService.HASH] = { N: "0" };
    values[RoomStationService.RANGE] = {
      S: new Date().toISOString(),
    };
    values[RoomStationService.VALUE] = {
      S: JSON.stringify(item),
    };

    try {
      const result = await this.dynamoDB
        .put({ TableName: this.tableName, Item: values })
        .promise();

      if (result.$response.httpResponse.statusCode !== 200) {
        throw new Error(
          `Error inserting RoomStations into DynamoDB: ${result.$response.requestId}`,
        );
      }
    } catch (err) {
      throw new Error(`Error inserting RoomStations into DynamoDB: ${err}`);
    }
  }

  async getLatestRoomStations(): Promise<RoomStation[]> {
    const result = await this.dynamoDB
      .query({
        TableName: this.tableName,
        Limit: 1,
        ScanIndexForward: false,
        ProjectionExpression: RoomStationService.VALUE,
        KeyConditionExpression: `${RoomStationService.HASH} = :v_k AND ${RoomStationService.RANGE} <= :v_r`,
        ExpressionAttributeValues: {
          ":v_k": { N: "0" },
          ":v_r": { S: this.getDateKey() },
        },
      })
      .promise();

    if (
      result.$response.httpResponse.statusCode !== 200 ||
      result.Count === undefined ||
      result.Count <= 0
    ) {
      throw new Error(
        `Error querying RoomStations from DynamoDB: ${result.$response.requestId}`,
      );
    }

    return result.Items?.[0]?.[RoomStationService.VALUE]?.S || "[]";
  }

  getDateFormat(date: Date): string {
    return new Intl.DateTimeFormat("en", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }

  getDateKey(date?: Date): string {
    const currentDate = date || new Date();
    return currentDate.toISOString();
  }
}
