import { persist } from 'zustand/middleware';
import {create} from 'zustand/react';
import {appStore} from './useAppStore.ts'

interface UserState {
	userId: string | null;
	setUserId: (id: string) => void;

	isDevelopMode: boolean,
	toggleDevelopMode(): void
}

export const useUserStore = create<UserState>()(
	persist(
		(set, get) => ({

			userId: null,
			setUserId: (id) => set({userId: id}),

			isDevelopMode: false,
			toggleDevelopMode() {
				set({isDevelopMode: !get().isDevelopMode})
				appStore().toast.showForTime(`Режим разработчика ${get().isDevelopMode ? 'включен' : 'выключен'}` )
			}
		}),
		{
			name: 'user-storage',
			version: 0,
		}
	)
);

export const userStore = useUserStore.getState