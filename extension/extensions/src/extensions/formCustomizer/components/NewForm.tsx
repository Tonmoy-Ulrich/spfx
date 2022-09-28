import * as React from "react";
import { useState, FC } from "react";
import { TextField } from "office-ui-fabric-react/lib/TextField";
import { PrimaryButton } from "office-ui-fabric-react/lib/Button";
import {
    MessageBar,
    MessageBarType,
} from "office-ui-fabric-react/lib/MessageBar";
import { SPFI } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { Guid } from "@microsoft/sp-core-library";

export interface INewFormProps {
    sp: SPFI;
    listGuid: Guid;
    onSave: () => void;
    onClose: () => void;
}

const NewForm: FC<INewFormProps> = (props) => {
    const [title, setTitle] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [address, setAddress] = useState<string>("");
    const [msg, setMsg] = useState<any>(undefined);

    const clearControls = () => {
        setTitle("");
        setEmail("");
        setPhone("");
        setAddress("");
    };

    const saveListItem = async () => {
        setMsg(undefined);
        await props.sp.web.lists.getById(props.listGuid.toString()).items.add({
            Title: title,
            Email: email,
            Phone: Number(phone),
            WorkAddress: address,
        });
        setMsg({
            scope: MessageBarType.success,
            Message: "New item created successfully!",
        });

        console.log(
            await props.sp.web.lists.getById(props.listGuid.toString()).items(),
        );

        clearControls();
    };

    return (
        <React.Fragment>
            <div>New Form</div>
            <div style={{ margin: "10px" }}>
                <TextField
                    label="Enter Title:"
                    value={title}
                    onChange={(e, v) => setTitle(v)}
                />
                <TextField
                    label="Enter Email:"
                    value={email}
                    onChange={(e, v) => setEmail(v)}
                />
                <TextField
                    label="Enter Phone Number:"
                    value={phone}
                    onChange={(e, v) => setPhone(v)}
                />
                <TextField
                    label="Enter Address:"
                    value={address}
                    onChange={(e, v) => setAddress(v)}
                />
                <PrimaryButton text="Save" onClick={saveListItem} />
            </div>
            {msg && msg.Message && (
                <MessageBar
                    messageBarType={msg.scope ? msg.scope : MessageBarType.info}
                >
                    {msg.Message}
                </MessageBar>
            )}
        </React.Fragment>
    );
};

export default NewForm;
