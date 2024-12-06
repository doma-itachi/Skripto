export default function InputItem({
    title,
    description,
    value,
    type = "text",
    placeholder,
    onChange
}: {
    title: string;
    description: string;
    value?: string;
    type?: React.HTMLInputTypeAttribute;
    placeholder?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>)=>void;
}): React.ReactNode{
    return (
        <div className="flex flex-col w-full">
            <div className="flex items-end gap-4">
                <div className="text-lg text-white">{title}</div>
                <div className="text-sm text-white/40">{description}</div>
            </div>
            <input type={type} value={value} onChange={onChange} placeholder={placeholder} className="w-full p-1 outline-none rounded bg-white/20 hover:bg-white/30 focus:bg-white/30 transition text-white"></input>
        </div>
    )
}