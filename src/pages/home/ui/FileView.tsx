import { Box, CircularProgress, Divider, Typography } from "@mui/material";

import FolderBlock from "./FolderBlock";
import { useSession } from "../../../store/session";
import { useEffect, useState } from "react";
import { FileData, getFiles } from "../../../lib/requests";

interface FileView {
  type: string;
}

export default function FileView({ type }: FileView) {
  const { data: session } = useSession();

  // page state
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState<{ message: string, error: "error" | "info" | "warnaing" } | null>(null);
  const [fileData, setFileData] = useState<any[] | null>(null);

  useEffect(() => {
    const fetchFileData = async () => {
      if (!session) return;
      setIsError(null);
      setIsLoading(true);

      const [res, err] = await getFiles<FileData[]>(type, session);

      if (err || !res) {
        setIsError({
          message: err ? err : "failed to get data",
          error: "error",
        });
        setIsLoading(false);
        return;
      }

      setFileData(res.data);
      setIsLoading(false);
      setIsError(null);
    };

    fetchFileData();
  }, [session, type]);



  return (
    <Box sx={{
      flexGrow: 1,
      maxHeight: "calc(100% - 50px)",
      overflow: "scroll"
    }}
      id="fileview-container"
    >
      <Divider />
      {isError ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "223px",
          }}
        >
          <Typography
            variant="h4"
            color="error"
            sx={{ textAlign: "center", alignSelf: "center" }}
          >
            {isError.message}
          </Typography>
        </Box>
      ) : isLoading ? (
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
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "repeat(1, 1fr)", sm: "repeat(2, 1fr)" },
            gridAutoRows: "395px",
            gap: 1,
            overflowY: "auto",
            borderRadius: "4px",
          }}
          id="folderBlock-container"
        >
          {fileData &&
            fileData.map((block, index) => (
              <FolderBlock key={index} folder={block.key} fileData={block} type={type} />
            ))}
        </Box>
      )}
    </Box>
  );
}
