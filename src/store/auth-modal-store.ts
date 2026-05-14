import { create } from 'zustand';

interface AuthModalStore {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const useAuthModalStore = create<AuthModalStore>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
}));
