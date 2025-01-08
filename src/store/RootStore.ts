import {AppStoreMobx} from "./AppStoreMobx.ts";

export class RootStore {
	appStore = new AppStoreMobx()
}

const rootStore = new RootStore();
export default rootStore
export const appStoreMobX = rootStore.appStore