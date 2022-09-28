import * as React from "react";
import { Log, FormDisplayMode, Guid } from "@microsoft/sp-core-library";
import { FormCustomizerContext } from "@microsoft/sp-listview-extensibility";

import styles from "./CustomForm.module.scss";
import { SPFI } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";

import NewForm from "./NewForm";
import EditForm from "./EditForm";
import DisplayForm from "./DisplayForm";

export interface ICustomFormProps {
    sp: SPFI;
    listGuid: Guid;
    itemID: number;
    context: FormCustomizerContext;
    displayMode: FormDisplayMode;
    onSave: () => void;
    onClose: () => void;
}

const LOG_SOURCE: string = "FormCustomizer";

const CustomForm: React.FC<ICustomFormProps> = (props: ICustomFormProps) => {
    React.useEffect(() => {
        Log.info(LOG_SOURCE, "React Element: TestCustomizer mounted");
        return () => {
            Log.info(LOG_SOURCE, "React Element: TestCustomizer unmounted");
        };
    }, []);

    return (
        <div className={styles.formCustomizer}>
            {props.displayMode === FormDisplayMode.New && (
                <NewForm
                    sp={props.sp}
                    listGuid={props.listGuid}
                    onSave={props.onSave}
                    onClose={props.onClose}
                />
            )}
            {props.displayMode === FormDisplayMode.Edit && (
                <EditForm
                    sp={props.sp}
                    listGuid={props.listGuid}
                    itemId={props.itemID}
                    onSave={props.onSave}
                    onClose={props.onClose}
                />
            )}
            {props.displayMode === FormDisplayMode.Display && (
                <DisplayForm
                    sp={props.sp}
                    listGuid={props.listGuid}
                    itemId={props.itemID}
                    onClose={props.onClose}
                />
            )}
        </div>
    );
};

export default CustomForm;
