import { inject, observer } from "mobx-react";
import { Component, ReactNode } from "react";
import GlobalStore from "../store/globalStore";

interface AppProps {
    globalStore: GlobalStore
}

@inject("globalStore")
@observer
export default class App extends Component { 
    
    private globalStore: GlobalStore;

    constructor(props: AppProps) {
        super(props);
        this.globalStore = props.globalStore;
    }

    render(): ReactNode {
        return (
            <div className="main-app">
                <h1>Tube Loader {this.globalStore.counter.toString()}</h1>
                <button onClick={() => this.globalStore.counter++}>Increment</button>
                <button onClick={() => this.globalStore.counter--}>Decrement</button>
            </div>
        );
    }

};