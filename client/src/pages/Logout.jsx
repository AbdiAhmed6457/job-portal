import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="flex justify-between p-4 bg-gray-100">
      <h1 className="font-bold text-xl">MS Job Portal</h1>
      {user && (
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      )}
    </nav>
  );
};

export default Navbar;
