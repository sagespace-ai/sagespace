"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { JourneyContext, Purpose, JourneyStep } from "@/lib/types/journey"
import { createJourneyContext, getNextRoute, updateJourneyStep } from "@/lib/journey"

interface JourneyStore {
  context: JourneyContext
  setPurpose: (purpose: Purpose) => void
  setStep: (step: JourneyStep) => void
  addSage: (sageId: string) => void
  setArtifact: (artifactId: string) => void
  reset: () => void
  nextRoute: string
}

export const useJourneyStore = create<JourneyStore>()(
  persist(
    (set, get) => ({
      context: createJourneyContext(),
      nextRoute: "/",
      setPurpose: (purpose) =>
        set((state) => ({
          context: { ...state.context, purpose },
          nextRoute: getNextRoute({ ...state.context, purpose }),
        })),
      setStep: (step) =>
        set((state) => {
          const newContext = updateJourneyStep(state.context, step)
          return {
            context: newContext,
            nextRoute: getNextRoute(newContext),
          }
        }),
      addSage: (sageId) =>
        set((state) => ({
          context: {
            ...state.context,
            activeSageIds: [...new Set([...state.context.activeSageIds, sageId])],
          },
        })),
      setArtifact: (artifactId) =>
        set((state) => ({
          context: { ...state.context, lastArtifactId: artifactId },
        })),
      reset: () =>
        set({
          context: createJourneyContext(),
          nextRoute: "/",
        }),
    }),
    {
      name: "sagespace-journey",
    },
  ),
)

export function useJourney() {
  return useJourneyStore()
}
