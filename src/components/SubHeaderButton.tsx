import AddOfficerModal from "./AddOfficerModal";
import UsersGenerateQRModal from "./UsersGenerateQrModal";

export default function SubHeaderButton() {
  return (
    <div className="flex justify-between items-center  py-4">
      <AddOfficerModal />
      <UsersGenerateQRModal />
    </div>
  );
}
