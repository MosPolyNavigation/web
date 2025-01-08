import {makeAutoObservable} from "mobx";
import {ToastModelObservable} from "../models/ToastModelObservable.ts";

export class AppStoreMobx {
	toast = new ToastModelObservable()

	constructor() {
		makeAutoObservable(this)
	}
}