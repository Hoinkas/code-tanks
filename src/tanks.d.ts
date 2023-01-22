declare module 'tanks' {
  export interface TanksSay {
    text: string;
  }
  
  export function say(options: TanksSay): string;
}