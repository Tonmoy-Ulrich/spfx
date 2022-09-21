import { Log } from "@microsoft/sp-core-library";
import * as React from "react";

import styles from "./HelloWorld.module.scss";

export interface IHelloWorldProps {
    text: string;
    fieldValue: number;
}

const LOG_SOURCE: string = "HelloWorld";

export default class HelloWorld extends React.Component<IHelloWorldProps, {}> {
    public componentDidMount(): void {
        Log.info(LOG_SOURCE, "React Element: HelloWorld mounted");
    }

    public componentWillUnmount(): void {
        Log.info(LOG_SOURCE, "React Element: HelloWorld unmounted");
    }

    public render(): React.ReactElement<{}> {
        return (
            <div
                className={`${styles.helloWorld} ${
                    this.props.fieldValue <= 0 ? styles.empty : styles.given
                }`}
            >
                {this.props.fieldValue > 0
                    ? this.props.text + this.props.fieldValue
                    : "Not given"}
            </div>
        );
    }
}
