import Link from "next/link";
import { AiOutlineSchedule } from "react-icons/ai";
import { FiSettings } from "react-icons/fi";
import { HiOutlineHome, HiOutlineUsers } from "react-icons/hi";

const MenuButton = ({ to, button, currentPage }) => {
  return (
    <Link href={`/${to}`}>
      <div
        className={`w-[48px] h-[48px] ${
          currentPage === button
            ? "bg-primary-active hover:bg-secondary-hover"
            : "bg-secondary-bg hover:bg-primary-hover"
        } shadow-sm text-primary flex justify-center items-center shadow-primary-shadow
        rounded-md cursor-pointer border-[0.2px] border-secondary`}
      >
        {button === "dashboard" && (
          <HiOutlineHome className="w-[32px] h-[32px]  font-light" />
        )}
        {button === "clients" && (
          <HiOutlineUsers className="w-[32px] h-[32px]  font-light" />
        )}
        {button === "schedule" && (
          <AiOutlineSchedule className="w-[32px] h-[32px]  font-light" />
        )}
        {button === "settings" && (
          <FiSettings className="w-[32px] h-[32px]  font-light" />
        )}
      </div>
    </Link>
  );
};
export default MenuButton;
