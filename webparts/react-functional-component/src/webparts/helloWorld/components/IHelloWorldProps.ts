import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IHelloWorldProps {
    title: string;
    context: WebPartContext;
    description: string;
    environmentMessage: string;
    hasTeamsContext: boolean;
}
