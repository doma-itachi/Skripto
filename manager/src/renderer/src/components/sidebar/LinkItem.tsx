export default function LinkItem({
    onClick,
    label
}: {
    onClick: ()=>void
    label: string
}): React.ReactNode{
    return (
        <div onClick={onClick} className="text-white text-center p-4 cursor-pointer select-none">
            {label}
        </div>
    )
}