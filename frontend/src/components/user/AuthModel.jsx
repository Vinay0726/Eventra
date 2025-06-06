import { Box, Modal } from "@mui/material";
import { useLocation } from "react-router-dom";

import UserLogin from "./UserLogin";
import UserRegister from "./UserRegister";

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
  borderRadius: "12px",
  boxShadow: "0 16px 32px rgba(0, 0, 0, 0.2)",
  p: 4,
};

const AuthModal = ({ handleClose, open }) => {
  const location = useLocation();

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="auth-modal-title"
      aria-describedby="auth-modal-description"
    >
      <Box sx={style}>
        {location.pathname === "/user/login" ? (
          <UserLogin onClose={handleClose} />
        ) : (
          <UserRegister onClose={handleClose} />
        )}
      </Box>
    </Modal>
  );
};

export default AuthModal;
