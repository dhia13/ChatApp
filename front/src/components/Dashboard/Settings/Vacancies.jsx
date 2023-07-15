import { Button } from "@carbon/react";
import { DatePicker, Spin } from "antd";
import { useState } from "react";
import { getVacations, updateVacation } from "../../../utils/api/user";
import { format } from "date-fns";

const Vacancies = ({ Vacancies, setVacation, token }) => {
  const { RangePicker } = DatePicker;
  const [vacationDate, setVacationDate] = useState();
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const handleAddVacation = async () => {
    setLoadingUpdate(true);
    await updateVacation(token, vacationDate).then((res) => {
      setLoadingUpdate(false);
      setLoadingFetch(true);
      const getData = async () => {
        await getVacations(token).then((res) => {
          setVacation(res);
          setLoadingFetch(false);
        });
      };
      getData();
    });
  };
  return (
    <div className="flex justify-start items-start flex-col gap-2">
      <p>Add vacation</p>
      <div className="flex justify-center items-center gap-4">
        <RangePicker onChange={(e) => setVacationDate([e[0].$d, e[1].$d])} />
        {loadingUpdate ? (
          <Spin size="small" /> // Show the spinning circle when loading
        ) : (
          <Button onClick={() => handleAddVacation()}>Add</Button>
        )}
      </div>
      <div>vacation History</div>
      <div className="w-full h-[300px] overflow-y-auto">
        {Vacancies?.length > 0 &&
          Vacancies.map((vacation, i) => {
            return (
              <div key={i}>
                <p>
                  From {formatDate(vacation[0])} to {formatDate(vacation[1])}
                </p>
              </div>
            );
          })}
      </div>
    </div>
  );
};
export default Vacancies;
function formatDate(dateString) {
  const date = new Date(dateString);
  const formattedDate = format(date, "dd/MM/yyyy");
  return formattedDate;
}
