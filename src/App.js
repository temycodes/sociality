import React, { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import NotFoundPage from "./scenes/404";

const HomePage = lazy(() => import("./scenes/homePage"));
const LoginPage = lazy(() => import("./scenes/authentication"));
const ProfilePage = lazy(() => import("./scenes/profilePage"));
const SettingsPage = lazy(() => import("./scenes/settingsPage"));
const EditSettings = lazy(() => import("./scenes/settingsPage/editSettings"));

function App() {
  const mode = useSelector((state) => state.mode); // make sure that `mode` is defined in your Redux store
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]); // pass `mode` to `createTheme`
  const isAuth = Boolean(useSelector((state) => state.token)); // make sure that `token` is defined in your Redux store
  console.log(isAuth);
  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Suspense fallback={<div>Loading...</div> }>
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route
                path="/home"
                element={isAuth ? <HomePage /> : <Navigate to="/" />}
              />
              <Route
                path="/profile/:userId"
                element={isAuth ? <ProfilePage /> : <Navigate to="/" />}
              />
              <Route
                path="/settings"
                element={isAuth ? <SettingsPage /> : <Navigate to="/" />}
              />
              <Route
                path="/:userId/settings/:option"
                element={isAuth ? <EditSettings /> : <Navigate to="/" />}
              />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
