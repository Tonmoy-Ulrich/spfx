import { Log } from "@microsoft/sp-core-library";
import * as React from "react";

import styles from "./FieldCustomizer.module.scss";

export interface IFieldCustomizerProps {
    text: string;
    fieldValue: number;
}

const LOG_SOURCE: string = "FieldCustomizer";

export default class FieldCustomizer extends React.Component<
    IFieldCustomizerProps,
    {}
> {
    public componentDidMount(): void {
        Log.info(LOG_SOURCE, "React Element: FieldCustomizer mounted");
    }

    public componentWillUnmount(): void {
        Log.info(LOG_SOURCE, "React Element: FieldCustomizer unmounted");
    }

    public render(): React.ReactElement<{}> {
        return (
            <div
                className={`${styles.field} ${
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
