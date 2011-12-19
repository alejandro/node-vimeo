var vimeo = require('../index').vimeo;

vimeo('user','brad','videos',function(err,data){
  console.log(err || data);
});
