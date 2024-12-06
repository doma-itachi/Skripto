import { useEffect, useState } from "react"
import { useAtom } from "jotai";
import { Character, Skripto } from "@renderer/lib/skripto";
import { PageProps } from "./WizardModal";
import { useDidUpdateEffect } from "@renderer/lib/useDidUpdateEffect";
import { PageContainer } from "./components/PageContainer";
import { SkriptoSession } from "@renderer/lib/skriptoSession";
import path from "path-browserify";
import { Setting } from "@renderer/lib/setting";
import { Scenario } from "src/globals";
import { scenarioAtom } from "@renderer/lib/atoms";
import { ScenarioLoader } from "@renderer/lib/ScenarioLoader";
// import { characterAtom } from "@renderer/lib/atoms";

export default function WizardCharacter({
    sessionId,
    onNext,
    onBack,
    onCancel
}: PageProps): React.ReactNode{
    const [index, setIndex] = useState<number>(0);
    const [characters, setCharacters] = useState<Character[]>();
    const [scenarios, setScenarios] = useAtom(scenarioAtom);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingText, setLoadingText] = useState<string>("");

    useEffect(()=>{
        const skripto = SkriptoSession.get(sessionId);
        setCharacters(skripto.characters);
    }, []);

    async function process(){
        const skripto = SkriptoSession.get(sessionId);
        if(characters){
            skripto.characters = characters;
        }

        setIsLoading(true);
        setLoadingText("キャラクターに立ち絵を割り当てています")

        const characterJsonPath = path.join(Setting.data?.viewerPath!, "/resources/character/info.json");
        const characterJson = JSON.parse(await window.fileAPI.readTextFile(characterJsonPath));

        try{
            await skripto.assignSprite(characterJson);
        }
        catch(e){
            console.log(e);
            setIsLoading(false);
            return;
        }

        //ここから生成プロセス
        const backgroundJsonPath = path.join(Setting.data?.viewerPath!, "/resources/background/info.json");
        const backgroundJson = JSON.parse(await window.fileAPI.readTextFile(backgroundJsonPath));
        const musicJsonPath = path.join(Setting.data?.viewerPath!, "/resources/music/info.json");
        const musicJson = JSON.parse(await window.fileAPI.readTextFile(musicJsonPath));
        
        setLoadingText("スクリプトを生成しています");
        const result = await skripto.makeScript(backgroundJson, musicJson);
        
        const savePath = path.join(Setting.data?.savePath!, `${result.meta.id}.rsd`);
        await window.fileAPI.writeTextFile(savePath, result.script);

        const changedList = structuredClone(scenarios);
        changedList.push(result.meta);
        ScenarioLoader.save(changedList);
        setScenarios(changedList);
        onCancel();
    }

    return(
        <PageContainer
            onCancel={onCancel}
            onBack={onBack}
            onNext={process}
            isLoading={isLoading}
            loadingText={loadingText}
            hideNext={isLoading}
            hideBack={isLoading}
            nextLabel="生成"
        >
            {/* キャラクター選択 */}
            <div className="flex flex-col bg-white/5 w-64 rounded-md overflow-y-scroll hidden-scrollbar">
                {
                    characters && characters.map((e, i)=>{
                        return (
                            <CharacterButton
                                key={i}
                                label={e.name!==""?e.name:"名称未設定"}
                                onEditing={i==index}
                                onClick={()=>setIndex(i)}
                            />
                        )
                    })
                }
            </div>

            {
                characters &&
                <div className="flex-grow mx-2 flex flex-col gap-2">
                    {/* 名前・年齢・性別を列挙 */}
                    <div className="flex gap-4 items-end">
                        <InputBox
                            label="名前"
                            size={24}
                            value={characters[index].name}
                            onChange={(e)=>{
                                const tmp = [...characters];
                                tmp[index].name=e.target.value;
                                setCharacters(tmp);
                            }}
                        />
                        <InputBox
                            label="年齢"
                            fontSize="14px"
                            size={4}
                            value={!isNaN(characters[index].age)?characters[index].age.toString():""}
                            onChange={(e)=>{
                                const tmp = [...characters];
                                tmp[index].age=parseInt(e.target.value);
                                setCharacters(tmp);
                            }}
                        />
                        <GenderInputBox
                            label="性別"
                            onChange={(e)=>{
                                const ch = structuredClone(characters);
                                ch[index].isMale=e;
                                setCharacters(ch);
                            }}
                            fontSize="14px"
                            value={characters[index].isMale}
                        />
                    </div>

                    <InputBox
                        label="性格"
                        size={58}
                        value={characters[index].personality}
                        onChange={(e)=>{
                            const tmp = [...characters];
                            tmp[index].personality=e.target.value;
                            setCharacters(tmp);
                        }}
                    />
                    <InputBox
                        label="役割"
                        size={58}
                        value={characters[index].role}
                        onChange={(e)=>{
                            const tmp = [...characters];
                            tmp[index].role=e.target.value;
                            setCharacters(tmp);
                        }}
                    />
                </div>
            }
        </PageContainer>
    )
}

function InputBox({
    label,
    value,
    size = 12,
    fontSize = "16px",
    onChange
}: {
    label: string
    value: string
    size?: number
    fontSize?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>)=>void
}): React.ReactNode{
    return (
        <div>
            <div className="text-white/30 text-sm select-none">{label}</div>
            <input className={"p-1 outline-none rounded bg-white/10 hover:bg-white/20 focus:bg-white/20 transition text-white "+`text-[${fontSize}]`} size={size} value={value} onChange={onChange}></input>
        </div>
    )
}
function GenderInputBox({
    label,
    value,
    size = 12,
    fontSize = "16px",
    onChange
}: {
    label: string
    value: boolean
    size?: number
    fontSize?: string
    onChange?: (value: boolean)=>void
}): React.ReactNode{
    return (
        <div className="select-none">
            <div className="text-white/30 text-sm">{label}</div>
            <div
                className={"cursor-pointer p-1 outline-none rounded bg-white/10 hover:bg-white/20 focus:bg-white/20 transition inline-block text-white w-12 "+`text-[${fontSize}]`}
                onClick={()=>onChange?onChange(!value):undefined}
            >
                {value?"男":"女"}
            </div>
        </div>
    )
}

function CharacterButton({
    label,
    onEditing,
    onClick
}: {
    label: string
    onEditing?: boolean
    onClick?: ()=>void
}): React.ReactNode{
    return (
        <button
            className={"text-white text-left p-2 transition hover:bg-white/10 "+(onEditing?"bg-white/15":"")}
            onClick={onClick}
        >
            {label}
        </button>
    )
}

