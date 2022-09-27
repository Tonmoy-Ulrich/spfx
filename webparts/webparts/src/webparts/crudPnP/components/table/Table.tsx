/* eslint-disable react/jsx-no-bind */
import * as React from "react";
import styles from "./Table.module.scss";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

const Table = ({
    id,
    title,
    jobTitleId,
    departmentNameId,
    jobItems,
    deptItems,
    deleteCallback,
    updateCallback,
}: any): JSX.Element => {
    const [employeeInfo, setEmployeeInfo] = React.useState({
        id: id,
        title: title,
        jobTitleId: jobTitleId,
        departmentNameId: departmentNameId,
        isDisabledUpdate: true,
    });

    const [isDisabledUpdate, setIsDisabledUpdate] = React.useState(true);

    const change = (e): void => {
        const attr: string = e.target.name;
        const val: string = e.target.value;
        setEmployeeInfo({ ...employeeInfo, [attr]: val });
        setIsDisabledUpdate(false);
        // console.log(employeeInfo);
    };

    return (
        <tr className={styles.container}>
            <td>
                <input type="text" name="id" value={employeeInfo.id} readOnly />
            </td>
            <td>
                <input
                    type="text"
                    name="title"
                    value={employeeInfo.title}
                    placeholder="Full Name"
                    onChange={(e) => change(e)}
                />
            </td>
            <td>
                <select
                    name="jobTitleId"
                    value={employeeInfo.jobTitleId}
                    onChange={(e) => change(e)}
                >
                    {jobItems?.map((jobItem) => (
                        <option key={jobItem.Id} value={jobItem.Id}>
                            {jobItem.Title}
                        </option>
                    ))}
                </select>
            </td>
            <td>
                <select
                    name="departmentNameId"
                    value={employeeInfo.departmentNameId}
                    onChange={(e) => change(e)}
                >
                    {deptItems?.map((deptItem) => (
                        <option key={deptItem.Id} value={deptItem.Id}>
                            {deptItem.Title}
                        </option>
                    ))}
                </select>
            </td>
            <td>
                <button
                    className={styles.button}
                    onClick={() => {
                        updateCallback(employeeInfo);
                        setIsDisabledUpdate(true);
                    }}
                    disabled={isDisabledUpdate}
                >
                    Update
                </button>
                <button
                    className={`${styles.button} ${styles.danger}`}
                    onClick={() => deleteCallback(employeeInfo.id)}
                >
                    Delete
                </button>
            </td>
        </tr>
    );
};

export default Table;
