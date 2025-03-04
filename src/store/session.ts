import { create } from "zustand";
import Database from "@tauri-apps/plugin-sql";


async function connect(): Promise<Database> {
  const database = await Database.load("sqlite:session.db");

  // create tabel if no there
  database.execute("CREATE TABLE IF NOT EXISTS session (url TEXT, token TEXT, date TEXT);");

  return database;
}

export async function inserInto(data: Session): Promise<void> {
  const db = await connect();

  const date = new Date().toISOString();

  await db.execute("Insert into session Values($1,$2,$3)", [data.url, data.token, date]);

  db.close();

  return;
}

export async function getLatestSession(): Promise<Session | null> {
  const db = await connect();

  const result = (await db.select<Session[]>("SELECT url, token FROM session ORDER BY date DESC LIMIT 1"))[0];

  if (!result) return null;

  return result
}

export type Session = {
  url: string;
  token: string;
};

/**
 * Hook for managing session data
 */
type SessionHook = {
  /** Current session data or null if no active session */
  data: Session | null,
  /** Loading state for session data */
  loading: boolean,
  /**
   * Updates the session data and persists it to the database
   * @param {Session} session - The session to set
   * @returns {Promise<void>}
   * @throws Will throw if database operation fails
   * @example
   * try {
   *   await useSession.getState().setSession(newSession);
   * } catch (error) {
   *   console.error("Failed to set session:", error);
   * }
   */
  setSession: (session: Session) => Promise<void>;
  /** Clears the current session */
  clearSession: () => void;
  /**
   * Initializes the session from the database
   * @returns {Promise<void>}
   * @throws Will throw if database operation fails
   * @example
   * try {
   *   await useSession.getState().initializeSession();
   * } catch (error) {
   *   console.error("Failed to initialize session:", error);
   * }
   */
  initializeSession: () => Promise<void>;
};


export const useSession = create<SessionHook>()(
  (set) => ({
    data: null,
    loading: true,
    setSession: async (session: Session) => {
      set({ data: session })
      await inserInto(session);
    },
    clearSession: () => set({ data: null }),
    initializeSession: async () => {
      const latestSession = await getLatestSession();

      set(prevState => {
        return {
          ...prevState,
          data: latestSession,
          loading: false,
        }
      })
    }
  })
);

/**
 * Initializes the session hook with data from the database
 * @returns {Promise<void>}
 * @throws Will throw if database operation fails
 * @example
 * try {
 *   await initializeSessionHook();
 * } catch (error) {
 *   console.error("Failed to initialize session hook:", error);
 * }
 */
export async function initializeSessionHook(): Promise<void> {
  await useSession.getState().initializeSession();
}
