const mongoose              = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

mongoose.Promise = Promise;

var Schema = mongoose.Schema;
var UserDetail = new Schema({
      username: String,
      password: String
    }, {
      collection: 'userInfo'
    });

UserDetail.plugin(passportLocalMongoose);

var UserDetails = mongoose.model('userInfo', UserDetail);
 
module.exports = mongoose.model('userInfo', UserDetail)