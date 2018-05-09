import { Component } from "@angular/core";
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { User } from "./models/user.model";
import { Tweet } from "./models/tweet.model";

@Component({
    selector: 'admin',
    templateUrl: './admin.component.html'
})
export class AdminComponent {
    usersRef: AngularFireList<any>;
    users: Observable<any[]>;
    keywordsRef: AngularFireList<any>;
    keywords: Observable<any[]>;
    constructor(db: AngularFireDatabase) {
        this.usersRef = db.list('users');
        this.users = this.usersRef.snapshotChanges().map(changes => {
            return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
        });
        this.keywordsRef = db.list('keywords');
        this.keywords = this.keywordsRef.snapshotChanges().map(changes => {
            return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
        });
    }

    addUser(username: string, fullName: string) {
        let user = new User(username, fullName);
        this.usersRef.push(user);
    }
    updateUser(key: string, newUser: User) {
        this.usersRef.update(key, newUser);
    }
    deleteUser(key: string) {
        this.usersRef.remove(key);
    }

    addKeyword(keyword: string) {
        this.keywordsRef.push({
            keyword: keyword
        });
    }
    deleteKeyword(key: string) {
        this.keywordsRef.remove(key);
    }
}