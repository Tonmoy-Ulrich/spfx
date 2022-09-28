/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-floating-promises */
import * as React from "react";
import { useEffect, useState, FC } from "react";
import { SPFI } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { Guid } from "@microsoft/sp-core-library";
import { Label } from "office-ui-fabric-react/lib/Label";

export interface IDisplayFormProps {
    sp: SPFI;
    listGuid: Guid;
    itemId: number;
    onClose: () => void;
}

const DisplayForm: FC<IDisplayFormProps> = (props) => {
    const [employee, setEmployee] = useState({
        Title: "",
        Email: "",
        Phone: "",
        WorkAddress: "",
        DepartmentName: "",
        JobTitle: "",
        JoiningDate: "",
        Salary: "",
        Calculated_x0020_Salary: "",
        Status: "",
    });

    const populateItemForDisplay = async () => {
        const item: any = await props.sp.web.lists
            .getById(props.listGuid.toString())
            .items.select("ID", "Title")
            .getById(props.itemId)();

        const deptName: any = await props.sp.web.lists
            .getByTitle("Department Lists")
            .items.getById(item.DepartmentNameId)();

        const job: any = await props.sp.web.lists
            .getByTitle("Job Title Lists")
            .items.getById(item.JobTitleId)();

        if (item) {
            setEmployee({
                ...item,
                DepartmentName: deptName.Title,
                JobTitle: job.Title,
            });
        }
    };

    useEffect(() => {
        populateItemForDisplay();
    }, []);

    return (
        <React.Fragment>
            <div>Display Form</div>
            <div style={{ margin: "10px" }}>
                <b>Title: </b>&nbsp;<Label>{employee.Title}</Label>
                <b>Email: </b>&nbsp;<Label>{employee.Email}</Label>
                <b>Phone: </b>&nbsp;<Label>{employee.Phone}</Label>
                <b>Address: </b>&nbsp;<Label>{employee.WorkAddress}</Label>
                <b>DepartmentName: </b>&nbsp;
                <Label>{employee.DepartmentName}</Label>
                <b>JobTitle: </b>&nbsp;<Label>{employee.JobTitle}</Label>
                <b>JoiningDate: </b>&nbsp;<Label>{employee.JoiningDate}</Label>
                <b>Salary: </b>&nbsp;<Label>$ {employee.Salary}</Label>
                <b>Calculated Salary: </b>&nbsp;
                <Label>$ {employee.Calculated_x0020_Salary}</Label>
                <b>Status: </b>&nbsp;<Label>{employee.Status}</Label>
            </div>
        </React.Fragment>
    );
};

export default DisplayForm;
