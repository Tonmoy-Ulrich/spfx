declare interface ICommandCustomizerCommandSetStrings {
  Command1: string;
  Command2: string;
}

declare module 'CommandCustomizerCommandSetStrings' {
  const strings: ICommandCustomizerCommandSetStrings;
  export = strings;
}
