import { useEffect, useState } from "react";
import genreList from "../../assets/gen/genres.json";
import { PageProps } from "./WizardModal";
import { useDidUpdateEffect } from "@renderer/lib/useDidUpdateEffect";
import { PageContainer } from "./components/PageContainer";
import { SkriptoSession } from "@renderer/lib/skriptoSession";
interface IGenre{
    name: string;
    checked: boolean;
}

export default function WizardPlot({
    sessionId,
    onNext,
    onCancel
}: PageProps): React.ReactNode{
    const [idea, setIdea] = useState<string>("");
    const [genres, setGenres] = useState<IGenre[]>([]);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingText, setLoadingText] = useState<string>("");

    // チェック状態保存用の配列を初期化
    useEffect(()=>{
        const gen: IGenre[]=[];
        genreList.sort().map(e=>{
            gen.push({"name": e, "checked": false});
        })
        setGenres(gen);
    }, []);

    function onCheck(index: number, isCheck: boolean){
        genres[index].checked=isCheck;
        console.log(getSelectedGenres());
        setGenres(genres);
    }

    function getSelectedGenres(): string[]{
        let selected: string[] = [];
        genres.map((e)=>{
            if(e.checked)selected.push(e.name);
        })
        return selected;
    }

    async function process(){
        console.log(idea);
        console.log(getSelectedGenres());
        console.log(sessionId);
        const selectedGenres = getSelectedGenres();
        if(selectedGenres.length===0){
            //エラーダイアログを出す
            return;
        }
        setIsLoading(true);
        setLoadingText("プロットを生成しています");

        const skripto = SkriptoSession.get(sessionId);
        await skripto.makePlot(idea, selectedGenres);
        onNext();
    }

    return (
        <PageContainer
            hideBack
            hideNext={isLoading}
            onCancel={onCancel}
            onNext={process}
            isLoading={isLoading}
            loadingText={loadingText}
        >
            {/* アイデア・プロンプト */}
            <div className="flex flex-col text-white/40 text-sm w-[35%] flex-shrink-0">
                <div>アイデア・プロンプト</div>
                <textarea value={idea} onChange={e=>setIdea(e.target.value)} spellCheck="false" className="grow resize-none outline-none bg-white/5 hover:bg-white/10 focus:bg-white/10 transition text-white p-2 rounded"/>
            </div>

            {/* ジャンル選択 */}
            <div className="flex flex-col grow text-white/40 text-sm">
                <div>ジャンル</div>
                <div className="flex gap-4 flex-wrap">
                    {
                        genres.map((e, i)=>{
                            return(
                                <GenreCheckbox key={e.name} name={e.name} onCheck={(isCheck: boolean)=>onCheck(i, isCheck)}></GenreCheckbox>
                            )
                        })
                    }
                </div>
            </div>
        </PageContainer>
    )
}

function GenreCheckbox({
    name,
    onCheck
}: {
    name: string;
    onCheck: (boolean)=>void;
}): React.ReactNode{
    return (
        <label className="text-white/70 text-lg self-start">
            <input type="checkbox" className="mr-1" onChange={e=>onCheck(e.target.checked)}></input>
            {name}
        </label>
    )
}