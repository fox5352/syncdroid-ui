import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { initializeSessionHook } from "../store/session";
import { log } from "../lib/logging";
// ui
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
} from "@mui/material";
import LoadingProvider from "../ui/LoadingModel";

import { HomeMaxTwoTone, SyncAltTwoTone } from "@mui/icons-material";

function Rootlayout() {
  const { pathname } = useLocation();

  const navigate = useNavigate();

  const [value, setValue] = useState("home");

  const map: Record<string, string> = {
    home: "/",
    sync: "/sync",
    "/": "home",
    "/sync": "sync",
  };

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);

    const route = map[newValue];

    if (route) navigate(route);
  };

  useEffect(() => {
    if (!pathname) return;
    const route = map[pathname];

    if (route) {
      setValue(map[pathname]);
    } else {
      setValue("home");
    }
  }, [pathname]);

  useEffect(() => {
    try {
      initializeSessionHook();
    } catch (error) {
      log(`failed to initialize session hook in rootlayout ${error}`)

      alert(`failed to initialize session hook in rootlayout ${error}`);
    }

  }, [])

  return (
    <LoadingProvider>
      <Box sx={{
        height: "calc(100vh - 55px)",
        width: "100%",
        margin: 0,
        padding: 0,
        overflowY: "scroll",
      }}>
        <Outlet />
      </Box>
      <BottomNavigation
        sx={{
          height: "50px",
        }}
        value={value}
        onChange={handleChange}
      >
        <BottomNavigationAction
          label="Home"
          value="home"
          icon={<HomeMaxTwoTone />}
        />
        <BottomNavigationAction
          label="Sync"
          value="sync"
          icon={<SyncAltTwoTone />}
        />
      </BottomNavigation>
    </LoadingProvider>
  );
}

export default Rootlayout;
