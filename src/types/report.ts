export interface ReportData {
  dispatch_id: number;
  passenger_count: number;
  scheduled_dispatch_time: string;
  actual_dispatch_time: string | null;
  dispatch_option: string | null;
  dispatcher: Dispatcher;
  driver: Driver;
  created_at: string;
}

export interface Dispatcher {
  user_id: number;
  name: string;
  email: string;
  mobile: string;
  total_collected_fare: number;
  dispatcher_share: number;
  batoda_share: number;
}

export interface Driver {
  user_id: number;
  name: string;
  email: string;
  mobile: string;
  tricycle_number: string;
}

export interface Report {
  status: boolean;
  data: ReportData[];
  generated_at: string;
}
