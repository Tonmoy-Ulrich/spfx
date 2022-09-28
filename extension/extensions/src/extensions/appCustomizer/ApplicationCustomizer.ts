import { Log } from "@microsoft/sp-core-library";
import {
    BaseApplicationCustomizer,
    PlaceholderContent,
    PlaceholderName,
} from "@microsoft/sp-application-base";
import styles from "./ApplicationCustomizer.module.scss";
import { Dialog } from "@microsoft/sp-dialog";
import { SPFI, spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import * as strings from "ApplicationCustomizerStrings";

const LOG_SOURCE: string = "ApplicationCustomizer";

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IApplicationCustomizerProperties {
    // This is an example; replace with your own property
    Top: string;
    Bottom: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class ApplicationCustomizer extends BaseApplicationCustomizer<IApplicationCustomizerProperties> {
    private _topPlaceholder: PlaceholderContent | undefined;
    private _bottomPlaceholder: PlaceholderContent | undefined;

    private sp: SPFI = null;
    private _notAcceptedTasks: any[];

    public async onInit(): Promise<void> {
        Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);

        // * Get Login user assigned project
        this.sp = spfi().using(SPFx(this.context));

        const currentUser = this.context.pageContext.user;

        const projectItems: any[] = await this.sp.web.lists
            .getByTitle("Project Lists")
            .items();
        const employees: any[] = await this.sp.web.lists
            .getByTitle("Employee Lists")
            .items();
        const currentUserItem: any = employees.filter(
            (item) => item.Email === currentUser.loginName,
        );

        const newAssignedProjects: any[] = projectItems.filter(
            (project) =>
                project.AssignedToId === currentUserItem[0].Id &&
                project.IsAccepted === false,
        );
        this._notAcceptedTasks = newAssignedProjects;

        // Wait for the placeholders to be created (or handle them being changed) and then
        // render.

        this.context.placeholderProvider.changedEvent.add(
            this,
            this._renderPlaceHolders,
        );

        return Promise.resolve();
    }

    private _renderPlaceHolders(): void {
        console.log("ApplicationCustomizer._renderPlaceHolders()");
        console.log(
            "Available placeholders: ",
            this.context.placeholderProvider.placeholderNames
                .map((name) => PlaceholderName[name])
                .join(", "),
        );

        // Handling the top placeholder
        if (!this._topPlaceholder) {
            this._topPlaceholder =
                this.context.placeholderProvider.tryCreateContent(
                    PlaceholderName.Top,
                    { onDispose: this._onDispose },
                );
            window.addEventListener("beforeunload", (_e) => {
                this._topPlaceholder.dispose();
            });

            // The extension should not assume that the expected placeholder is available.
            if (!this._topPlaceholder) {
                console.error("The expected placeholder (Top) was not found.");
                return;
            }

            if (this.properties) {
                let topString: string = this.properties.Top;

                if (this._notAcceptedTasks.length > 0) {
                    topString = `You have New project assigned which need to be accepted &nbsp;&nbsp;
                        <a href="https://nstechltd.sharepoint.com/sites/SharePointRnD/Lists/Project%20Lists/AllItems.aspx">
                            GoTo List
                        </a>`;
                }

                if (!topString) {
                    topString = `Top property was not defined.`;
                }

                if (this._topPlaceholder.domElement) {
                    this._topPlaceholder.domElement.innerHTML = `
                    <div class="${styles.app}">
                        <div class="${styles.top}">
                            <i class="ms-Icon ms-Icon--Info" aria-hidden="true"></i> ${topString}
                        </div>
                    </div>`;
                }
            }
        }

        // Handling the bottom placeholder
        if (!this._bottomPlaceholder) {
            this._bottomPlaceholder =
                this.context.placeholderProvider.tryCreateContent(
                    PlaceholderName.Bottom,
                    { onDispose: this._onDispose },
                );

            window.addEventListener("beforeunload", (_e) => {
                this._bottomPlaceholder.dispose();
            });

            // The extension should not assume that the expected placeholder is available.
            if (!this._bottomPlaceholder) {
                console.error(
                    "The expected placeholder (Bottom) was not found.",
                );
                return;
            }

            if (this.properties) {
                let bottomString: string = this.properties.Bottom;
                if (!bottomString) {
                    bottomString = "Bottom property was not defined.";
                }

                if (this._bottomPlaceholder.domElement) {
                    this._bottomPlaceholder.domElement.innerHTML = `
                        <div class="${styles.app}">
                            <div class="${styles.bottom}">
                                <i class="ms-Icon ms-Icon--Info" aria-hidden="true"></i> ${bottomString}
                            </div>
                        </div>`;
                }
            }
        }
    }

    private _onDispose(): void {
        console.log(
            "[HelloWorldApplicationCustomizer._onDispose] Disposed custom top and bottom placeholders.",
        );
    }
}
