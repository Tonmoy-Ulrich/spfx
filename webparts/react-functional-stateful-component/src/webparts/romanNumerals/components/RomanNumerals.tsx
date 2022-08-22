import * as React from "react";
import styles from "./RomanNumerals.module.scss";
import { IRomanNumeralsProps } from "./IRomanNumeralsProps";
import { escape } from "@microsoft/sp-lodash-subset";
import * as Fabric from "office-ui-fabric-react";
import { romanToString } from "./../RomanToString";

export default function RomanNumerals(props: IRomanNumeralsProps) {
    const [value, setValue] = React.useState(parseInt(props.initialValue));

    let upDownButtons = null;
    if (props.showUpDownButtons)
        upDownButtons = (
            <div className={styles.column}>
                <br />
                <Fabric.PrimaryButton onClick={() => setValue(value + 1)}>+</Fabric.PrimaryButton>
                &nbsp;
                <Fabric.PrimaryButton onClick={() => setValue(value - 1)}>-</Fabric.PrimaryButton>
            </div>
        );

    return (
        <section className={styles.container}>
            <div className={styles.row}>
                <div className={styles.column}>
                    <span className={styles.title}>{props.title}</span>
                    <p>{escape(props.description)}</p>
                </div>
                <div className={styles.column}>
                    {props.inputCaption}
                    <br />
                    <input
                        type="number"
                        min="0"
                        max="9999999"
                        value={value}
                        onChange={(e) => setValue(parseInt(e.target.value))}
                    />
                </div>
                {upDownButtons}
                <div className={styles.column}>
                    <br />
                    <h3>
                        {props.resultCaption} {romanToString(value)}
                    </h3>
                    <br />
                </div>
            </div>
        </section>
    );
}
