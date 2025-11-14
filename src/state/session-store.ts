"use client";

import { create } from "zustand";
import type { SessionPayload } from "@/types/session";

interface SessionState {
  session: SessionPayload | null;
  resetCounter: number;
  setSession: (payload: SessionPayload) => void;
  clearSession: () => void;
}

export const useSessionStore = create<SessionState>()((set) => ({
  session: null,
  resetCounter: 0,
  setSession: (payload) => set({ session: payload }),
  clearSession: () =>
    set((state) => ({
      session: null,
      resetCounter: state.resetCounter + 1,
    })),
}));
