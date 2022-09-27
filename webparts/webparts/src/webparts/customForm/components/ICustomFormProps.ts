import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface ICustomFormProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  context: WebPartContext;
}
