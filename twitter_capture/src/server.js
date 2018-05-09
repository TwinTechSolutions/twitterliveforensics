var express = require('express');
var app = express();
app.use(express.static(__dirname + '/'));
var port = process.env.PORT || 8088;

var admin = require('firebase-admin');
var Twitter = require('twitter');
var twitter = new Twitter({
    consumer_key: 'ZHb7dnyodwFGWqqsGiYrAZR09',
    consumer_secret: 'pj6ZKPTtdeKSgiGyHWO6DubbiHThVApOnp8lmXD2tMkuVFHBx9',
    access_token_key: '851063641-V64QDK4QyK8wudOiTzIGQp9ipCh2xPjelbk0uvFW',
    access_token_secret: 'wI5GFXfNah3CvsmKRjwCiSJkNr3b3n3ZhX9TEAwMpHBZE'
});
var serviceAccount = require('./twittercapture-4768f-firebase-adminsdk-sqavo-6cbb85e108.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://twittercapture-4768f.firebaseio.com'
});


var db = admin.database();
var usersRef = db.ref("users");
var keywordsRef = db.ref("keywords");
var keywords = ['dummy'];
var users = {};
var stream = null;
var timer = 1000;
var calm = 1;

function restart() {
    calm = 1;
    clearTimeout(timer);
    if (stream !== null && stream.active) {
        stream.destroy();
        init();
    } else {
        init();
    }
}

function init() {
    clearTimeout(timer);
    if (stream == null || !stream.active) {
        console.log(keywords);
        twitter.stream('statuses/filter', {
            track: keywords.join(',')
        }, function (stream) {
            clearTimeout(timer);
            stream = stream;
            stream.active = true;
            stream.on('data', function (event) {
                work(event);
            });
            stream.on('end', function () {
                stream.active = false;
                clearTimeout(timer);
                timer = setTimeout(function () {
                    clearTimeout(timer);
                    if (stream.active) {
                        stream.destroy();
                    } else {
                        init();
                    }
                }, 1000 * calm * calm);
            });
            stream.on('error', function (err) {
                if (err.message == 'Status Code: 420') {
                    calm++;
                }
            });
        });
    }
};

keywordsRef.on("value", function (snapshot) {
    keywords = [];
    var _keywords = snapshot.val();
    var keys = Object.keys(_keywords);
    keys.forEach(key => {
        keywords.push(_keywords[key]['keyword']);
    })
    usersRef.on("value", function (snapshot) {
        users = snapshot.val();
        restart();
    });
});

var work = function (event) {
    var tweet = {
        text: event.text,
        created_at: event.created_at,
        reply_count: event.reply_count,
        retweet_count: event.retweet_count,
        favorite_count: event.favorite_count,
        seen: false
    };

    var userKeys = Object.keys(users);
    var userKey = userKeys.find(key => {
        return users[key]['username'] == event.user.screen_name;
    });
    if (userKey) {
        console.log('found');
        var userTweetsRef = db.ref('users/' + userKey + '/tweets');
        userTweetsRef.push(tweet).then(() => {
            var user = users[userKey];
            user.unseenCount = user.unseenCount + 1;
            usersRef.child(userKey).update(user, function () {
                return;
            });
        });
    }
    return;
};

app.listen(port, function () {
    console.log('listening on port: ' + port);
});
