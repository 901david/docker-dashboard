/// <reference types="node" />

declare module "react-use-mapped-state" {
  type MappedStateEntry = { [key: string]: any };

  export function valueSetter(reference: string, value: any): void;

  type MappedReturnValues = Array<Array<{ [key: string]: any }>, valueSetter>;

  export function useMappedState(
    stateValues: MappedStateEntry
  ): MappedReturnValues;
}
