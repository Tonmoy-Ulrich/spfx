/* eslint-disable @typescript-eslint/no-floating-promises */
import * as React from "react";
import { Log, FormDisplayMode } from "@microsoft/sp-core-library";
import { FormCustomizerContext } from "@microsoft/sp-listview-extensibility";

import styles from "./HelloWorld.module.scss";

import {
    DefaultButton,
    PrimaryButton,
} from "office-ui-fabric-react/lib/Button";
import { Stack } from "office-ui-fabric-react/lib/Stack";
import { TextField } from "office-ui-fabric-react/lib/TextField";

import { SPFI } from "@pnp/sp";

import "@pnp/sp/items";
import "@pnp/sp/lists/web";
import "@pnp/sp/webs";

export interface IHelloWorldProps {
    context: FormCustomizerContext;
    displayMode: FormDisplayMode;
    sp: SPFI;
    onSave: () => void;
    onClose: () => void;
}

interface MyListItem {
    Id?: number;
    Title?: string;
    "odata.etag"?: string;
}

const LOG_SOURCE: string = "HelloWorld";

export default function HelloWorld({
    context,
    displayMode,
    sp,
    onSave,
    onClose,
}: IHelloWorldProps) {
    const [listItem, setListItem] = React.useState<MyListItem>({});

    const isViewForm = React.useMemo(
        () => displayMode === FormDisplayMode.Display,
        [displayMode],
    );

    const onInputChange = React.useMemo(
        () => (e: any, value?: string) =>
            setListItem({ ...listItem, Title: value }),
        [listItem, setListItem],
    );

    const saveForm = React.useMemo(
        () => () => {
            (async () => {
                const listItems = sp.web.lists.getById(
                    context.list.guid.toString(),
                ).items;
                const update = { Title: listItem.Title };

                if (!listItem.Title) {
                    return alert("Title is required");
                }

                try {
                    if (!context.itemId) {
                        await listItems.add(update);
                    } else {
                        await listItems
                            .getById(context.itemId)
                            .update(update, listItem["odata.etag"]);
                    }
                    onSave();
                } catch (error) {
                    alert("Error during saving the list item");
                }
            })();
        },
        [listItem, context.itemId, context.list.guid, sp],
    );

    React.useEffect(() => {
        (async () => {
            if (context.itemId) {
                const item = await sp.web.lists
                    .getById(context.list.guid.toString())
                    .items.getById(context.itemId)<MyListItem>();

                setListItem(item);
            } else {
                setListItem({ Title: "" });
            }
        })();
    }, [context.itemId, context.list.guid, displayMode, sp]);

    return (
        <Stack
            tokens={{
                childrenGap: 15,
                padding: 15,
            }}
            styles={{ root: { maxWidth: 500 } }}
        >
            <span>ID: {context.itemId || "new"}</span>
            <TextField
                label="Title"
                value={listItem.Title}
                onChange={onInputChange}
                readOnly={isViewForm}
            />
            <Stack
                horizontal
                tokens={{
                    childrenGap: 5,
                }}
                horizontalAlign="end"
            >
                {!isViewForm && (
                    <PrimaryButton onClick={saveForm}>Save</PrimaryButton>
                )}
                <DefaultButton onClick={onClose}>Close</DefaultButton>
            </Stack>
        </Stack>
    );
}
