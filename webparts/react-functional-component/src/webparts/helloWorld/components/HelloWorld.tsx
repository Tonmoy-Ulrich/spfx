import * as React from "react";
import styles from "./HelloWorld.module.scss";
import { IHelloWorldProps } from "./IHelloWorldProps";
import { escape } from "@microsoft/sp-lodash-subset";
import * as Fabric from "office-ui-fabric-react";

export default function HelloWorld(props: IHelloWorldProps) {
    const { title, context, description, environmentMessage, hasTeamsContext } = props;

    return (
        <section className={`${styles.container} ${hasTeamsContext ? styles.teams : ""}`}>
            <div className={styles.row}>
                <div className={styles.column}>
                    <span className={styles.title}>{escape(title)}</span>
                    <div>{environmentMessage}</div>
                    <p>
                        React functional WebPart by &nbsp;
                        <mark>{escape(context.pageContext.user.displayName)}</mark>
                    </p>
                    <p>{escape(description)}</p>
                    <Fabric.PrimaryButton className={styles.button} href="#">
                        Learn more
                    </Fabric.PrimaryButton>
                </div>
            </div>
        </section>
    );
}
