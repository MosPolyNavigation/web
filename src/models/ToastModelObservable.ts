import {makeAutoObservable, runInAction} from "mobx";

export class ToastModelObservable {
	isVisible: boolean = false;
	timeWhenLastShowed: number = Date.now()

	constructor() {
		makeAutoObservable(this)
	}

	showForTime() {
		this.timeWhenLastShowed = Date.now()
		const currentTriggeredTime = this.timeWhenLastShowed
		this.isVisible = true
		setTimeout(() => {
			if (this.timeWhenLastShowed === currentTriggeredTime)
			runInAction(() => {
				this.isVisible = false
			})
		}, 2000)
	}
}