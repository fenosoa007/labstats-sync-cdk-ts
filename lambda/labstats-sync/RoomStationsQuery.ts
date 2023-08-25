import RoomStationService from "./services/RoomStationService";
// import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda'; // Assuming you have the aws-lambda types installed

export const handler = async (event: any) => {
  console.log(event);
  const roomStationService: RoomStationService = new RoomStationService(
    process.env.DYNAMO_TABLE_NAME,
  );

  try {
    const roomStations = await roomStationService.getLatestRoomStations();
    return roomStations;
  } catch (e) {
    console.log("Error getting RoomStations from DynamoDB", e);
  }
};
