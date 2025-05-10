export interface BatodaLogs {
  status: boolean;
  data: BatodaLogsData[];
}

export interface BatodaLogsData {
  id: number;
  driver: string;
  dispatcher: string;
  balance: string;
  dispatcher_fare: string;
  dispatcher_share: string;
  date: string;
  time: string;
  created_at: string;
}

export interface TotalContribution {
  status: boolean;
  history: TotalContributionHistory[];
}

export interface TotalContributionHistory {
  month: string;
  total_contribution: number;
  total_dispatcher_share: number;
  total_batoda_share: number;
}

export interface DriversMostSales {
  status: boolean;
  message: string;
  drivers: DriversData[];
}

export interface DriversData {
  full_name: string;
  tricycle_number: string | null;
  ticket_count: number;
}
