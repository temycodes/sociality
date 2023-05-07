import React from 'react';
import {
  EditOutlined,
} from "@mui/icons-material";
import { Box, Typography, useTheme } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FlexBetween from "./FlexBetween";

const settingsOptions = [
  {
    label: "upload image",
    value: "uploadImage",
  },
  {
    label: "usernames",
    value: "username",
  },
  {
    label: "Email",
    value: "email",
  },
  {
    label: "Phone Number",
    value: "phone",
  },
  {
    label: "Date of Birth",
    value: "dob",
  },
  {
    label: "Gender",
    value: "gender",
  },
];

const SettingRoutes = () => {
  const navigate = useNavigate();
  const { _id } = useSelector((state) => state.user);
  const { palette } = useTheme();
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;
  const userId = _id;

  const handleClick = (option) => {
    navigate(`/${userId}/settings/${option.value}`);
  };

  return (
    <Box>
      {settingsOptions.map((option) => (
        <FlexBetween
          key={option.value}
          gap="1rem"
          onClick={() => handleClick(option)}
          sx={{
            "&:hover": {
              color: palette.primary.light,
              cursor: "pointer",
            },
            paddingBottom: "2rem",
          }}
        >
          <Box>
            <Typography color={main} fontWeight="500">
              {option.label}
            </Typography>
            <Typography color={medium}>{userId[option.value]}</Typography>
          </Box>
          <EditOutlined sx={{ color: main }} />
        </FlexBetween>
      ))}
    </Box>
  );
};

export default SettingRoutes;
