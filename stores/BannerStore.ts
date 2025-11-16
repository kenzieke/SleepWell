import { create } from 'zustand';

interface BannerState {
  message: string;
  visible: boolean;
  showBanner: (message: string) => void;
  hideBanner: () => void;
}

export const useBannerStore = create<BannerState>((set) => ({
  message: '',
  visible: false,
  showBanner: (message: string) => set({ message, visible: true }),
  hideBanner: () => set({ visible: false, message: '' }),
}));
