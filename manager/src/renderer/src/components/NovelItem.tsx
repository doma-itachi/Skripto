import { FaPlay, FaDeleteLeft, FaFolderOpen } from "react-icons/fa6";
import { Scenario } from "src/globals";

export default function NovelItem({
    scenario,
    onPlay,
    onOpenInExplorer,
    onDelete
}: {
    scenario: Scenario
    onPlay?: ()=>void
    onOpenInExplorer?: ()=>void
    onDelete?: ()=>void
}): React.ReactNode{
    return (
        <div className="flex items-center">
            {/* Info */}
            <div className="flex flex-col text-white flex-grow">
                <div className="text-xl">
                    {scenario.title}
                </div>
                <div className="text-neutral-500 text-sm">
                    ジャンル: {scenario.genres.join(", ")}
                </div>
            </div>

            {/* Operation */}
            <div className="flex text-white gap-2">
                <FaPlay title="プレイ" onClick={onPlay} size={28} className="hover:bg-white/20 p-1 rounded-md transition cursor-pointer"></FaPlay>
                <FaFolderOpen title="エクスプローラで開く" onClick={onOpenInExplorer} size={28} className="hover:bg-white/20 p-1 rounded-md transition cursor-pointer"></FaFolderOpen>
                <FaDeleteLeft title="削除" onClick={onDelete} size={28} className="hover:bg-white/20 p-1 rounded-md transition cursor-pointer"></FaDeleteLeft>
            </div>
        </div>
    )
}