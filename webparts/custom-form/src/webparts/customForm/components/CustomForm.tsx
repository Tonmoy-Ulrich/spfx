/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as React from "react";
import styles from "./CustomForm.module.scss";
import { ICustomFormProps } from "./ICustomFormProps";
import { escape } from "@microsoft/sp-lodash-subset";
import {
    DatePicker,
    DefaultButton,
    Dropdown,
    Label,
    MessageBar,
    MessageBarType,
    PrimaryButton,
    TextField,
} from "@fluentui/react";
import { SPFI, spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import Table from "./table/Table";

export default function CustomForm(props: ICustomFormProps): JSX.Element {
    const sp: SPFI = spfi().using(SPFx(props.context));

    const [msg, setMsg] = React.useState<any>(undefined);
    const [employeeInfos, setEmployeeInfos] = React.useState({
        title: "",
        email: "",
        phone: "",
        address: "",
        departmentNameId: "",
        jobTitleId: "",
        joiningDate: "",
        salary: "",
    });

    const [employeeItems, setEmployeeItems] = React.useState([]);
    const [jobItems, setJobItems] = React.useState([]);
    const [deptItems, setDeptItems] = React.useState([]);

    const change = (e: any): void => {
        const attr: string = e.target.name;
        const val: string = e.target.value;
        setEmployeeInfos({ ...employeeInfos, [attr]: val });
    };

    const dropdownChange = (name: string, item: any) => {
        const attr: string = name;
        const val: string = item.Id;
        setEmployeeInfos({ ...employeeInfos, [attr]: val });
    };

    //Get all items
    const getAllItems = async () => {
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
                console.log(employeeItems);
                console.log(items);

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
    React.useEffect(() => {
        setTimeout(() => {
            setMsg(undefined);
        }, 5000);
    }, [msg]);

    //Create Item
    const createItem = async () => {
        if (
            employeeInfos.title === "" &&
            employeeInfos.email === "" &&
            employeeInfos.phone === "" &&
            employeeInfos.address === "" &&
            employeeInfos.departmentNameId === "" &&
            employeeInfos.jobTitleId === "" &&
            employeeInfos.joiningDate === "" &&
            employeeInfos.salary === ""
        ) {
            setMsg({
                scope: MessageBarType.error,
                Message: `Employee Name, Email, Phone Number, Address, Department Name, Job Title, Joining Date and Salary cant be empty`,
            });
        } else if (employeeInfos.title === "") {
            setMsg({
                scope: MessageBarType.error,
                Message: `Employee Name cant be empty`,
            });
        } else if (employeeInfos.email === "") {
            setMsg({
                scope: MessageBarType.error,
                Message: `Employee Email Address cant be empty`,
            });
        } else if (employeeInfos.phone === "") {
            setMsg({
                scope: MessageBarType.error,
                Message: `Employee  Phone Number cant be empty`,
            });
        } else if (employeeInfos.address === "") {
            setMsg({
                scope: MessageBarType.error,
                Message: `Employee  Address cant be empty`,
            });
        } else if (employeeInfos.departmentNameId === "") {
            setMsg({
                scope: MessageBarType.error,
                Message: `Employee  Department Name cant be empty`,
            });
        } else if (employeeInfos.jobTitleId === "") {
            setMsg({
                scope: MessageBarType.error,
                Message: `Employee  Job Title cant be empty`,
            });
        } else if (employeeInfos.joiningDate === "") {
            setMsg({
                scope: MessageBarType.error,
                Message: `Employee  Joining Date  cant be empty`,
            });
        } else if (employeeInfos.salary === "") {
            setMsg({
                scope: MessageBarType.error,
                Message: `Employee  Salary cant be empty`,
            });
        } else {
            try {
                const addItem = await sp.web.lists
                    .getByTitle("Employee Lists")
                    .items.add({
                        Title: employeeInfos.title,
                        Email: employeeInfos.email,
                        Phone: employeeInfos.phone,
                        WorkAddress: employeeInfos.address,
                        DepartmentNameId: Number(
                            employeeInfos.departmentNameId,
                        ),
                        JobTitleId: Number(employeeInfos.jobTitleId),
                        JoiningDate: new Date(employeeInfos.joiningDate),
                        Salary: Number(employeeInfos.salary),
                    });

                setEmployeeInfos({
                    title: "",
                    email: "",
                    phone: "",
                    address: "",
                    departmentNameId: "",
                    jobTitleId: "",
                    joiningDate: "",
                    salary: "",
                });

                getAllItems();

                setMsg({
                    scope: MessageBarType.success,
                    Message: `Item created successfully with ID: ${addItem.data.ID}`,
                });
            } catch (e) {
                console.error(e);
            }
        }
    };
    const clear = () => {
        setEmployeeInfos({
            title: "",
            email: "",
            phone: "",
            address: "",
            departmentNameId: "",
            jobTitleId: "",
            joiningDate: "",
            salary: "",
        });

        setMsg({
            scope: MessageBarType.warning,
            Message: "Form has been cleared",
        });
    };

    return (
        <section className={styles.customForm}>
            <div className={styles.container}>
                <div className={styles.row}>
                    <div className={styles.title}>Custom Form</div>
                    <br /> <br />
                    <div className={styles.grid}>
                        <div className={styles.gridRow}>
                            <div className={styles.smallCol}>
                                <Label className={styles.label}>
                                    Employee Name
                                    <span className={styles.validation}>*</span>
                                </Label>
                            </div>
                            <div className={styles.largeCol}>
                                <TextField
                                    name="title"
                                    value={employeeInfos.title}
                                    onChange={change}
                                    placeholder="Enter Employee Name"
                                />
                            </div>
                        </div>
                        <div className={styles.gridRow}>
                            <div className={styles.smallCol}>
                                <Label className={styles.label}>
                                    Email
                                    <span className={styles.validation}>*</span>
                                </Label>
                            </div>
                            <div className={styles.largeCol}>
                                <TextField
                                    name="email"
                                    type="email"
                                    value={employeeInfos.email}
                                    onChange={change}
                                    placeholder="Enter Employee Email Address"
                                />
                            </div>
                        </div>
                        <div className={styles.gridRow}>
                            <div className={styles.smallCol}>
                                <Label className={styles.label}>
                                    Phone
                                    <span className={styles.validation}>*</span>
                                </Label>
                            </div>
                            <div className={styles.largeCol}>
                                <TextField
                                    name="phone"
                                    type="number"
                                    value={employeeInfos.phone}
                                    onChange={change}
                                    placeholder="Enter Employee Phone Number"
                                />
                            </div>
                        </div>
                        <div className={styles.gridRow}>
                            <div className={styles.smallCol}>
                                <Label className={styles.label}>
                                    Address
                                    <span className={styles.validation}>*</span>
                                </Label>
                            </div>
                            <div className={styles.largeCol}>
                                <TextField
                                    name="address"
                                    multiline
                                    value={employeeInfos.address}
                                    onChange={change}
                                    placeholder="Enter Employee Current Address"
                                />
                            </div>
                        </div>
                        <div className={styles.gridRow}>
                            <div className={styles.smallCol}>
                                <Label className={styles.label}>
                                    Department Name
                                    <span className={styles.validation}>*</span>
                                </Label>
                            </div>
                            <div className={styles.largeCol}>
                                <Dropdown
                                    label=""
                                    selectedKey={employeeInfos.departmentNameId}
                                    onChange={(e, item) =>
                                        dropdownChange("departmentNameId", item)
                                    }
                                    placeholder="Select Employee Department"
                                    options={deptItems}
                                />
                            </div>
                        </div>
                        <div className={styles.gridRow}>
                            <div className={styles.smallCol}>
                                <Label className={styles.label}>
                                    Job Title
                                    <span className={styles.validation}>*</span>
                                </Label>
                            </div>
                            <div className={styles.largeCol}>
                                <Dropdown
                                    label=""
                                    selectedKey={employeeInfos.jobTitleId}
                                    onChange={(e, item) =>
                                        dropdownChange("jobTitleId", item)
                                    }
                                    placeholder="Select Employee Department"
                                    options={jobItems}
                                />
                            </div>
                        </div>
                        <div className={styles.gridRow}>
                            <div className={styles.smallCol}>
                                <Label className={styles.label}>
                                    Joining Date
                                    <span className={styles.validation}>*</span>
                                </Label>
                            </div>
                            <div className={styles.largeCol}>
                                <DatePicker
                                    isRequired
                                    placeholder="Enter Employee Joining Date"
                                    onSelectDate={(e) => {
                                        setEmployeeInfos({
                                            ...employeeInfos,
                                            ["joiningDate"]: e.toString(),
                                        });
                                    }}
                                />
                            </div>
                        </div>
                        <div className={styles.gridRow}>
                            <div className={styles.smallCol}>
                                <Label className={styles.label}>
                                    Salary
                                    <span className={styles.validation}>*</span>
                                </Label>
                            </div>
                            <div className={styles.largeCol}>
                                <TextField
                                    name="salary"
                                    type="number"
                                    value={employeeInfos.salary}
                                    onChange={change}
                                    placeholder="Enter Employee Salary"
                                />
                            </div>
                        </div>
                        {msg && msg.Message && (
                            <div className={styles.gridRow}>
                                <MessageBar
                                    messageBarType={
                                        msg.scope
                                            ? msg.scope
                                            : MessageBarType.info
                                    }
                                >
                                    {msg.Message}
                                </MessageBar>
                            </div>
                        )}
                        <div className={styles.gridRow}>
                            <div className={styles.smallCol}>
                                <PrimaryButton
                                    className={styles.button}
                                    text="Submit"
                                    onClick={() => createItem()}
                                />
                                <DefaultButton
                                    className={styles.button}
                                    text="Clear"
                                    onClick={() => clear()}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.tableRow}>
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
                        </tr>

                        {employeeItems?.map((item) => (
                            <Table
                                key={item.Id}
                                employeeInfo={item}
                                jobItems={jobItems}
                                deptItems={deptItems}
                            />
                        ))}
                    </table>
                </div>
            </div>
        </section>
    );
}
