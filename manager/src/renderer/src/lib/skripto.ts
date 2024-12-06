import OpenAI from "openai";
import { load } from "js-toml";
import { simplate } from "./simplate";
import { Scenario } from "src/globals";

export interface Character{
    name: string;
    age: number;
    isMale: boolean;
    personality: string; //性格
    role: string; //役割
}

interface Prompts{
    plot: {
        system: string;
        makePlot: string;
        getCharacters: string;
    }
    assignSprite: {
        system: string;
        user: string;
    }
    makeScript: {
        system: string;
        user: string;
        makeTitle: string;
    }
}

export class Skripto{
    private prompts: Prompts;
    private openai: OpenAI;

    private idea?: string;
    private genres?: string[];

    private plot: string = "";
    // 立ち絵割り当て前のキャラクター情報
    public characters: Character[] = [];

    // 立ち絵割り当て後のキャラクター情報＋ID
    private characterInfo: CharacterInfo[] = [];

    debug(){
        // console.log(this.prompts);
        // console.log(this.plot);
        // console.log(this.characters);
        // Deno.writeTextFileSync("./plot.txt", this.plot);
        // Deno.writeTextFileSync("./characters.txt", JSON.stringify(this.characters));
        // Deno.writeTextFileSync("./assignedCharacters.txt", JSON.stringify(this.characterInfo));
    }
    debugLoadPlot(){
        // const idea = "キャラクターは日本人にしてね";
        // const genres: string[] = ["SF", "コメディ", "料理/グルメ"];
        // this.idea = idea;
        // this.genres = genres;
        // this.plot = Deno.readTextFileSync("./plot.txt");
        // this.characters = JSON.parse(Deno.readTextFileSync("./characters.txt"));
        // this.characterInfo = JSON.parse(Deno.readTextFileSync("./assignedCharacters.txt"));
    }

    constructor(apikey: string, promptsToml: string){
        this.prompts = load(promptsToml) as Prompts;
        this.openai = new OpenAI({
            apiKey: apikey,
            dangerouslyAllowBrowser: true
        })
    }

    // 1. プロットを生成する
    async makePlot(idea: string, genres: string[]){
        this.idea = idea;
        this.genres = genres;

        const history: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
            {role: "system", content: this.prompts.plot.system},
            {role: "user", content: simplate(
                this.prompts.plot.makePlot, {
                    idea: idea===""?"指定されていません":idea,
                    genres: JSON.stringify(genres)
            })}
        ];

        console.log(history);//デバッグ

        let completion = await this.openai.chat.completions.create({
            messages: history,
            model: "gpt-4o",
            temperature: 0.7
        });

        console.log(completion.choices[0].message);//デバッグ

        history.push(completion.choices[0].message);
        this.plot = completion.choices[0].message.content!;
        history.push({
            role: "user",
            content: this.prompts.plot.getCharacters
        });

        console.log(history[3]);//デバッグ

        completion = await this.openai.chat.completions.create({
            messages: history,
            model: "gpt-4o",
            temperature: 0.7,
            response_format: {
                type: "json_object"
            }
        });

        this.characters = JSON.parse(completion.choices[0].message.content!).characters;
        console.log(this.characters);//デバッグ
    }

    // 2. キャラクターに立ち絵を割り当てる
    async assignSprite(
        spriteInfo: SpriteInfo
    ){
        const history: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
            {role: "system", content: this.prompts.assignSprite.system},
            {role: "user", content: simplate(
                this.prompts.assignSprite.user,
                {
                    "characterInfo": JSON.stringify(this.characters),
                    "spriteInfo": JSON.stringify(spriteInfo)
                }
            )}
        ]

        console.log(history);

        const completion = await this.openai.chat.completions.create({
            messages: history,
            model: "gpt-4o",
            temperature: 0.7,
            response_format: {
                type: "json_object"
            }
        });

        const response: string[] = (JSON.parse(completion.choices[0].message.content!) as AssignResponse).assign;
        console.log(JSON.parse(completion.choices[0].message.content!));

        // 全員に割り当てられていなければエラー
        if(response.length !== this.characters.length){
            throw new Error("立ち絵割り当てエラー: LLMはすべてのキャラクターに割り当てていません");
        }

        this.characterInfo = this.characters.map((e, i)=>{
            const obj: CharacterInfo = {
                id: response[i],
                ...e
            }
            return obj;
        });
    }

    // 3. スクリプトを作成
    async makeScript(
        background: BackgroundInfo[],
        music: MusicInfo[]
    ): Promise<{script: string; meta: Scenario}>{
        //キャラクターのdefine文を作る
        let defineScript: string = "";
        for(const i of this.characterInfo){
            defineScript+=`#defineCharacter "${i.id}" "${i.name}"\n`;
        }

        const history: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
            {role: "system", content: this.prompts.makeScript.system},
            {
                role: "user",
                content: simplate(
                    this.prompts.makeScript.user,
                    {
                        idea: this.idea===""?"指定されていません":this.idea,
                        genre: JSON.stringify(this.genres),
                        plot: this.plot,
                        background: JSON.stringify(background),
                        characters: JSON.stringify(this.characterInfo),
                        music: JSON.stringify(music)
                    }
                )
            }
        ]
        
        console.log(history);

        let completion = await this.openai.chat.completions.create({
            messages: history,
            model: "gpt-4o",
            temperature: 0.7
        });

        history.push(completion.choices[0].message);
        history.push({
            role: "user",
            content: this.prompts.makeScript.makeTitle
        })
        const script = `${defineScript}\n${completion.choices[0].message.content}`;

        completion = await this.openai.chat.completions.create({
            messages: history,
            model: "gpt-4o",
            temperature: 0.7
        });
        console.log(history);
        console.log(completion);

        const title = completion.choices[0].message.content!;
        const meta: Scenario = {
            id: crypto.randomUUID(),
            title: title,
            genres: this.genres?this.genres:[],
            createdAt: new Date().getTime()
        }
        return {
            script: script,
            meta: meta
        }
    }
}

export interface BackgroundInfo{
    id: string;
    description: string;
}
export interface MusicInfo{
    id: string;
    description: string;
}
export interface SpriteInfo{
    id: string;
    description: string;
}

interface AssignResponse{
    assign: string[]
}
export type CharacterInfo = Character & { id: string }