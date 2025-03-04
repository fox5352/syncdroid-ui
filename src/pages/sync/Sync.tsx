import { useState } from "react";
import {
  Format,
  checkPermissions,
  requestPermissions,
  scan,
  cancel,
} from "@tauri-apps/plugin-barcode-scanner";

import { Box, Button, Container, TextField } from "@mui/material";
import { useSession } from "../../store/session";
import { useNavigate } from "react-router-dom";

export default function Sync() {
  const navigate = useNavigate();
  const { setSession } = useSession();

  const [formData, setFormData] = useState({
    url: "",
    token: "",
  });

  const [mode, setMode] = useState<"Manual" | "Scan" | null>("Scan");
  const [scanning, setScanning] = useState(false);

  const toggleMode = () => setMode(mode == "Manual" ? "Scan" : "Manual");

  // BUG: change alert to toast that warn the user
  const startScan = async () => {
    const checkPerm = await checkPermissions();

    if (checkPerm == "prompt") {
      await requestPermissions();
    }

    if (checkPerm == "denied") {
      setMode("Manual");
      return;
    }

    if (checkPerm == "granted") {
      setScanning(true);
      const scanned = await scan({
        windowed: true,
        formats: [Format.QRCode],
        cameraDirection: "back",
      });

      setScanning(false);

      const data: unknown = scanned.content;

      if (data == null) {
        alert("Failed to scan");
        return;
      }

      if (typeof data == "string") {
        const [url, buffer] = data.split("?");
        const params = new URLSearchParams(buffer);
        const token = params.get("token");

        if (!token) alert("Invalid token given");

        if (url && token) {
          setSession({ url, token });
          navigate("/");
        } else {
          alert("Failed to  url or token");
        }
        return;
      }

      alert("type cast failed on string check");
    }
  };

  const cancelScan = async () => {
    await cancel();
    setScanning(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.url && formData.token) {
      setSession({ url: formData.url, token: formData.token });
      navigate("/");
    }
  };

  return (
    <Container>
      {!scanning && (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "90%",
            maxWidth: "425px",
            bgcolor: "background.paper",
            borderRadius: "12px",
            boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.41)", // Soft page effect
          }}
        >
          {mode == "Scan" ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                padding: 2,
                width: "60%",
              }}
            >
              <Button
                onClick={startScan}
                variant="outlined"
                color="primary"
                sx={{ mt: 2 }}
              >
                Scan Now
              </Button>
            </Box>
          ) : (
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                padding: 2,
              }}
            >
              <TextField
                size="small"
                fullWidth
                required
                name="url"
                label="URL"
                variant="outlined"
                value={formData.url}
                onChange={handleChange}
              />

              <TextField
                size="small"
                fullWidth
                required
                name="token"
                label="Token"
                variant="outlined"
                value={formData.token}
                onChange={handleChange}
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
              >
                Submit
              </Button>
            </Box>
          )}
          {/* Toggle box */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              padding: 2,
              width: "60%",
            }}
          >
            <Button onClick={toggleMode} variant="contained" color="primary">
              {mode == "Manual" ? "Scan" : "Manual"}
            </Button>
          </Box>
        </Box>
      )}
      {scanning && (
        <>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -60%)",
              width: "200px",
              height: "200px",
              border: "3px solid white",
              borderRadius: "12px",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <Button
              sx={{ width: "60%", my: 5 }}
              size="large"
              onClick={cancelScan}
              variant="contained"
              color="warning"
            >
              Cancel Scan
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
}
