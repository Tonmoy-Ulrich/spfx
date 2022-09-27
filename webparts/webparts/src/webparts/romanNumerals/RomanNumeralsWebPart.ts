import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
    IPropertyPaneConfiguration,
    PropertyPaneTextField,
    PropertyPaneToggle,
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import { IReadonlyTheme } from "@microsoft/sp-component-base";

import * as strings from "RomanNumeralsWebPartStrings";
import RomanNumerals from "./components/RomanNumerals";
import { IRomanNumeralsProps } from "./components/IRomanNumeralsProps";

export interface IRomanNumeralsWebPartProps {
    description: string;
    title: string;
    initialValue: string;
    inputCaption: string;
    resultCaption: string;
    showUpDownButtons: boolean;
}

export default class RomanNumeralsWebPart extends BaseClientSideWebPart<IRomanNumeralsWebPartProps> {
    private _isDarkTheme: boolean = false;
    private _environmentMessage: string = "";

    public render(): void {
        const element: React.ReactElement<IRomanNumeralsProps> =
            React.createElement(RomanNumerals, {
                description: this.properties.description,
                isDarkTheme: this._isDarkTheme,
                environmentMessage: this._environmentMessage,
                hasTeamsContext: !!this.context.sdks.microsoftTeams,
                userDisplayName: this.context.pageContext.user.displayName,
                title: this.properties.title,
                initialValue: this.properties.initialValue,
                inputCaption: this.properties.inputCaption,
                resultCaption: this.properties.resultCaption,
                showUpDownButtons: this.properties.showUpDownButtons,
            });

        ReactDom.render(element, this.domElement);
    }

    protected onInit(): Promise<void> {
        this._environmentMessage = this._getEnvironmentMessage();

        return super.onInit();
    }

    private _getEnvironmentMessage(): string {
        if (!!this.context.sdks.microsoftTeams) {
            // running in Teams
            return this.context.isServedFromLocalhost
                ? strings.AppLocalEnvironmentTeams
                : strings.AppTeamsTabEnvironment;
        }

        return this.context.isServedFromLocalhost
            ? strings.AppLocalEnvironmentSharePoint
            : strings.AppSharePointEnvironment;
    }

    protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
        if (!currentTheme) {
            return;
        }

        this._isDarkTheme = !!currentTheme.isInverted;
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
                            groupName: "General",
                            groupFields: [
                                PropertyPaneTextField("title", {
                                    label: "Web part title",
                                }),
                                PropertyPaneTextField("description", {
                                    label: "Description Text",
                                }),
                                PropertyPaneToggle("showUpDownButtons", {
                                    label: "Show increment/decrement buttons",
                                }),
                            ],
                        },
                        {
                            groupName: "Initialization",
                            groupFields: [
                                PropertyPaneTextField("initialValue", {
                                    label: "Initial Value (numeric)",
                                }),
                            ],
                        },
                        {
                            groupName: "Captions",
                            groupFields: [
                                PropertyPaneTextField("inputCaption", {
                                    label: "Caption for input control",
                                }),
                                PropertyPaneTextField("resultCaption", {
                                    label: "Caption for result",
                                }),
                            ],
                        },
                    ],
                },
            ],
        };
    }
}
