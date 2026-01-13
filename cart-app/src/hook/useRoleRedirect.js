import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useRoleRedirect = (user) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    if (user.role === "ADMIN") navigate("/admin");
    else if (user.role === "SELLER") navigate("/seller");
    else navigate("/");
  }, [user?.role]);
};

export default useRoleRedirect;
