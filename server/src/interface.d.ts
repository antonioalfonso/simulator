export interface State {
  accelerator   : number;
  brake         : number;
  swerve        : string;
  onChange     ?: any;
  triggerChange?: any;
}

export interface StateChangeHandler {
  (state: State, channel: string): void;
}

export interface Pins {
  accelerator: number;
  brake      : number;
  swerve     : number;
}
