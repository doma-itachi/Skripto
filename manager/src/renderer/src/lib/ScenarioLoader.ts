import path from "path-browserify";
import { Scenario } from "src/globals";
import { Setting } from "./setting";

export class ScenarioLoader{
    static async load(): Promise<Scenario[]>{
        const jsonPath = path.join(Setting.data?.savePath!, "saves.json");
            if(!await window.fileAPI.isExist(jsonPath)){
                await window.fileAPI.writeTextFile(jsonPath, "[]");
                return [];
            }

            const json = await window.fileAPI.readTextFile(jsonPath);
            return JSON.parse(json);
    }
    static save(scenarioList: Scenario[]){
        const jsonPath = path.join(Setting.data?.savePath!, "saves.json");
        window.fileAPI.writeTextFile(jsonPath, JSON.stringify(scenarioList, null, "\t"));
    }
}