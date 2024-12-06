export type Template = { [ tag: string ]: any };
export function simplate(text: string, templates: Template){
    const regex = /\${.+?}/g;
    const tags=text.match(regex);
    const split=text.split(regex);
    let res="";
    for(let i=0;i<(tags?tags.length:0);i++){
        if(tags){
            const template = templates[tags[i].slice(2,-1)];
            res+=(split.shift()+(template?template:""));
        }
    }
    res+=split.shift();
    return res;
}