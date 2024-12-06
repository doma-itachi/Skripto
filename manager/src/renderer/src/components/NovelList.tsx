import NovelItem from "./NovelItem";
import {Scenario} from "../../../globals"
import WizardModal from "./wizard/WizardModal";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { scenarioAtom } from "@renderer/lib/atoms";
import { Setting } from "@renderer/lib/setting";
import path from "path-browserify";
import { ScenarioLoader } from "@renderer/lib/ScenarioLoader";

export default function NovelList(): React.ReactNode{
    const [scenarios, setScenarios] = useAtom(scenarioAtom);

    useEffect(()=>{
        //シナリオ一覧の読み込み
        (async()=>{
            setScenarios(await ScenarioLoader.load());
        })();
    }, []);

    const [wizardOpen, setWizardOpen] = useState<boolean>(false);

    function getScenarioPath(id){
        return path.join(Setting.data?.savePath!, `${id}.rsd`).replace(/[/|\\]/g, "\\");
    }

    function playScenario(id: string){
        // シナリオのパス
        const scenarioPath = getScenarioPath(id);
        const godotPath = Setting.data?.godotPath;
        const workdir = Setting.data?.viewerPath;
        window.processAPI.exec(`${godotPath} ${scenarioPath}`, workdir!);
    }

    function openInExplorer(id: string){
        const scenarioPath = getScenarioPath(id);
        window.processAPI.exec(`explorer.exe /select,"${scenarioPath}"`);
    }

    async function deleteScenario(id: string){
        const scenarioPath = getScenarioPath(id);
        const scenarioList = await ScenarioLoader.load();
        const index = scenarioList.findIndex(e=>e.id===id);
        scenarioList.splice(index, 1);
        setScenarios(scenarioList);
        window.fileAPI.deleteFile(scenarioPath);
        ScenarioLoader.save(scenarioList);
    }

    return (
        <div className="grow px-4 select-none flex flex-col overflow-hidden">
            <div className="text-neutral-400 mb-1">ノベル一覧</div>
            <div className="px-2 flex grow flex-col gap-3 overflow-y-scroll hidden-scrollbar">
                {
                    scenarios.map(e=>{
                        return(
                            <NovelItem key={e.id} scenario={e} onPlay={()=>playScenario(e.id)} onOpenInExplorer={()=>openInExplorer(e.id)} onDelete={()=>deleteScenario(e.id)}></NovelItem>
                        )
                    })
                }

                {/* 新しいノベル */}
                <div onClick={()=>setWizardOpen(true)} className="cursor-pointer text-white bg-white/5 hover:bg-white/10 transition border-white/30 p-3 text-xl border rounded-lg flex justify-center border-dashed">
                    新しいシナリオを作成
                </div>
                <WizardModal open={wizardOpen} onOpenChange={setWizardOpen}></WizardModal>
            </div>
        </div>
    )
}