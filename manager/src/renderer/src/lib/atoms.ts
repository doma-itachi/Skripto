import { atom } from "jotai";
import { Scenario } from "src/globals";

type Pages = "home" | "settings";

export const pageAtom = atom<Pages>("home");

export const scenarioAtom = atom<Scenario[]>([]);