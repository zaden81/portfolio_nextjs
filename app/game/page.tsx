import type { Metadata } from "next";
import GameClient from "./GameClient";

export const metadata: Metadata = {
  title: "Block Smasher - Game",
  description: "Angry Birds style physics game. Destroy blocks with your slingshot!",
};

export default function GamePage() {
  return <GameClient />;
}
