import { RiLogoutBoxLine } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { logoutAsync } from "../features/auth/authSlice";

const LogoutButton = ({ collapsed }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutAsync());
    navigate("/login");
    toast.success("Logout successful!");
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-3 px-3 py-2 mt-auto rounded-lg text-sm font-medium
                 text-red-600 hover:bg-red-50 transition"
    >
      <RiLogoutBoxLine className="text-lg min-w-[20px]" />
      {!collapsed && <span>Logout</span>}
    </button>
  );
};

export default LogoutButton;
