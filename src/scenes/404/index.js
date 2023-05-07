import React from 'react';
import { Box } from "@mui/material";
import Navbar from "../navbar";

const NotFoundPage = () => {
  return (
    <Box>
      <Navbar />
      <div>
        <h1>404 Not Found</h1>
        <p>Sorry, the page you are looking for could not be found.</p>
      </div>
    </Box>
  );
};

export default NotFoundPage;
