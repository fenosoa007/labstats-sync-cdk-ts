import axios from "axios";

export class LabStatsClientService {
  private readonly labStatsApiKey: string;
  private readonly apiUrl: string;

  constructor(apiUrl: string, labstatsapikey: string) {
    this.labStatsApiKey = labstatsapikey;
    this.apiUrl = apiUrl;
  }

  async getLabStatsRoomStations(
    uSydCampuses: USydCampuses,
  ): Promise<RoomStation[]> {
    const roomStations: RoomStation[] = [];
    for (const [campusKey, campusBuildings] of Object.entries(uSydCampuses)) {
      for (const [buildingKey, buildingRooms] of Object.entries(
        campusBuildings,
      )) {
        for (const [roomKey, roomStationGroups] of Object.entries(
          buildingRooms,
        )) {
          let on = 0;
          let busy = 0;
          let offline = 0;
          if (roomStationGroups.pc)
            for (const pcGroup of roomStationGroups.pc) {
              const response = await this.getLabStatsGroupStatus(pcGroup);
              on += response.on;
              busy += response.busy;
              offline += response.offline;
            }
          const pods: Pod[] = [];
          let onPods = 0;
          let busyPods = 0;
          let offlinePods = 0;
          if (roomStationGroups.pods)
            for (const podGroup of roomStationGroups.pods) {
              const response = await this.getLabStatsGroupStatus(podGroup);
              onPods += response.on;
              busyPods += response.busy;
              offlinePods += response.offline;
            }
          var roomStation: RoomStation = {
            campus: campusKey,
            building: buildingKey,
            room: roomKey,
            available: on,
            busy,
            offline,
            availablePods: onPods,
            busyPods,
            offlinePods,
            pods,
          };
          roomStations.push(roomStation);
        }
      }
    }
    return roomStations;
  }

  async getLabStatsGroupStatus(groupId: number): Promise<GroupStatusResponse> {
    const uri = `${this.apiUrl}/groups/${groupId}/status`;

    const res = await axios<GroupStatusResponse>(uri, {
      headers: {
        Authorization: this.labStatsApiKey,
      },
    });
    return res.data;
  }
}
