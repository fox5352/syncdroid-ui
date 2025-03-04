import { Box, Divider, Typography } from "@mui/material";
import type { FileBlockProps } from "./FileBlock";
import FileBlock from "./FileBlock";
import { useMemo } from "react";

export type FolderBlock = {
  folder: string;
  fileData: {
    // @ts-ignore
    key: string;
    [key: string]: FileBlockProps[]; // All the values are just strings
  };
  type: string;
};

export default function FolderBlock({ folder, fileData, type }: FolderBlock) {
  const [folderName, data]: [string, FileBlockProps[]] = useMemo(() => {
    const split = folder.split(/[\/\\]/);

    return [split[split.length - 1], fileData[`${folder}`]];
  }, [folder]);

  return (
    <Box
      sx={{
        p: 2,
        m: 1,
        mr: 2.5,
        border: "1px solid black",
        borderRadius: "8px",
      }}
    >
      <Typography
        variant="body1"
        component="h3"
        sx={{
          height: "8%",
        }}
      >
        {folderName}
      </Typography>
      <Divider />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gridAutoRows: "100px",
          gap: 0.6,
          overflowY: "auto",
          width: "100%",
          height: "calc(100% - 8%)",
          p: 0.5,
          borderRadius: "4px",
        }}
      >
        {data.map((file: FileBlockProps, index) => (
          <FileBlock key={index} {...file} type={type} />
        ))}
      </Box>
    </Box>
  );
}
