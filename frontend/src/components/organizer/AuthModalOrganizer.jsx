import { Box, Modal } from "@mui/material";

import { useLocation } from "react-router-dom";

import OrganizerLogin from "./OrganizerLogin";
import OrganizerRegister from "./OrganizerRegister";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: {
    xs: "90%",
    sm: 350,
  },
  bgcolor: "white",
  borderRadius: "8px",
  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
  p: 4,
};

const AuthModalOrganizer = ({ handleClose, open }) => {
  const location = useLocation();

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="auth-modal-title"
      aria-describedby="auth-modal-description"
    >
      <Box sx={style}>
        {location.pathname === "/organizer/login" ? (
          <OrganizerLogin />
        ) : (
          <OrganizerRegister />
        )}
      </Box>
    </Modal>
  );
};

export default AuthModalOrganizer;
