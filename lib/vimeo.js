/*
 * Vimeo API interaction
 */
var request = require('request'),
    vimeo = exports;

var ep = {
  rest : "http://vimeo.com/api/rest/v2/",
  video : "http://vimeo.com/api/v2/video/",
  activity : "http://vimeo.com/api/v2/activity/", // Require username/request.output
  album : "http://vimeo.com/api/v2/album/",
  root: "http://vimeo.com/api/v2/"
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
var rootOption = {
  "info":"user info for the specified user",
  "videos":"Videos created by user",
  "likes":"Videos the user likes",
  "appears_in":"Videos that the user appears in",
  "all_videos":"Videos that the user appears in and created",
  "subscriptions":"Videos the user is subscribed to",
  "albums":"Albums the user has created",
  "channels":"Channels the user has created and subscribed to",
  "groups":"Groups the user has created and joined"
}

var video = vimeo.video = function req(id,cb){
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
var album = vimeo.album = function(id,cb){
  request(ep.album + id + '.json', function(err,res){
    cb(err,res)
  });
}
var user = vimeo.user = function(user,req, cb){
  if (rootOption.hasOwnProperty(req)) {
    request(ep.root + user + '/' + req + '.json', function(err,res){
      if (res.statusCode === 200){
        cb(null,JSON.parse(res.body)[0]);
      } else {
        cb(err,null);
      }
    });
  } else {
    cb('I need a valid request type: \n'+ rootOption ,null);
  }
}


