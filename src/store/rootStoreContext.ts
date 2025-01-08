import {createContext, useContext} from "react";
import {RootStore} from "./RootStore.ts";

export const RootStoreContext = createContext<RootStore | null>(null);

export const useStore = () => {
	const context = useContext(RootStoreContext);
	if(context === null) {
		throw new Error('useStore must be used within context');
	}
	return context
}