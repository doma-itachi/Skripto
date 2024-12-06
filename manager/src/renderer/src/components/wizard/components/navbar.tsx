export interface NavbarProps{
    hideCancel?: boolean
    hideBack?: boolean
    hideNext?: boolean
    cancelLabel?: string
    backLabel?: string
    nextLabel?: string
    onCancel?: ()=>void
    onBack?: ()=>void
    onNext?: ()=>void
}

export function Navbar({
    hideCancel = false,
    hideBack = false,
    hideNext = false,
    cancelLabel = "キャンセル",
    backLabel = "戻る",
    nextLabel = "次へ",
    onCancel,
    onBack,
    onNext
}: NavbarProps): React.ReactNode{
    return (
        <>
            {/* footer */}
            <div className="flex gap-2 justify-end border-t-1 border-white">
                {/* 次へボタン */}
                {
                    !hideCancel &&
                    <div onClick={onCancel} className="text-white border transition hover:bg-white/20 border-indigo-400 px-3 py-1 rounded cursor-pointer">
                        {cancelLabel}
                    </div>
                }
                {
                    !hideBack &&
                    <div onClick={onBack} className="text-white border transition hover:bg-white/20 border-indigo-400 px-3 py-1 rounded cursor-pointer ml-4">
                        {backLabel}
                    </div>
                }
                {
                    !hideNext &&
                    <div onClick={onNext} className="text-white bg-indigo-400 transition hover:bg-indigo-600 px-3 py-1 rounded cursor-pointer">
                        {nextLabel}
                    </div>
                }
            </div>
        </>
    )
}