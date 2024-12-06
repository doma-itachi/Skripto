export interface SettingItems{
    apiKey: string;
    savePath: string;
    viewerPath: string;
    godotPath: string;
}
export const CONFIG_PATH = "./settings.json"
export class Setting{
    public static data?: SettingItems;
    static async load(){
        if(await window.fileAPI.isExist(CONFIG_PATH)){
            this.data = JSON.parse(await window.fileAPI.readTextFile(CONFIG_PATH));
        }
    }
}