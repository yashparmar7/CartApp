import axiosInstance from "../../api/axiosInstance";
export const getAllUserAPI = () => {
  try {
    const res = axiosInstance.get("/superadmin/getAllUsers");
    return res;
  } catch (err) {
    console.log(err);
  }
};

export const updateUserRoleAPI = (id, data) => {
  try {
    const res = axiosInstance.patch(`/superadmin/users/${id}/role`, data);
    return res;
  } catch (err) {
    console.log(err);
  }
};

export const deleteUserAPI = (id) => {
  try {
    const res = axiosInstance.delete(`/superadmin/users/${id}`);
    return res;
  } catch (err) {
    console.log(err);
  }
};
