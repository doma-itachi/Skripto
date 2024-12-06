import { Setting } from "./setting";
import { SkriptoSession } from "./skriptoSession";
import prompts from "@renderer/assets/gen/prompts.toml?raw";

export async function AppInitialize(){
    await Setting.load();
    SkriptoSession.api_key = Setting.data?.apiKey;
    SkriptoSession.prompts = prompts;
}