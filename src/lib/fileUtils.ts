import { writeFile, BaseDirectory } from "@tauri-apps/plugin-fs";
import { FileTypeBuffer } from "./requests";
import { invoke } from "@tauri-apps/api/core";

/**
 * Save a file with user-selected location using the system dialog
 */
export async function saveFileWithPicker(file: FileTypeBuffer, mime_type: string) {
  try {
    const fileName = `${file.name}${file.extension}`;
    const fileBuffer = file.data?.data;

    if (!fileBuffer || fileBuffer === undefined) {
      throw new Error("File binary data not found: " + fileName);
    }

    const res = await invoke<string>("write_to_file_with_picker", {
      data: {
        file_name: fileName,
        mime_type,
        content: Array.from(fileBuffer)
      }
    });

    alert(res);
    return true;
  } catch (error) {
    alert(`Error saving file: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
}
