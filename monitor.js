var MongoClient = require('mongodb').MongoClient;
var http = require('http');

function save_status(res, ctx, cb) {
    var doc       = {
        status: res.statusCode,
        time: new Date().getTime()
    };

    try{
        MongoClient.connect(ctx.secrets.MONGO_URL, function (err, db) {
            if(err) return cb(err);
            db
            .collection('monitor')
            .insert(doc);   
            console.log('Successfully saved! Status Code: ' + res.statusCode);
            cb(null);
        });
    } catch (err) {
        console.log('Error while saving ' + err);
        cb(err);
    }
}

module.exports = function (ctx, done) {
    http.get('http://www.federicogiust.com', function (res) {
        if(res.statusCode === 200){
            save_status(res, ctx, function (err) {
                if(err) return done(err);
                done(null, 'Website is up');
            });
        }
    }).on('error', function(e) {
        save_status(e, ctx, function (err) {
            if(err) return done(err);
            done(null);
        });
    });
};