import AddOfficerModal from "./AddOfficerModal";
import ScheduleMeeting from "./schedule_meeting";
import UsersGenerateQRModal from "./UsersGenerateQrModal";

export default function SubHeaderButton() {
  return (
    <div className="flex justify-between items-center  py-4">
      <AddOfficerModal />
      <ScheduleMeeting />
      <UsersGenerateQRModal />

    </div>
  );
}
