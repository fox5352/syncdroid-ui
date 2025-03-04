import { Navigate } from "react-router-dom";
import { useSession } from "../../store/session";
import { BottomNavigation, BottomNavigationAction, Box, CircularProgress, Container } from "@mui/material";
import { ImageTwoTone, AudioFile, VideoFile } from "@mui/icons-material";
import FileView from "./ui/FileView";
import { useState } from "react";

export default function Home() {
  const { data, loading } = useSession();
  const [tab, setTab] = useState("audio");

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue);
  }

  if (loading) {
    return (
      <Box sx={{
        position: "absolute",
        top: "0%",
        left: "0%",
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}>
        <CircularProgress size={200} />
      </Box>
    );
  }

  if (data == null) {
    return <Navigate to="/sync" />;
  }

  return (
    <Container
      id="page-container"
      maxWidth="md"
      component="section"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 1,
        width: "100%",
        height: "100%",
        p: 0,
      }}
    >
      <FileView
        type={tab}
      />
      <BottomNavigation
        sx={{
          height: "50px",
          borderBottom: "1px solid black",
        }}
        value={tab}
        onChange={handleChange}
      >
        <BottomNavigationAction
          label="Audio"
          value="audio"
          icon={<AudioFile />}
        />
        <BottomNavigationAction
          label="Image"
          value="image"
          icon={<ImageTwoTone />}
        />
        <BottomNavigationAction
          label="Video"
          value="video"
          icon={<VideoFile />}
        />
      </BottomNavigation>
    </Container>
  );
}
