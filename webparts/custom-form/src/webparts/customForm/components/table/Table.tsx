/* eslint-disable react/jsx-no-bind */
import * as React from "react";
import styles from "./Table.module.scss";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

const Table = ({ employeeInfo, jobItems, deptItems }: any): JSX.Element => {
    console.log(employeeInfo);

    return (
        <tr className={styles.container}>
            <td>
                <input type="text" name="id" value={employeeInfo.Id} readOnly />
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
                    value={employeeInfo.Calculated_x0020_Salary}
                    placeholder="Calculated Salary"
                />
            </td>
            <td>
                <select name="jobTitleId" value={employeeInfo.JobTitleId}>
                    {jobItems?.map((jobItem: any) =>
                        jobItem.Id === employeeInfo.JobTitleId ? (
                            <option key={jobItem.Id} value={jobItem.Id}>
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
                        deptItem.Id === employeeInfo.DepartmentNameId ? (
                            <option key={deptItem.Id} value={deptItem.Id}>
                                {deptItem.Title}
                            </option>
                        ) : (
                            ""
                        ),
                    )}
                </select>
            </td>
        </tr>
    );
};

export default Table;
