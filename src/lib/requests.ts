import { Session } from "../store/session";

export type AllowLst = {
  allowList: string[];
};
export type ImagePaths = {
  imagePaths: string[];
};
export type AudioPaths = {
  audioPaths: string[];
};

export type VideoPaths = {
  videoPaths: string[];
};

export type ImageExt = {
  imageExt: string[];
};
export type AudioExt = {
  audioExt: string[];
};

export type VideoExt = {
  videoExt: string[];
};

export type Server = {
  server: {
    host: string;
    port: number;
  };
};

export type Settings = AllowLst &
  ImagePaths &
  AudioPaths &
  VideoPaths &
  ImageExt &
  AudioExt &
  VideoExt &
  Server;

export type SettingsKeys =
  | "allowList"
  | "imagePaths"
  | "audioPaths"
  | "videoPaths"
  | "imageExt"
  | "audioExt"
  | "videoExt"
  | "server";

type AudioMetaData = {
  duration: number;
  sampleRate: number;
};

type ImageMetaData = {
  thumbnail: {
    data: number[];
    type: string;
  };
};

export type FileType = {
  name: string;
  path: string;
  extension: string;
  type: string;
  metadata: {
    size: number;
    created: string;
    modified: string;
    type: string;
    imageMetaData?: ImageMetaData;
    audioMetaData?: AudioMetaData;
  };
};


/**
 * Perform a request to the backend.
 *
 * @param url The URL path of the request
 * @param method The HTTP method of the request
 * @param body The body of the request. Must be defined for POST requests.
 *
 * @returns A promise that resolves to the response object
 *
 * @throws If getSessionData() fails
 * @throws If the request method is POST and no body is given
 */
async function request(
  url: string,
  method: "GET" | "POST" | "PUT",
  session: Session,
  body?: string,
  signal?: AbortSignal
) {
  const [addr, token] = [session.url, session.token];

  if (!addr || !token)
    throw new Error("failed to get session data from backend");

  if (method == "POST" && (body == undefined || body == null))
    throw new Error("Can't do a post request without a body");

  let options = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: body,
    signal
  };

  const res = await fetch(`${addr}/${url}`, options);

  return res;
}

export async function getSettings(session: Session): Promise<Settings> {
  const res = await request("api/settings", "GET", session);

  if (!res.ok)
    throw new Error(`failed to request ${res.status}:${res.statusText}`);

  const data = await res.json();

  return data.data.settings as Settings;
}

export async function updateSettings(
  updateData: unknown,
  rvop: boolean = false,
  session: Session
) {
  const res = await request(
    "api/settings",
    "POST",
    session,
    JSON.stringify({ settings: updateData })
  );

  if (!res.ok)
    throw new Error(`failed to request ${res.status}:${res.statusText}`);

  if (rvop) {
    const newSettings = await res.json();

    return newSettings;
  } else {
    return null;
  }
}

export interface File {
  name: string;
  path: string;
  extension: string;
}

export interface Folder {
  [key: string]: File[];
}

export interface FileData {
  key: string;
  folder: Folder;
}

export async function getFiles<T>(
  type: string,
  session: Session
): Promise<[{ data: T; message: string } | null, string | null]> {
  const res = await request(`api/${type}`, "GET", session);

  if (!res.ok) {
    return [
      null,
      `failed to request files type:${type}::${res.status}:${res.statusText}`,
    ];
  }

  const data = await res.json();

  return [data as { data: T; message: string }, null];
}

export type FileTypeBuffer = FileType & {
  data?: {
    type?: "Buffer",
    data?: Uint8Array
  }
}

export async function getFile(
  type: string,
  fileData: { name: string, path: string },
  session: Session,
  signal?: AbortSignal
): Promise<[FileTypeBuffer | null, string | null]> {
  const encodedName = encodeURIComponent(fileData.name);
  const encodedPath = encodeURIComponent(fileData.path);

  const url = `api/${type}/file?name=${encodedName}&path=${encodedPath}`
  const res = await request(
    url,
    "GET",
    session,
    undefined,
    signal
  );

  if (!res.ok) {
    return [
      null,
      `failed to request file type:${type}::${res.status}:${res.statusText}`,
    ]
  }

  const data = await res.json()

  if (!data) return [null, 'failed to get data from the server'];

  return [data.data, null];
}
