export default function CategoryContainer({
    title,
    children
}: {
    title: string
    children: React.ReactNode
}): React.ReactNode{
    return (
        <div className="flex flex-col mb-5">
            <div className="text-neutral-400">{title}</div>
            <div className="flex flex-col gap-2">
                {children}
            </div>
        </div>
    )
}