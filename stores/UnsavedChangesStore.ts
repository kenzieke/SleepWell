import { create } from 'zustand';

interface UnsavedChangesState {
  hasUnsavedChanges: boolean;
  saveCallback: (() => Promise<void>) | null;
  discardCallback: (() => void) | null;
  setHasUnsavedChanges: (value: boolean) => void;
  registerCallbacks: (
    save: () => Promise<void>,
    discard: () => void
  ) => void;
  clearCallbacks: () => void;
}

export const useUnsavedChangesStore = create<UnsavedChangesState>((set) => ({
  hasUnsavedChanges: false,
  saveCallback: null,
  discardCallback: null,
  setHasUnsavedChanges: (value) => set({ hasUnsavedChanges: value }),
  registerCallbacks: (save, discard) =>
    set({ saveCallback: save, discardCallback: discard }),
  clearCallbacks: () =>
    set({ saveCallback: null, discardCallback: null, hasUnsavedChanges: false }),
}));
