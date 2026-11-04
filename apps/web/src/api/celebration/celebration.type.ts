export type CelebrationEffect = "coins" | "petals" | "confetti" | "lights";

export interface CelebrationConfig {
  id: string;
  name: string;
  message: string;
  effect: CelebrationEffect;
  accentColor: string;
  startsAt: string;
  endsAt: string;
  yearly: boolean;
  isEnabled: boolean;
}
