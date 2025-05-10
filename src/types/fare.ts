export interface FareData {
  passenger_fare: string;
  dispatcher_fare: string;
  dispatcher_share_percent: number;
  batoda_share_percent: number;
}
export interface Fare {
  status: boolean;
  data: FareData;
}

export interface UpdateFarePayload {
  seat_fare: number;
  dispatcher_fare: number;
  dispatcher_share_percent: number;
  batoda_share_percent: number;
}

