import { useAtom } from "jotai"
import Logo from "../assets/logo.svg"
import LinkItem from "./sidebar/LinkItem"
import { pageAtom } from "@renderer/lib/atoms"
export default function Sidebar(): React.ReactNode{
    const [ page, setPage ] = useAtom(pageAtom);
    return (
        <>
            {/* ボタン類 */}
            <div className="grow flex flex-col m-4 gap-2">
                <LinkItem label="ホーム" onClick={()=>setPage("home")}/>
                <LinkItem label="設定" onClick={()=>setPage("settings")}/>
            </div>

            {/* ロゴ */}
            <div className="p-3 select-none">
                <img src={Logo} className="drop-shadow-lg"></img>
                <div className="text-center">
                    <div className="text-xs text-white bg-black/60 inline px-6 rounded-full">version 1.0 build</div>
                </div>
            </div>
        </>
    )
}