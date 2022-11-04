import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
    IPropertyPaneConfiguration,
    PropertyPaneTextField,
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import { IReadonlyTheme } from "@microsoft/sp-component-base";

import * as strings from "FluentUiFormWebPartStrings";
import FluentUiForm from "./components/FluentUiForm";
import { IFluentUiFormProps } from "./components/IFluentUiFormProps";

export interface IFluentUiFormWebPartProps {
    listName: string;
}

export default class FluentUiFormWebPart extends BaseClientSideWebPart<IFluentUiFormWebPartProps> {
    public render(): void {
        const element: React.ReactElement<IFluentUiFormProps> =
            React.createElement(FluentUiForm, {
                context: this.context,
                listName: this.properties.listName,
            });

        ReactDom.render(element, this.domElement);
    }

    protected onInit(): Promise<void> {
        return super.onInit();
    }

    protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
        if (!currentTheme) {
            return;
        }

        const { semanticColors } = currentTheme;

        if (semanticColors) {
            this.domElement.style.setProperty(
                "--bodyText",
                semanticColors.bodyText || null,
            );
            this.domElement.style.setProperty(
                "--link",
                semanticColors.link || null,
            );
            this.domElement.style.setProperty(
                "--linkHovered",
                semanticColors.linkHovered || null,
            );
        }
    }

    protected onDispose(): void {
        ReactDom.unmountComponentAtNode(this.domElement);
    }

    protected get dataVersion(): Version {
        return Version.parse("1.0");
    }

    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
        return {
            pages: [
                {
                    header: {
                        description: strings.PropertyPaneDescription,
                    },
                    groups: [
                        {
                            groupName: strings.BasicGroupName,
                            groupFields: [
                                PropertyPaneTextField("listName", {
                                    label: strings.ListNameLabel,
                                }),
                            ],
                        },
                    ],
                },
            ],
        };
    }
}
