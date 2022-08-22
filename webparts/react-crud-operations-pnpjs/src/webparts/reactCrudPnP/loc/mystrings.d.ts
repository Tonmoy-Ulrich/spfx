declare interface IReactCrudPnPWebPartStrings {
    PropertyPaneDescription: string;
    PropsGroupName: string;
    ListNameFieldLabel: string;
    AppLocalEnvironmentSharePoint: string;
    AppLocalEnvironmentTeams: string;
    AppSharePointEnvironment: string;
    AppTeamsTabEnvironment: string;
}

declare module "ReactCrudPnPWebPartStrings" {
    const strings: IReactCrudPnPWebPartStrings;
    export = strings;
}
