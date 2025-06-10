import { makeAutoObservable } from "mobx";

export default class GlobalStore {
    
    private _counter: number = 0;

    constructor() {
        makeAutoObservable(this);
    }

    public get counter(): number {
        return this._counter;
    }

    public set counter(num: number) {
        this._counter = num;
    }

}