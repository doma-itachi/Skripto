import { Navbar, NavbarProps } from "./navbar"
import spinner from "../../../assets/ring-spinner.svg";

export function PageContainer({
    children,
    hideCancel = false,
    hideBack = false,
    hideNext = false,
    cancelLabel = "キャンセル",
    backLabel = "戻る",
    nextLabel = "次へ",
    onCancel,
    onBack,
    onNext,
    isLoading,
    loadingText
}: {
    children: React.ReactNode
    isLoading: boolean
    loadingText: string
} & NavbarProps): React.ReactNode{
    return (
        <div className="flex flex-col w-full select-none">
            <div className="flex flex-grow gap-4">
                {isLoading?(
                    <div className="grid flex-grow place-content-center place-items-center">
                        <img className="w-12" src={spinner}/>
                        <div className="text-white mt-4">{loadingText}</div>
                    </div>
                ): children}
            </div>
            <Navbar
                hideCancel={hideCancel}
                hideBack={hideBack}
                hideNext={hideNext}
                cancelLabel={cancelLabel}
                backLabel={backLabel}
                nextLabel={nextLabel}
                onCancel={onCancel}
                onBack={onBack}
                onNext={onNext}
            />
        </div>
    )
}