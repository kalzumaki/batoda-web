import AddOfficerModal from "./AddOfficerModal";
import ScheduleMeeting from "./schedule_meeting";
import UsersGenerateQRModal from "./UsersGenerateQrModal";

export default function SubHeaderButton() {
  return (
 <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 py-4">
      <AddOfficerModal />
      <ScheduleMeeting />
      <UsersGenerateQRModal />

    </div>
  );
}
