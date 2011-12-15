var user = require('../index').user;

user('brad','albums',function(err,req){
  console.log(err || req);
});
