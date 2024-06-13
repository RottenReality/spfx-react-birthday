import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IBirthdayProps {
  context: WebPartContext,
  listGuid:string,
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  onConfigure: () => void;
}
