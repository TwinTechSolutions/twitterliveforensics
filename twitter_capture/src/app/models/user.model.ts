import { Tweet } from "./tweet.model";

export class User {
    //n.b username is twitter screen_name
    public username: string;
    public fullName: string;
    public tweets: any;
    public unseenCount: number;
    constructor(username: string, fullName: string) {
        this.username = username;
        this.fullName = fullName;
        this.tweets = "test";
        this.unseenCount = 0;
    }
}