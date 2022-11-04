/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import styles from "./CustomForm.module.scss";
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

interface Props {
    context: any;
    employeeId: any;
    callback: any;
}

const CustomForm: React.FC<Props> = ({ context, employeeId, callback }) => {
    const sp: SPFI = spfi().using(SPFx(context));

    const [msg, setMsg] = React.useState<any>(undefined);
    const [employeeInfos, setEmployeeInfos] = React.useState({
        Title: "",
        Email: "",
        Phone: "",
        WorkAddress: "",
        DepartmentNameId: "",
        JobTitleId: "",
        JoiningDate: "",
        Salary: "",
    });

    const [jobItems, setJobItems] = React.useState([]);
    const [deptItems, setDeptItems] = React.useState([]);

    //Get all items
    const getAllItems = async (): Promise<void> => {
        try {
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

            setJobItems(jobItems);
            setDeptItems(deptItems);
        } catch (e) {
            console.error(e);
        }
    };

    //Create Item
    const createItem = async (): Promise<void> => {
        if (
            employeeInfos.Title === "" &&
            employeeInfos.Email === "" &&
            employeeInfos.Phone === "" &&
            employeeInfos.WorkAddress === "" &&
            employeeInfos.DepartmentNameId === "" &&
            employeeInfos.JobTitleId === "" &&
            employeeInfos.JoiningDate === "" &&
            employeeInfos.Salary === ""
        ) {
            setMsg({
                scope: MessageBarType.error,
                Message: `Employee Name, Email, Phone Number, Address, Department Name, Job Title, Joining Date and Salary cant be empty`,
            });
        } else if (employeeInfos.Title === "") {
            setMsg({
                scope: MessageBarType.error,
                Message: `Employee Name cant be empty`,
            });
        } else if (employeeInfos.Email === "") {
            setMsg({
                scope: MessageBarType.error,
                Message: `Employee Email Address cant be empty`,
            });
        } else if (employeeInfos.Phone === "") {
            setMsg({
                scope: MessageBarType.error,
                Message: `Employee  Phone Number cant be empty`,
            });
        } else if (employeeInfos.WorkAddress === "") {
            setMsg({
                scope: MessageBarType.error,
                Message: `Employee  Address cant be empty`,
            });
        } else if (employeeInfos.DepartmentNameId === "") {
            setMsg({
                scope: MessageBarType.error,
                Message: `Employee  Department Name cant be empty`,
            });
        } else if (employeeInfos.JobTitleId === "") {
            setMsg({
                scope: MessageBarType.error,
                Message: `Employee  Job Title cant be empty`,
            });
        } else if (employeeInfos.JoiningDate === "") {
            setMsg({
                scope: MessageBarType.error,
                Message: `Employee  Joining Date  cant be empty`,
            });
        } else if (employeeInfos.Salary === "") {
            setMsg({
                scope: MessageBarType.error,
                Message: `Employee  Salary cant be empty`,
            });
        } else {
            try {
                const addItem = await sp.web.lists
                    .getByTitle("Employee Lists")
                    .items.add({
                        Title: employeeInfos.Title,
                        Email: employeeInfos.Email,
                        Phone: employeeInfos.Phone,
                        WorkAddress: employeeInfos.WorkAddress,
                        DepartmentNameId: Number(
                            employeeInfos.DepartmentNameId,
                        ),
                        JobTitleId: Number(employeeInfos.JobTitleId),
                        JoiningDate: new Date(employeeInfos.JoiningDate),
                        Salary: Number(employeeInfos.Salary),
                    });

                setEmployeeInfos({
                    Title: "",
                    Email: "",
                    Phone: "",
                    WorkAddress: "",
                    DepartmentNameId: "",
                    JobTitleId: "",
                    JoiningDate: "",
                    Salary: "",
                });

                setMsg({
                    scope: MessageBarType.success,
                    Message: `Item created successfully with ID: ${addItem.data.ID}`,
                });
            } catch (e) {
                console.error(e);
            }
        }
    };

    //Get Item by ID
    const getItemById = async (id: any): Promise<void> => {
        try {
            const item: any = await sp.web.lists
                .getByTitle("Employee Lists")
                .items.getById(id)();

            setEmployeeInfos(item);
        } catch (e) {
            console.error(e);
        }
    };

    //Update Item
    const updateItem = async (): Promise<void> => {
        try {
            await sp.web.lists
                .getByTitle("Employee Lists")
                .items.getById(employeeId)
                .update({
                    Title: employeeInfos.Title,
                    Email: employeeInfos.Email,
                    Phone: employeeInfos.Phone,
                    WorkAddress: employeeInfos.WorkAddress,
                    DepartmentNameId: Number(employeeInfos.DepartmentNameId),
                    JobTitleId: Number(employeeInfos.JobTitleId),
                    JoiningDate: new Date(employeeInfos.JoiningDate),
                    Salary: Number(employeeInfos.Salary),
                });
            setMsg({
                scope: MessageBarType.warning,
                Message: `Item updated successfully with ID: ${employeeId}`,
            });
        } catch (e) {
            console.error(e);
        }
    };

    const clear = (): void => {
        setEmployeeInfos({
            Title: "",
            Email: "",
            Phone: "",
            WorkAddress: "",
            DepartmentNameId: "",
            JobTitleId: "",
            JoiningDate: "",
            Salary: "",
        });

        setMsg({
            scope: MessageBarType.warning,
            Message: "Form has been cleared",
        });
    };

    const change = (e: any): void => {
        const attr: string = e.target.name;
        const val: string = e.target.value;
        setEmployeeInfos({ ...employeeInfos, [attr]: val });
    };

    const dropdownChange = (name: string, item: any): void => {
        const attr: string = name;
        const val: string = item.Id;
        setEmployeeInfos({ ...employeeInfos, [attr]: val });
    };

    const handleSubmit = (): void => {
        if (employeeId) {
            updateItem();
        } else {
            createItem();
        }
    };

    React.useEffect(() => {
        getAllItems();
    }, []);
    React.useEffect(() => {
        getItemById(employeeId);
    }, [employeeId]);
    React.useEffect(() => {
        setTimeout(() => {
            setMsg(undefined);
        }, 10000);
    }, [msg]);

    return (
        <section className={styles.customForm}>
            <div className={styles.container}>
                <div className={styles.row}>
                    <PrimaryButton
                        text="Back"
                        onClick={(e) => callback("button")}
                    />
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
                                    name="Title"
                                    value={employeeInfos.Title}
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
                                    name="Email"
                                    type="email"
                                    value={employeeInfos.Email}
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
                                    name="Phone"
                                    type="number"
                                    value={employeeInfos.Phone}
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
                                    name="WorkAddress"
                                    multiline
                                    value={employeeInfos.WorkAddress}
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
                                    selectedKey={employeeInfos.DepartmentNameId}
                                    onChange={(e, item) =>
                                        dropdownChange("DepartmentNameId", item)
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
                                    selectedKey={employeeInfos.JobTitleId}
                                    onChange={(e, item) =>
                                        dropdownChange("JobTitleId", item)
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
                                            ["JoiningDate"]: e.toString(),
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
                                    name="Salary"
                                    type="number"
                                    value={employeeInfos.Salary}
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
                                    text={employeeId ? "Upload" : "Submit"}
                                    onClick={() => handleSubmit()}
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
            </div>
        </section>
    );
};

export default CustomForm;
