import { create } from "zustand";

export type Session = {
  url: string;
  token: string;
};

/**
 * Hook for managing session data
 */
type SessionHook = {
  /** Current session data or null if no active session */
  data: Session | null;
  /** Loading state for session data */
  loading: boolean;
  /**
   * Updates the session data and persists it to the database
   * @param {Session} session - The session to set
   * @returns {Promise<void>}
   * @throws Will throw if database operation fails
   * @example
   * try {
   *   await useSession.getState().setSession(newSession);
   * } catch (error) {
   *   log("Failed to set session:", error);
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
   *   log("Failed to initialize session:", error);
   * }
   */
  initializeSession: () => Promise<void>;
};

export const useSession = create<SessionHook>()((set) => ({
  data: null,
  loading: true,
  setSession: async (session: Session) => {
    set({ data: session });
  },
  clearSession: () => set({ data: null }),
  initializeSession: async () => {
    const latestSession = null;

    set((prevState) => {
      return {
        ...prevState,
        data: latestSession,
        loading: false,
      };
    });
  },
}));

/**
 * Initializes the session hook with data from the database
 * @returns {Promise<void>}
 * @throws Will throw if database operation fails
 * @example
 * try {
 *   await initializeSessionHook();
 * } catch (error) {
 *   log("Failed to initialize session hook:", error);
 * }
 */
export async function initializeSessionHook(): Promise<void> {
  await useSession.getState().initializeSession();
}
