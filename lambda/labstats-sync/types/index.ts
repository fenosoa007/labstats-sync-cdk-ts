interface RoomStationGroups {
  pc?: number[];
  pods?: number[];
}

interface BuildingRooms {
  [buildingName: string]: RoomStationGroups;
}

interface CampusBuildings {
  [campusName: string]: BuildingRooms;
}

interface USydCampuses {
  [uSydCampusName: string]: CampusBuildings;
}

interface Station {
  id: number;
}
interface GroupStationsResponse {
  results: Station[];
}
interface GroupStatusResponse {
  offline: number;
  on: number;
  busy: number;
}

enum StationStatus {
  IN_USE = "in_use",
  POWERED_ON = "powered_on",
  OFFLINE = "offline",
}

interface Pod {
  stationId: number;
  stationStatus: StationStatus;
}

interface RoomStation {
  campus: string;
  building: string;
  room: string;
  available: number;
  busy: number;
  offline: number;
  availablePods: number;
  busyPods: number;
  offlinePods: number;
  pods: Pod[];
}
