/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import styles from "./Table.module.scss";
import { SPFI, spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { PrimaryButton } from "@fluentui/react";

interface Props {
    context: any;
    callback: any;
}

const Table: React.FC<Props> = ({ context, callback }) => {
    const sp: SPFI = spfi().using(SPFx(context));

    const [employeeItems, setEmployeeItems] = React.useState([]);
    const [jobItems, setJobItems] = React.useState([]);
    const [deptItems, setDeptItems] = React.useState([]);

    //Get all items
    const getAllItems = async (): Promise<void> => {
        try {
            const items: any[] = await sp.web.lists
                .getByTitle("Employee Lists")
                .items();

            if (items.length > 0) {
                const jobItems: any = await sp.web.lists
                    .getByTitle("Job Title Lists")
                    .items();
                const deptItems: any = await sp.web.lists
                    .getByTitle("Department Lists")
                    .items();
                jobItems.forEach((item: any) => {
                    item.key = item.Id;
                    item.text = item.Title;
                });
                deptItems.forEach((item: any) => {
                    item.key = item.Id;
                    item.text = item.Title;
                });

                setEmployeeItems(items);
                setJobItems(jobItems);
                setDeptItems(deptItems);
            } else {
                alert(`List is empty.`);
            }
        } catch (e) {
            console.error(e);
        }
    };

    //Delete Item
    const deleteItem = async (id: any): Promise<void> => {
        if (
            !window.confirm(
                `Are you sure you want to delete the item with ${id}?`,
            )
        ) {
            return;
        }

        try {
            await sp.web.lists
                .getByTitle("Employee Lists")
                .items.getById(id)
                .delete();
            await getAllItems();

            alert(`Item ID: ${id} deleted successfully!`);
        } catch (e) {
            console.error(e);
        }
    };

    React.useEffect(() => {
        getAllItems();
    }, []);

    return (
        <section className={styles.customTable}>
            <div className={styles.container}>
                <div className={styles.row}>
                    <PrimaryButton
                        text="Back"
                        onClick={(e) => callback("button")}
                    />
                    <table>
                        <caption>Employee Lists</caption>
                        <tr>
                            <td>Id</td>
                            <td>Full Name</td>
                            <td>Email</td>
                            <td>Phone</td>
                            <td>Address</td>
                            <td>Joining Date</td>
                            <td>Status</td>
                            <td>Leave Taken</td>
                            <td>Salary</td>
                            <td>Calculated Salary</td>
                            <td>Job Title</td>
                            <td>Department Name</td>
                            <td>Actions</td>
                        </tr>
                        {employeeItems?.map((employeeInfo: any, index: any) => (
                            <tr className={styles.dataContainer} key={index}>
                                <td>
                                    <input
                                        type="text"
                                        name="id"
                                        value={employeeInfo.Id}
                                        readOnly
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        name="title"
                                        readOnly
                                        value={employeeInfo.Title}
                                        placeholder="Full Name"
                                    />
                                </td>
                                <td>
                                    <input
                                        type="email"
                                        name="email"
                                        readOnly
                                        value={employeeInfo.Email}
                                        placeholder="Email Address"
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        name="phone"
                                        readOnly
                                        value={employeeInfo.Phone}
                                        placeholder="Phone Number"
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        name="address"
                                        readOnly
                                        value={employeeInfo.WorkAddress}
                                        placeholder="Address"
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        name="joiningDate"
                                        readOnly
                                        value={employeeInfo.JoiningDate}
                                        placeholder="Joining Date"
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        name="statue"
                                        readOnly
                                        value={employeeInfo.Status}
                                        placeholder="Joining Date"
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        name="leaveTaken"
                                        readOnly
                                        value={employeeInfo.Leave_x0020_Taken}
                                        placeholder="Leave Taken"
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        name="salary"
                                        readOnly
                                        value={employeeInfo.Salary}
                                        placeholder="Joining Date"
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        name="calculatedSalary"
                                        readOnly
                                        value={
                                            employeeInfo.Calculated_x0020_Salary
                                        }
                                        placeholder="Calculated Salary"
                                    />
                                </td>
                                <td>
                                    <select
                                        name="jobTitleId"
                                        value={employeeInfo.JobTitleId}
                                    >
                                        {jobItems?.map((jobItem: any) =>
                                            jobItem.Id ===
                                            employeeInfo.JobTitleId ? (
                                                <option
                                                    key={jobItem.Id}
                                                    value={jobItem.Id}
                                                >
                                                    {jobItem.Title}
                                                </option>
                                            ) : (
                                                ""
                                            ),
                                        )}
                                    </select>
                                </td>
                                <td>
                                    <select
                                        name="departmentNameId"
                                        value={employeeInfo.departmentNameId}
                                    >
                                        {deptItems?.map((deptItem: any) =>
                                            deptItem.Id ===
                                            employeeInfo.DepartmentNameId ? (
                                                <option
                                                    key={deptItem.Id}
                                                    value={deptItem.Id}
                                                >
                                                    {deptItem.Title}
                                                </option>
                                            ) : (
                                                ""
                                            ),
                                        )}
                                    </select>
                                </td>
                                <td className={styles.buttonFlex}>
                                    <button
                                        className={styles.button}
                                        onClick={(e) =>
                                            callback("create", employeeInfo.Id)
                                        }
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className={`${styles.button} ${styles.danger}`}
                                        onClick={() =>
                                            deleteItem(employeeInfo.Id)
                                        }
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </table>
                </div>
            </div>
        </section>
    );
};

export default Table;
