import { TimePicker } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { AiOutlineCheck, AiOutlineClockCircle } from "react-icons/ai";
import { GrAdd } from "react-icons/gr";
import { IoIosRemoveCircleOutline, IoMdAdd } from "react-icons/io";
import { updateSettings } from "../../../utils/api/user";

const WorkingHours = ({ workingHours, token }) => {
  const [days, setDays] = useState(workingHours);
  const handleClickDay = (day) => {
    const newDays = days.map((d) => {
      if (d.day === day) {
        return { ...d, working: !d.working };
      }
      return d;
    });

    setDays(newDays);
  };
  const [selectedDay, setSelectedDay] = useState("sunday");
  const handleEditTime = (day) => {
    setSelectedDay(day);
  };
  const addInterval = (day) => {
    const newDays = days.map((d) => {
      if (d.day === day) {
        return { ...d, hours: [...d.hours, { from: "8:00", to: "12:00" }] };
      }
      return d;
    });

    setDays(newDays);
  };
  const removeInterval = (day, index) => {
    const newDays = days.map((d) => {
      if (d.day === day) {
        const updatedHours = d.hours.filter((_, i) => i !== index);
        return { ...d, hours: updatedHours };
      }
      return d;
    });
    setDays(newDays);
  };
  const changeInteralValue = (day, index, time) => {
    const handleChangeItem = (arr, i, time) => {
      const newArr = [...arr];
      newArr[i].from = `${time[0].$H}:${time[0].$m}`;
      newArr[i].to = `${time[1].$H}:${time[1].$m}`;
      return newArr;
    };
    const newDays = days.map((d) => {
      if (d.day === day) {
        return {
          ...d,
          hours: handleChangeItem(d.hours, index, time),
        };
      }
      return d;
    });

    setDays(newDays);
  };
  const handleSave = () => {
    updateSettings(token, days);
  };
  return (
    <div className="w-[80%] text-primary-text flex-center-col gap-2">
      <h1 className="text-lg font-medium my-1 self-start">
        Select Working Days
      </h1>
      <div className="flex justify-start items-start gap-4 flex-wrap">
        {days?.map((day) => (
          <button
            key={day.day}
            className={` flex justify-center items-center h-[44px] shadow-md rounded-md
             cursor-pointer gap-1 px-2 py-1 border-secondary-border border bg-secondary-bg`}
          >
            <p className="text-lg font-medium px-4">
              {capitalizeFirstLetter(day.day)}
            </p>
            <div
              className={`w-8 h-8 ${
                day.working
                  ? "bg-secondary-dark border-primary-border hover:bg-secondary-medium"
                  : "bg-parimary-bg hover:bg-hover-bg border-secondary-border"
              }    
                  flex-center rounded-full cursor-pointer border`}
              onClick={() => handleClickDay(day.day)}
            >
              {day.working ? <AiOutlineCheck /> : <IoMdAdd />}
            </div>
            <div
              className={`w-8 h-8 shadow-sm border border-secondary-border hover:border-primary-border hover:shadow-sm rounded-full flex justify-center
                          items-center  ${
                            day.day === selectedDay
                              ? "bg-secondary-dark border-primary-border hover:bg-secondary-medium"
                              : " bg-parimary-bg hover:bg-hover-bg border-secondary-border"
                          }`}
              onClick={() => handleEditTime(day.day)}
            >
              <AiOutlineClockCircle className="mx-2 " />
            </div>
          </button>
        ))}
      </div>
      <div
        className="w-full h-[300px] flex justify-start items-start gap-1 bg-secondary-bg 
      shadow-md border border-primary-border rounded-md overflow-y-auto"
      >
        {days?.map((day) => {
          if (day.day === selectedDay) {
            return (
              <div
                className="flex justify-start items-start flex-col gap-1 m-2"
                key={day}
              >
                <p>{capitalizeFirstLetter(day.day)}</p>
                {day.hours.map((time, index) => (
                  <div
                    className="flex justify-center items-center gap-1"
                    key={index}
                  >
                    <TimePicker.RangePicker
                      defaultValue={[
                        dayjs(time.from, "HH:mm"),
                        dayjs(time.to, "HH:mm"),
                      ]}
                      value={[
                        dayjs(time.from, "HH:mm"),
                        dayjs(time.to, "HH:mm"),
                      ]}
                      format="HH:mm"
                      onChange={(e) => changeInteralValue(day.day, index, e)}
                    />
                    {index != 0 && (
                      <div
                        className={`bg-primary-bg border border-primary-border hover:text-white
                         flex-center w-8 h-8 rounded-full cursor-pointer hover:bg-alert-text`}
                        onClick={() => removeInterval(day.day, index)}
                      >
                        <IoIosRemoveCircleOutline />
                      </div>
                    )}
                  </div>
                ))}
                <div className="w-full flex justify-center items-center">
                  <div
                    className={`bg-primary-bg border border-primary-border hover:text-white
                      flex-center w-8 h-8 rounded-full cursor-pointer hover:bg-success`}
                    onClick={() => addInterval(day.day)}
                  >
                    <GrAdd />
                  </div>
                </div>
              </div>
            );
          }
        })}
      </div>
      <button
        className="h-[40px] bg-green-400 shadow-md border border-gray-300 w-[100px] rounded-md my-1 hover:bg-green-500 self-end"
        onClick={() => handleSave()}
      >
        Save
      </button>
    </div>
  );
};
export default WorkingHours;

const capitalizeFirstLetter = (word) => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};
