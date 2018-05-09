import { Component } from "@angular/core";
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'home',
    templateUrl: './home.component.html'
})
export class HomeComponent {
    usersRef: AngularFireList<any>;
    users: Observable<any[]>;
    tweetsRef: AngularFireList<any>;
    tweets: Observable<any[]>;
    currentUser;
    constructor(public db: AngularFireDatabase) {
        this.usersRef = this.db.list('users');
        this.users = this.usersRef.snapshotChanges().map(changes => {
            console.log(changes.map(c => ({ key: c.payload.key, ...c.payload.val() })));
            return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
        });
    }
    setCurrentUserAndLoadTweets(user) {
        this.currentUser = user;
        this.loadTweets(this.currentUser);
    }
    private loadTweets(user) {
        //get all tweets
        this.tweetsRef = this.db.list('users/' + user.key + '/tweets');
        this.tweets = this.tweetsRef.snapshotChanges().map(changes => {
            return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
        });

        //update unsceencount for curerntuser to 0
        var _user = {
            fullName: user.fullName,
            tweets: user.tweets,
            unseenCount: 0,
            username: user.username
        };
        this.usersRef.update(user.key, _user);
    }
}