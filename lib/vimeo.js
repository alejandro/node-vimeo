/*
 * Vimeo API interaction
 * @author: Alejandro Morales <vamg008[at]gmail[dot]com>
 * @license: MIT 
 */

var request = require('request'),
    vimeo = exports;

/*
 * API end point
 * 
*/

var ep = {
  rest : "http://vimeo.com/api/rest/v2/",
  video : "http://vimeo.com/api/v2/video/",
  activity : "http://vimeo.com/api/v2/activity/", // Require username/request.output
  album : "http://vimeo.com/api/v2/album/",
  root: "http://vimeo.com/api/v2/"
}


/* 
 * Video 
 * @params: id
 * @callback: err, data
*/

var video = vimeo.video = function req(id,cb){
  var url = ep.video + id + '.json';
  request(ep.video + id + '.json', function(err,res){
    if (res.statusCode === 200) {
      this.raw = this.get =  JSON.parse(res.body)[0];
      this.thumb =  {s: this.raw.thumbnail_small,m:this.raw.thumbnail_medium,l:this.raw.thumbnail_large };
      this.username = { name: this.raw.user_name, portrait:this.raw.user_portrait_medium} ;
      cb(null,this);
    } else {
      cb({"error":"request denied","data":err},null);
    }

  });
}
/*
 * Request type info for user
 *
*/
var userOption = {
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
var user = vimeo.user = function(usr,req, cb){
  if (userOption.hasOwnProperty(req)) {
    request(ep.root + usr + '/' + req + '.json', function(err,res){
      if (res.statusCode === 200){
          var body = JSON.parse(res.body) || [];            
          cb(null,{items: body.length,data:body});
      } else {
        cb({"error":"user no exists", "data": usr },null);
      }
    });
  } else {
    cb({"error":"I need a valid request type","data": JSON.stringify(userOption)} ,null);
  }
}

/*
 * Activity API interaction
 * @params: user, req
 * @callback: err, data
 *
 */
 var activity = vimeo.activity = function(usr,req,cb){
 if (activyOptions.hasOwnProperty(req)){
    request(ep.activity + usr + '/' + req + '.json', function(err,res){
      if (res.statusCode === 200) {
          var body = JSON.parse(res.body);
          cb(null, {items:body.length,data:body});
      } else {
        cb({"error": "user no exist", "data":usr},null);
      }
    });
 } else {
    cb({ "error": "I need a valid request type", "data": activityOption} ,null);  
 }
}
var activityOptions = {
  "user_did":"Activity by the user",
  "happened_to_user":"Activity on the user",
  "contacts_did":"Activity by the user's contacts",
  "everyone_did":"Activity by everyone"
}
var groupOption =  {
  "videos":"Videos added to that group",
  "users":"Users who have joined the group",
  "info":"Group info for the specified group"
}
var channelOption = {
  "videos":"Videos in the channel",
  "info":"Channel info for the specified channel"
}
var albumOption = {
  "videos":"Videos in the album",
  "info":"Album info for the specified album"
}
var all = vimeo.vimeo = function (type, id,req, cb){
  var url,error = null;
  switch(type) {
    case 'group':
      if (groupOption.hasOwnProperty(req)) {   
        url = ep.root  + 'group/' + id + '/' + req ;
      } else error.data = groupOption;
      break;
    case 'activity':
      if (activityOptions.hasOwnProperty(req)){
        url = ep.activity +id + '/'+ req 
      } else { error = {};error.data = activityOptions;}
      break;   
    case 'user':
      if (userOption.hasOwnProperty(req)){
        url = ep.root + id + '/' + req;
      } else {error={};error.data = userOption;}
      break; 
    case 'video':
      url = ep.video + id
      var video = true;
      break;
    case 'channel':
      if (channelOption.hasOwnProperty(req)) {
        url = ep.root + 'channel/' + id + '/' + req;
      } else { error= {}; error.data = channelOption}
      break;
    case 'album':
      if (albumOption.hasOwnProperty(req)){
        url = ep.root + 'album/' + id + '/' +req;
      } else { error={};error.data = albumOption}
      break;
    default:
    error={}; error.data= 'METHOD not allowed';
      // code
  }
  if (!error && video){
    request( url + '.json', function(err,res){
      if (res.statusCode === 200) {
        this.raw = this.get =  JSON.parse(res.body)[0];
        this.thumb =  {s: this.raw.thumbnail_small,m:this.raw.thumbnail_medium,l:this.raw.thumbnail_large };
        this.username = { name: this.raw.user_name, portrait:this.raw.user_portrait_medium} ;
        cb(null,this);
      } else {
        cb({"error":"request denied","data":err},null);
      }
    });
  } else if (!error){
    request( url + '.json', function(err,res){
      if (res.statusCode === 200) {
          var body = JSON.parse(res.body);
          cb(null, {items:body.length,data:body});
      } else {
        cb({"error": "user no exist", "data":id},null);
      }
    });
  } else {
    cb({"error":"request data invalid","data":error.data},null);
  }
}


var info = vimeo.info = {
  "methods":["channel","user","activity","video","album"],
  "params":["ID", "request", "TODO format"]
}
