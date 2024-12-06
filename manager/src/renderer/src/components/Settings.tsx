import { useEffect, useState } from "react";
import CategoryContainer from "./settings/CategoryContainer";
import InputItem from "./settings/InputItem";
import { CONFIG_PATH, Setting, SettingItems } from "@renderer/lib/setting";

export default function Settings(): React.ReactNode{
    const [items, setItems] = useState<SettingItems>();

    useEffect(()=>{
        (async ()=>{
            if(await window.fileAPI.isExist(CONFIG_PATH)){
                const settings = await window.fileAPI.readTextFile(CONFIG_PATH);
                setItems(JSON.parse(settings));
            }
            else{
                //設定ファイルが見つからなかったら
                const cfg: SettingItems = {
                    apiKey: "",
                    savePath: "",
                    viewerPath: "",
                    godotPath: ""
                }
                window.fileAPI.writeTextFile(CONFIG_PATH, JSON.stringify(cfg));
                setItems(cfg);
            }
        })();
    }, []);

    useEffect(()=>{
        //設定ファイルに保存
        if(items){
            Setting.data = items;
            window.fileAPI.writeTextFile(CONFIG_PATH, JSON.stringify(items));
        }
    }, [items]);

    return (
        <div className="m-4">
            <CategoryContainer title="APIキー">
                <InputItem onChange={(e)=>{
                    if(items){
                        const tmp = structuredClone(items);
                        tmp.apiKey = e.target.value;
                        setItems(tmp);
                    }
                }} type="password" value={items?.apiKey} title="OpenAI" description="OpenAIのAPIキーを指定します。シナリオ生成に必要です" placeholder="sk-"></InputItem>
            </CategoryContainer>
            <CategoryContainer title="パス">
                <InputItem onChange={(e)=>{
                    if(items){
                        const tmp = structuredClone(items);
                        tmp.savePath = e.target.value;
                        setItems(tmp);
                    }
                }} value={items?.savePath} title="保存先" description="生成されたシナリオファイルの保存先"></InputItem>

                <InputItem onChange={(e)=>{
                    if(items){
                        const tmp = structuredClone(items);
                        tmp.viewerPath = e.target.value;
                        setItems(tmp);
                    }
                }} value={items?.viewerPath} title="ビューアの場所" description="Skripto Viewerのパス"></InputItem>

                <InputItem onChange={(e)=>{
                    if(items){
                        const tmp = structuredClone(items);
                        tmp.godotPath = e.target.value;
                        setItems(tmp);
                    }
                }} value={items?.godotPath} title="godotの場所" description="godot実行ファイルのパス"></InputItem>
            </CategoryContainer>
        </div>
    )
}