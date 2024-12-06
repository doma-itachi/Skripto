import NovelList from "./NovelList";

export default function Home(): React.ReactNode{
    return (
        <div className="flex flex-col overflow-hidden">
            
            <NovelList></NovelList>
        </div>
    )
}