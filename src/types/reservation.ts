export interface PassengerReceiptResponse {
  success: boolean;
  message: string;
  data: PassengerReceiptEntry[];
}

export type PassengerReceiptEntry = ReceiptEntry | CancelledTicketEntry;

export interface ReceiptEntry {
  dispatch_id: number;
  ticket_number: string;
  ticket_status: string;
  number_of_seats_avail: string;
  passenger_full_name: string;
  passenger_gender: string;
  driver_full_name: string;
  tricycle_number: string;
  dispatcher_full_name: string;
  seat_positions: string;
  passenger_fare: string;
  total_amount: string;
  payment_method: string;
  transaction_date: string;
  receipt_id: number;
  reference_no: string;
  created_at: string;
}

export interface CancelledTicketEntry {
  dispatch_id: number;
  ticket_number: string;
  passenger_full_name: string;
  driver_full_name: string;
  dispatcher_full_name: string;
  ticket_reference_no: string;
  tricycle_number: string;
  ticket_status: "cancelled";
  number_of_seats_avail: string;
  note: string;
  created_at: string;
}
