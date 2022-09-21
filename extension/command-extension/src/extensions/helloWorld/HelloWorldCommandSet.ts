/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable no-case-declarations */
import { Log } from "@microsoft/sp-core-library";
import {
    BaseListViewCommandSet,
    Command,
    IListViewCommandSetExecuteEventParameters,
    ListViewStateChangedEventArgs,
} from "@microsoft/sp-listview-extensibility";
import { Dialog } from "@microsoft/sp-dialog";
import { SPPermission } from "@microsoft/sp-page-context";
import { SPFI, spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IHelloWorldCommandSetProperties {
    // This is an example; replace with your own properties
    sampleTextOne: string;
    sampleTextTwo: string;
}

const LOG_SOURCE: string = "HelloWorldCommandSet";

export default class HelloWorldCommandSet extends BaseListViewCommandSet<IHelloWorldCommandSetProperties> {
    private sp: SPFI = null;

    public onInit(): Promise<void> {
        Log.info(LOG_SOURCE, "Initialized HelloWorldCommandSet");

        this.sp = spfi().using(SPFx(this.context));

        // initial state of the command's visibility
        const compareCommandOne: Command =
            this.tryGetCommand("ITEM_PERMISSIONS");
        compareCommandOne.visible = false;
        const compareCommandTwo: Command =
            this.tryGetCommand("DUPLICATE_SELECTED");
        compareCommandTwo.visible = false;

        this.context.listView.listViewStateChangedEvent.add(
            this,
            this._onListViewStateChanged,
        );

        return Promise.resolve();
    }

    public onExecute(event: IListViewCommandSetExecuteEventParameters): void {
        switch (event.itemId) {
            case "ITEM_PERMISSIONS":
                const listId = this.context.pageContext.list.id;
                window.open(
                    `${
                        this.context.pageContext.web.absoluteUrl
                    }/_layouts/15/user.aspx?List=%7B${listId}%7D&obj=%7B${listId}%7D,${event.selectedRows[0].getValueByName(
                        "ID",
                    )},LISTITEM`,
                    "_blank",
                );
                break;
            case "DUPLICATE_SELECTED":
                this._makeCopy(event.selectedRows[0]);
                break;
            case "COMMAND_2":
                Dialog.alert(`${this.properties.sampleTextTwo}`).catch(() => {
                    /* handle error */
                });
                break;
            default:
                throw new Error("Unknown command");
        }
    }

    private _onListViewStateChanged = (
        args: ListViewStateChangedEventArgs,
    ): void => {
        Log.info(LOG_SOURCE, "List view state changed");

        const compareCommandOne: Command =
            this.tryGetCommand("ITEM_PERMISSIONS");
        if (compareCommandOne) {
            // This command should be hidden unless exactly one row is selected.

            compareCommandOne.visible =
                this.context.pageContext.list.permissions.hasPermission(
                    SPPermission.managePermissions,
                ) && this.context.listView.selectedRows?.length === 1;
        }

        const compareCommandTwo: Command =
            this.tryGetCommand("DUPLICATE_SELECTED");
        if (compareCommandTwo) {
            // This command should be hidden unless exactly one row is selected.

            compareCommandTwo.visible =
                this.context.listView.selectedRows?.length === 1;
        }

        // TODO: Add your logic here

        // You should call this.raiseOnChange() to update the command bar
        this.raiseOnChange();
    };

    private async _makeCopy(employee: any) {
        console.error("employee");
        console.warn(employee);
        console.warn(employee.getValueByName("JobTitle")[0].lookupId);
        console.warn(employee.getValueByName("DepartmentName")[0]);
        console.warn(new Date(employee.getValueByName("JoiningDate") + 1));
        console.error("employee");

        await this.sp.web.lists
            .getByTitle("Employee Lists")
            .items.add({
                Title: employee.getValueByName("Title"),
                Email: employee.getValueByName("Email"),
                Phone: employee.getValueByName("Phone"),
                // JobTitle: employee.getValueByName("JobTitle")[0],
                // DepartmentName: employee.getValueByName("DepartmentName")[0],
                JoiningDate: new Date(employee.getValueByName("JoiningDate")),
                Status: employee.getValueByName("Status"),
                Salary: Number(
                    employee
                        .getValueByName("Salary")
                        .replace(",", "")
                        .replace("৳", ""),
                ),
                WorkAddress: employee.getValueByName("WorkAddress"),
                Leave_x0020_Taken: employee.getValueByName("Leave_x0020_Taken"),
            })
            .then(() => Dialog.alert("Employee info duplicated"));
        this.raiseOnChange();
    }
}
