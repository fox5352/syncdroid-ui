declare global {
  interface Window {
    Android: {
      showToast: (message: string) => void;
      openDirectoryPicker: (
        fileName: string,
        fileContent: Uint8Array
      ) => boolean;
    };
  }
}
