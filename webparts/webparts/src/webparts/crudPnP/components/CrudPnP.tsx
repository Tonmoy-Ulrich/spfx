/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as React from "react";
import styles from "./CrudPnP.module.scss";
import { ICrudPnPProps } from "./ICrudPnPProps";
import { escape } from "@microsoft/sp-lodash-subset";
import { spfi, SPFI, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import Table from "./table/Table";

export default function CrudPnP(props: ICrudPnPProps): JSX.Element {
    const sp: SPFI = spfi().using(SPFx(props.context));
    //or if you need logging as well, you can use the following code -
    // const sp: SPFI = spfi().using(SPFx(props.context)).using(PNPLogging(LogLevel.Warning));

    const [isDisabledUpdate, setIsDisabledUpdate] = React.useState(true);
    const [listItems, setListItems] = React.useState([]);
    const [employeeInfos, setEmployeeInfos] = React.useState({
        title: "",
        jobTitleId: "",
        departmentNameId: "",
    });

    const [jobItems, setJobItems] = React.useState([]);
    const [deptItems, setDeptItems] = React.useState([]);

    const change = (e: any): void => {
        const attr: string = e.target.name;
        const val: string = e.target.value;
        setEmployeeInfos({ ...employeeInfos, [attr]: val });

        if (
            employeeInfos.title !== null &&
            employeeInfos.jobTitleId !== null &&
            employeeInfos.departmentNameId !== null
        ) {
            setIsDisabledUpdate(false);
        }
    };

    //Get all items
    const getAllItems = async () => {
        try {
            const items: any[] = await sp.web.lists
                .getByTitle(props.listName)
                .items();
            // console.log(items);

            if (items.length > 0) {
                const jobItems: any = await sp.web.lists
                    .getByTitle("Job Title Lists")
                    .items();
                const deptItems: any = await sp.web.lists
                    .getByTitle("Department Lists")
                    .items();

                setListItems(items);
                setJobItems(jobItems);
                setDeptItems(deptItems);
            } else {
                alert(`List is empty.`);
            }
        } catch (e) {
            console.error(e);
        }
    };

    React.useEffect(() => {
        getAllItems();
    }, []);

    //Create Item
    const createItem = async () => {
        try {
            const addItem = await sp.web.lists
                .getByTitle(props.listName)
                .items.add({
                    Title: employeeInfos.title,
                    JobTitleId: Number(employeeInfos.jobTitleId),
                    DepartmentNameId: Number(employeeInfos.departmentNameId),
                });
            await getAllItems();
            setIsDisabledUpdate(true);
            // console.log(addItem);
            alert(`Item created successfully with ID: ${addItem.data.ID}`);
        } catch (e) {
            console.error(e);
        }
    };

    //Get Item by ID
    const getItemById = async (id: any) => {
        try {
            const item: any = await sp.web.lists
                .getByTitle(props.listName)
                .items.getById(id);
            // console.log(item);
        } catch (e) {
            console.error(e);
        }
    };

    //Update Item
    const updateItem = async (employeeInfo: any) => {
        try {
            const itemUpdate = await sp.web.lists
                .getByTitle(props.listName)
                .items.getById(employeeInfo.id)
                .update({
                    Title: employeeInfo.title,
                    JobTitleId: Number(employeeInfo.jobTitleId),
                    DepartmentNameId: Number(employeeInfo.departmentNameId),
                });
            // console.log(itemUpdate);
            alert(`Item with ID: ${employeeInfo.id} updated successfully!`);
        } catch (e) {
            console.error(e);
        }
    };

    //Delete Item
    const deleteItem = async (id: any) => {
        if (
            !window.confirm(
                `Are you sure you want to delete the item with ${id}?`,
            )
        ) {
            return;
        }

        try {
            await sp.web.lists
                .getByTitle(props.listName)
                .items.getById(id)
                .delete();
            await getAllItems();
            alert(`Item ID: ${id} deleted successfully!`);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <section className={styles.reactCrudPnP}>
            <div className={styles.container}>
                <div className={styles.row}>
                    <div className={styles.column}>
                        <table>
                            <caption>{props.listName}</caption>
                            <tr>
                                <td>Id</td>
                                <td>Full Name</td>
                                <td>Job Title</td>
                                <td>Department Name</td>
                                <td>Action</td>
                            </tr>

                            {listItems?.map((item) => (
                                <Table
                                    key={item.Id}
                                    id={item.Id}
                                    title={item.Title}
                                    jobTitleId={item.JobTitleId}
                                    departmentNameId={item.DepartmentNameId}
                                    jobItems={jobItems}
                                    deptItems={deptItems}
                                    deleteCallback={deleteItem}
                                    updateCallback={updateItem}
                                />
                            ))}
                            <tr className={styles.container}>
                                <td></td>
                                <td>
                                    <input
                                        type="text"
                                        name="title"
                                        value={employeeInfos.title}
                                        placeholder="Full Name"
                                        onChange={(e) => change(e)}
                                    />
                                </td>
                                <td>
                                    <select
                                        name="jobTitleId"
                                        value={employeeInfos.jobTitleId}
                                        onChange={(e) => change(e)}
                                    >
                                        <option>select</option>
                                        {jobItems?.map((jobItem) => (
                                            <option
                                                key={jobItem.Id}
                                                value={jobItem.Id}
                                            >
                                                {jobItem.Title}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td>
                                    <select
                                        name="departmentNameId"
                                        value={employeeInfos.departmentNameId}
                                        onChange={(e) => change(e)}
                                    >
                                        <option>select</option>
                                        {deptItems?.map((deptItem) => (
                                            <option
                                                key={deptItem.Id}
                                                value={deptItem.Id}
                                            >
                                                {deptItem.Title}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td>
                                    <button
                                        className={styles.button}
                                        disabled={isDisabledUpdate}
                                        onClick={() => createItem()}
                                    >
                                        Create
                                    </button>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    );
}
