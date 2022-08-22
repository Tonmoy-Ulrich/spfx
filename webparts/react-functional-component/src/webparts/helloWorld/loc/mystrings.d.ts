declare interface IHelloWorldWebPartStrings {
    PropertyPaneDescription: string;
    BasicGroupName: string;
    DescriptionFieldLabel: string;
    TitleFieldLabel: string;
    AppLocalEnvironmentSharePoint: string;
    AppLocalEnvironmentTeams: string;
    AppSharePointEnvironment: string;
    AppTeamsTabEnvironment: string;
}

declare module "HelloWorldWebPartStrings" {
    const strings: IHelloWorldWebPartStrings;
    export = strings;
}
