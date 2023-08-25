// import {  APIGatewayProxyEvent,  APIGatewayProxyResult,  Context} from "aws-lambda";
import { LabStatsClientService } from "./services/LabStatsClientService";
import RoomStationService from "./services/RoomStationService";
import labstats from "./labstats.json";
export const handler = async (event: any) => {
  console.log({ event });
  const dao = new RoomStationService(process.env.DYNAMO_TABLE_NAME);
  const labStatsClient = new LabStatsClientService(
    process.env.LABSTATS_API,
    process.env.LABSTATS_API_KEY,
  );
  var uSydCampuses: USydCampuses;
  try {
    uSydCampuses = labstats as USydCampuses;
  } catch (e) {
    console.log("Error opening labstats.json", e);
    throw new Error("Error opening labstats.json");
  }

  try {
    const roomStations = await labStatsClient.getLabStatsRoomStations(
      uSydCampuses,
    );
    await dao.insert(roomStations);
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "LabStats data synced to DynamoDB successfully",
      }),
    };
  } catch (e) {
    console.log("Error syncing LabStats to DynamoDB", e);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error syncing LabStats to DynamoDB" }),
    };
  }
};
