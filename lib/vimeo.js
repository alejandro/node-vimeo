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

var video = vimeo.video = function opt(id,cb){
  var now = new Date().getTime();
  var url = ep.video + id + '.json';
  request(ep.video + id + '.json', function(err,dres){
    if (dres.statusCode === 200 && dres.body.length > 0) {
      try {
        console.log(dres.body)
        this.raw = this.get =  JSON.parse(dres.body)[0];
        this.thumb =  {s: this.raw.thumbnail_small,m:this.raw.thumbnail_medium,l:this.raw.thumbnail_large };
        this.username = { name: this.raw.user_name, portrait:this.raw.user_portrait_medium} ;
        var data = {
          time: new Date().getTime() - now ,
          statusCode: dres.statusCode,
          raw: this.raw,
          thumb: this.thumb,
          username:this.username
        }
        cb(null,data);
       } catch(e) {
         cb(new Error('Not Found'),null)
       }
    } else {
      cb(new Error(err),null);
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
var user = vimeo.user = function(usr,opt, cb){
  var now = new Date().getTime();
  if (userOption.hasOwnProperty(opt)) {
    request(ep.root + usr + '/' + opt + '.json', function(err,dres){
      if (dres.statusCode === 200){
          var body = JSON.parse(dres.body) || [];            
          var data = {
            time: new Date().getTime() - now ,
            statusCode: dres.statusCode,
            body: body,
            items: body.length
          }
          cb(null,data);
      } else {
        cb( new Error('User no exists'),null);
      }
    });
  } else {     
    cb(new Error( 'The request type do not exists see nvimeo.info') ,null);
  }
}

/*
 * Activity API interaction
 * @params: user, opt
 * @callback: err, data
 *
 */
 var activity = vimeo.activity = function(usr,opt,cb){
  var now = new Date().getTime();
 if (activyOptions.hasOwnProperty(opt)){
    request(ep.activity + usr + '/' + opt + '.json', function(err,dres){
      if (dres.statusCode === 200) {
         var body = JSON.parse(dres.body);
          var data = {
            time: new Date().getTime() - now ,
            statusCode: dres.statusCode,
            body: body,
            items: body.length
          }
          cb(null, data);
      } else {
        cb(new Error(usr +' do not exists'),null);
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
var all = vimeo.vimeo = function (type, id,opt, cb){
  if (arguments.length !== 4 ){ 
    throw new Error("One of the params is missing see nvimeo.info" );
  } else {
    var now =Date.now();
    var url,error = null;
    switch(type) {
      case 'group':
        if (groupOption.hasOwnProperty(opt)) {   
          url = ep.root  + 'group/' + id + '/' + opt ;
        } else error.data = groupOption;
        break;
      case 'activity':
        if (activityOptions.hasOwnProperty(opt)){
          url = ep.activity +id + '/'+ opt 
        } else { error = {};error.data = activityOptions;}
        break;   
      case 'user':
        if (userOption.hasOwnProperty(opt)){
          url = ep.root + id + '/' + opt;
        } else {error={};error.data = userOption;}
        break; 
      case 'video':
        url = ep.video + id
        var video = true;
        break;
      case 'channel':
        if (channelOption.hasOwnProperty(opt)) {
          url = ep.root + 'channel/' + id + '/' + opt;
        } else { error= {}; error.data = channelOption}
        break;
      case 'album':
        if (albumOption.hasOwnProperty(opt)){
          url = ep.root + 'album/' + id + '/' +opt;
        } else { error={};error.data = albumOption}
        break;
      default:
      error={}; error.data= 'METHOD not allowed';
        // code
    }
    if (!error && video){
      request( url + '.json', function(err,dres){
        if (dres.statusCode === 200) {
          try {
            this.raw = JSON.parse(dres.body)[0];
            this.thumb =  {s: this.raw.thumbnail_small,m:this.raw.thumbnail_medium,l:this.raw.thumbnail_large };
            this.username = { name: this.raw.user_name, portrait:this.raw.user_portrait_medium} ;
            data = {
              time: Date.now() - now,
              raw: this.raw,
              thumb: this.thumb,
              username: this.username
            }
            cb(null,data);
          } catch (e){
            cb (new Error(id + ' => Not Found'),null);
          }
        } else {
          cb( new Error(err),null);
        }
      });
    } else if (!error){
      request( url + '.json', function(err,dres){
        if (dres.statusCode === 200) {
            var body = JSON.parse(dres.body);
            data = {
              status:'ok',
              statusCode: dres.statusCode,
              time: Date.now() - now,
              items: body.length,
              body: body
            }
            cb(null, data);
        } else {
          cb(new Error('User do not exists'),null);
        }
      });
    } else {
      cb(new Error('Invalid option see nvimeo.info'),null);
    }
  }
}


var info = vimeo.info = {
  "methods":["channel","user","activity","video","album"],
  "params":["ID", "request", "TODO format"]
}
