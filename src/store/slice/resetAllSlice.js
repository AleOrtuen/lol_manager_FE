import { resetTeam } from "./teamSlice";
import { resetUser } from "./userSlice";

export const resetAllSlices = () => {
  return (dispatch) => {
    dispatch(resetUser()); 
    dispatch(resetTeam()); 
  };
};