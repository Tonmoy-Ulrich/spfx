/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-floating-promises */
import * as React from "react";
import { IFluentUiFormProps } from "./IFluentUiFormProps";
import Table from "./table/Table";
import { PrimaryButton, DefaultButton } from "@fluentui/react/lib/Button";
import styles from "./FluentUiForm.module.scss";
import CustomForm from "./form/CustomForm";

export default function FluentUiForm(props: IFluentUiFormProps): JSX.Element {
    const [isButton, setIsButton] = React.useState(true);
    const [isView, setIsView] = React.useState(false);
    const [isCreate, setIsCreate] = React.useState(false);
    const [employeeId, setEmployeeId] = React.useState(null);

    const changeComponent = (name: string, id: any = null): any => {
        setEmployeeId(null);
        if (name === "button") {
            setIsButton(true);
            setIsView(false);
            setIsCreate(false);
        } else if (name === "view") {
            setIsButton(false);
            setIsView(true);
            setIsCreate(false);
        } else if (name === "create" && id !== null) {
            setEmployeeId(id);
            setIsButton(false);
            setIsView(false);
            setIsCreate(true);
        } else if (name === "create") {
            setIsButton(false);
            setIsView(false);
            setIsCreate(true);
        }
    };

    return (
        <div className={styles.container}>
            {isButton && (
                <>
                    <div className={styles.title}>{props.listName}</div>
                    <DefaultButton
                        className={styles.buttonContainer}
                        text="View"
                        onClick={(e) => changeComponent("view")}
                    />
                    <PrimaryButton
                        className={styles.buttonContainer}
                        text="Create"
                        onClick={(e) => changeComponent("create")}
                    />
                </>
            )}

            {isCreate && (
                <CustomForm
                    context={props.context}
                    employeeId={employeeId}
                    callback={changeComponent}
                />
            )}
            {isView && (
                <Table context={props.context} callback={changeComponent} />
            )}
        </div>
    );
}
