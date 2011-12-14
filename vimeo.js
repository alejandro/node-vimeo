/*
 * Vimeo API interaction
 */
var request = require('request'),
    vimeo = exports;

var ep = {
  rest : "http://vimeo.com/api/rest/v2/",
  video : "http://vimeo.com/api/v2/video/",
  activity : "http://vimeo.com/api/v2/activity/", // Require username/request.output
  album : "http://vimeo.com/api/v2/album/"

}

/* 
 * @request for activity type
 *
 * user_did
 * Activity by the user
 * happened_to_user
 * Activity on the user
 * contacts_did
 * Activity by the user's contacts
 * everyone_did
 * Activity by everyone
 */

/* 
 * /album_id/request.outpu
 *
 * videos
 * info
 */
 var r;
var req = vimeo.request = function req(id,cb){
  var url = ep.video + id + '.json';
  request(ep.video + id + '.json', function(err,res){
    if (res.statusCode === 200) {
      this.raw = this.get =  JSON.parse(res.body)[0];
      this.thumb =  {s: this.raw.thumbnail_small,m:this.raw.thumbnail_medium,l:this.raw.thumbnail_large };
      this.username = { name: this.raw.user_name, portrait:this.raw.user_portrait_medium} ;
      cb(null,this);
    } else {
      cb(err,null);
    }

  });
}
/*
 * 33544767
 */


req('33544767', function(err,data){
  console.log(data.thumb)
});
