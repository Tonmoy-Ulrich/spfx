declare interface ICrudPnPWebPartStrings {
    PropertyPaneDescription: string;
    BasicGroupName: string;
    PropsGroupName: string;
    ListNameFieldLabel: string;
    DescriptionFieldLabel: string;
    AppLocalEnvironmentSharePoint: string;
    AppLocalEnvironmentTeams: string;
    AppSharePointEnvironment: string;
    AppTeamsTabEnvironment: string;
}

declare module "CrudPnPWebPartStrings" {
    const strings: ICrudPnPWebPartStrings;
    export = strings;
}
