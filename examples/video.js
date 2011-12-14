var vimeo = require('../index').video;

vimeo('33544767', function(err,data){
  // Data is Exposed with raw as the whole response, or thumb, username.
  console.log(data.raw);
  console.log(data.thumb);
  console.log(data.username.name);
});
