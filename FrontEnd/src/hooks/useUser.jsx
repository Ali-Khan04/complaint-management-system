import { useContext } from "react";
import { UserContext } from "../Context/UserContext";
function useUser() {
  return useContext(UserContext);
}

export default useUser;
