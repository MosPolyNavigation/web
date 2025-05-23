import { persist } from 'zustand/middleware';
import {create} from 'zustand/react';

interface UserState {
	userId: string | null;
	setUserId: (id: string) => void;
}

export const useUserStore = create<UserState>()(
	persist(
		(set) => ({

			userId: null,
			setUserId: (id) => set({userId: id})

		}),
		{
			name: 'user-storage',
			version: 0,
		}
	)
);

export const userStore = useUserStore.getState