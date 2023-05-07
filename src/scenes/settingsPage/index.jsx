import React from 'react';
import Layout from "../../components/Layout";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import SettingRoutes from "../../components/SettingRoutes";

const SettingsPage = () => {
  const user = useSelector((state)=> state.user)

  return (
    <Layout>
      <div className="settings-container">
        <h2 className="settings-title">Account information</h2>
        <p>@{user.username}</p>
      </div>
      <Box>
        <SettingRoutes />
      </Box>
    </Layout>
  );
};

export default SettingsPage;
