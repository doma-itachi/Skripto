import { randomUUID } from "crypto";
import { Skripto } from "./skripto";

type UUID = string;

export class SkriptoSession{
    static api_key?: string;
    static prompts?: string;
    static sessions: { [key: UUID]: Skripto } = {};

    static start(): UUID{
        if(!this.api_key) throw new Error("Err: SkriptoSession-> api_keyプロパティが初期化されていません。api_keyプロパティにAPIキーをセットする必要があります");
        if(!this.prompts) throw new Error("Err: SkriptoSession-> promptsプロパティが初期化されていません。promptsプロパティにtoml文字列をセットする必要があります");
        const uuid = crypto.randomUUID();
        this.sessions[uuid] = new Skripto(this.api_key, this.prompts);
        return uuid;
    }

    static get(id: UUID): Skripto{
        if(this.sessions[id]){
            return this.sessions[id];
        }
        else{
            throw new Error("Err: SkriptoSession-> 存在しないIDを参照しました");
        }
    }

    static kill(id: UUID){
        if(this.sessions[id]){
            delete this.sessions[id];
        }
        else{
            throw new Error("Err: SkriptoSession-> 存在しないセッションがkillされました。idが存在しません");
        }
    }
}