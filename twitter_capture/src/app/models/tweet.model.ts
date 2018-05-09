export class Tweet {
    public text: string;
    public created_at: string;
    public seen: boolean;
    constructor(text: string, created_at: string, keywords: string[]) {
        this.text = text;
        this.created_at = created_at;
        this.seen = false;
    }
}