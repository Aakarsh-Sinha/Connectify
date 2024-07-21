import React from "react";
import axios from "axios";

const DeleteUserButton = () => {
  const handleDeleteUser = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      const response = await axios.delete(
        `http://localhost:5000/api/users/delete/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        alert("User deleted successfully");
        localStorage.removeItem("userId");
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Error deleting user");
    }
  };

  return (
    <button
      onClick={handleDeleteUser}
      className="bg-red-500 text-white p-2 rounded"
    >
      Delete Account
    </button>
  );
};

export default DeleteUserButton;
