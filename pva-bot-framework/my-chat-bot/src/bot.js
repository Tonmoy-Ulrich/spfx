/* eslint-disable comma-dangle */
/* eslint-disable quotes */
/* eslint-disable template-curly-spacing */
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ActivityHandler, MessageFactory } from "botbuilder";
import { WaterfallDialog, ChoicePrompt } from "botbuilder-dialogs";

// export class EchoBot extends ActivityHandler {
export class EchoBot {
    constructor(conversationState, dialogs) {
        // super();

        this._conversationState = conversationState;
        this._dialogs = dialogs;
        this.userInfo = {
            FullName: "",
            Age: "",
            Gender: "",
            Address: "",
            Phone: "",
            Email: "",
        };
        this.addDialogs();

        /* // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        this.onMessage(async (context, next) => {
            const replyText = `Hello ${context.activity.text}, Welcome to Bot Framework`;
            await context.sendActivity(
                MessageFactory.text(replyText, replyText),
            );
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            const welcomeText = "What is your name?";
            for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    await context.sendActivity(
                        MessageFactory.text(welcomeText, welcomeText),
                    );
                }
            }
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        }); */
    }

    async onTurn(context) {
        const dc = await this._dialogs.createContext(context);
        await dc.continueDialog();

        if (
            context.activity.text !== null &&
            context.activity.text === "help"
        ) {
            await dc.beginDialog("help");
        } else if (
            context.activity.text === "hello" ||
            context.activity.text === "Hello"
        ) {
            await dc.beginDialog("hello");
        }

        await this._conversationState.saveChanges(context);
    }

    addDialogs() {
        this._dialogs.add(
            new WaterfallDialog("help", [
                async (step) => {
                    const choices = ["info1", "info2", "info3"];
                    const options = {
                        prompt: "What would you like to know",
                        choices: choices,
                    };
                    return await step.prompt("helpPrompt", options);
                },
                async (step) => {
                    switch (step.result.index) {
                        case 0:
                            await step.context.sendActivity(`* _info1_`);
                            break;
                        case 1:
                            await step.context.sendActivity(`*_info2_`);
                            break;
                        case 2:
                            await step.context.sendActivity(`*_info3_`);
                            break;
                        default:
                            break;
                    }
                    return await step.endDialog();
                },
            ]),
        );

        this._dialogs.add(new ChoicePrompt("helpPrompt"));

        this._dialogs.add(
            new WaterfallDialog("hello", [
                async (step) => {
                    const welcomeText = `Hello ${step.context.activity.recipient.name}, Welcome to Bot Framework`;
                    await step.context.sendActivity(
                        MessageFactory.text(welcomeText, welcomeText),
                    );

                    const choices = ["Yes", "No"];
                    const options = {
                        prompt: "Are you a new member of this Organization?",
                        choices: choices,
                    };
                    return await step.prompt("infoPrompt", options);
                },
                async (step) => {
                    switch (step.result.index) {
                        case 0:
                            const choices = ["Yes", "No"];
                            const options = {
                                prompt: "Have you given all your information??",
                                choices: choices,
                            };
                            return await step.prompt("infoPrompt", options);
                        case 1:
                            const endText = `Thank you for chatting with me. Hope you find your answer?`;
                            await step.context.sendActivity(
                                MessageFactory.text(endText, endText),
                            );
                            await step.endDialog();
                            break;
                        default:
                            break;
                    }
                },
                async (step) => {
                    switch (step.result.index) {
                        case 0:
                            const endText = `Thank you for chatting with me. Hope you find your answer?`;
                            await step.context.sendActivity(
                                MessageFactory.text(endText, endText),
                            );
                            await step.endDialog();
                            break;
                        case 1:
                            const replyText = `Then i will ask you some questions answer them correctly.`;
                            await step.context.sendActivity(
                                MessageFactory.text(replyText, replyText),
                            );
                            const nameText = `What is your Full Name?`;
                            await step.context.sendActivity(
                                MessageFactory.text(nameText, nameText),
                            );
                            break;
                        default:
                            break;
                    }
                },
                async (step) => {
                    this.userInfo.FullName = step.context.activity.text;
                    const ageText = `How old are you?`;
                    await step.context.sendActivity(
                        MessageFactory.text(ageText, ageText),
                    );
                },
                async (step) => {
                    this.userInfo.Age = step.context.activity.text;
                    const choices = ["Male", "Female"];
                    const options = {
                        prompt: "Choose your Gender.",
                        choices: choices,
                    };
                    return await step.prompt("genderPrompt", options);
                },
                async (step) => {
                    this.userInfo.Gender = step.result.value;
                    const addressText = `What is your current address?`;
                    await step.context.sendActivity(
                        MessageFactory.text(addressText, addressText),
                    );
                },
                async (step) => {
                    this.userInfo.Address = step.context.activity.text;
                    const phoneText = `What is your Phone Number?`;
                    await step.context.sendActivity(
                        MessageFactory.text(phoneText, phoneText),
                    );
                },
                async (step) => {
                    this.userInfo.Phone = step.context.activity.text;
                    const emailText = `What is your email address?`;
                    await step.context.sendActivity(
                        MessageFactory.text(emailText, emailText),
                    );
                },
                async (step) => {
                    this.userInfo.Email = step.context.activity.text;
                    const infoText = `Full Name : ${this.userInfo.FullName},
                                    Age : ${this.userInfo.Age},
                                    Gender : ${this.userInfo.Gender},
                                    Address : ${this.userInfo.Address},
                                    Phone : ${this.userInfo.Phone}
                                    Email : ${this.userInfo.Email}`;
                    await step.context.sendActivity(
                        MessageFactory.text(infoText, infoText),
                    );

                    const choices = ["Yes", "No"];
                    const options = {
                        prompt: "Are the given information's correct?",
                        choices: choices,
                    };
                    return await step.prompt("allInfoPrompt", options);
                },
                async (step) => {
                    switch (step.result.index) {
                        case 0:
                            const emailText = `Okay, Thank you for providing the information`;
                            await step.context.sendActivity(
                                MessageFactory.text(emailText, emailText),
                            );
                        case 1:
                            // TODO should retake all the information
                            await step.endDialog();
                            break;
                        default:
                            break;
                    }
                },
            ]),
        );

        this._dialogs.add(new ChoicePrompt("infoPrompt"));
        this._dialogs.add(new ChoicePrompt("genderPrompt"));
        this._dialogs.add(new ChoicePrompt("allInfoPrompt"));
    }
}
