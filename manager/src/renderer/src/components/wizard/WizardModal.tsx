// import { motion, AnimatePresence } from "framer-motion";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import WizardPlot from "./WizardPlot";
import WizardCharacter from "./WizardCharacter";
import { useEffect, useState } from "react";
import { useDidUpdateEffect } from "@renderer/lib/useDidUpdateEffect";
import { SkriptoSession } from "@renderer/lib/skriptoSession";
import { Skripto } from "@renderer/lib/skripto";
import { Navbar } from "./components/navbar";

interface Page{
    title: string;
    jsx: React.ReactNode;
}

export interface PageProps{
    sessionId: string;
    onNext: () => void;
    onBack?: () => void;
    onCancel: () => void;
}

export default function WizardModal({
    open,
    onOpenChange
}: {
    open: boolean;
    onOpenChange: (boolean)=> void
}): React.ReactNode{
    const [pageIndex, setPageIndex] = useState<number>(0);
    const [sessionId, setSessionId] = useState<string>("");

    function onCancel(){
        onOpenChange(false);
    }

    const pages: Page[] = [
        {
            title: "プロットの生成",
            jsx: <WizardPlot sessionId={sessionId} onNext={()=>setPageIndex(1)} onCancel={onCancel}/>
        },
        {
            title: "キャラクターモディファイア",
            jsx: <WizardCharacter sessionId={sessionId} onNext={()=>console.log("ページの終端です")} onCancel={onCancel} onBack={()=>setPageIndex(0)}/>
        }
    ]

    useDidUpdateEffect(()=>{
        if(open){
            // モーダルが開かれたときの動作
            const id = SkriptoSession.start();
            setSessionId(id);
            console.log("Skriptoエンジンが開始されました");
        }
        else{
            // モーダルが閉じられたときの動作
            if(sessionId!==""){
                SkriptoSession.kill(sessionId);
                setSessionId("");
                setPageIndex(0);
                console.log("Skriptoエンジンが終了しました");
            }
        }
    }, [open]);

    return (
        <>
            {
                createPortal(
                    <>
                        <AnimatePresence>
                            {open && (
                                <motion.div
                                    className="flex flex-col absolute inset-10 p-4 bg-neutral-900 rounded-lg backdrop-blur"
                                    key={"modal"}
                                    initial={{opacity: 0, scale: 0.9}}
                                    animate={{opacity: 1, scale: 1}}
                                    exit={{opacity: 0, scale: 0.9}}
                                >
                                    <div className="text-white select-none">
                                        <div className="text-sm">Skriptoシナリオ生成ウィザード</div>
                                        <div className="text-2xl">{pages[pageIndex].title}</div>
                                    </div>

                                    {/* コンテンツ */}
                                    <div className="flex grow overflow-hidden">
                                        {pages[pageIndex].jsx}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </>,
                    document.body
                )
            }
        </>
    )
}