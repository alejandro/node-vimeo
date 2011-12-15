# Vimeo API Interaction with node.js

Simple Vimeo API interaction for node.js

`npm install n-vimeo`
## Example

    var vimeo = require('n-vimeo').vimeo;

    // Get the albums from user = brad
    vimeo('user', 'brad','albums', function(err,data){
      // Work with data o handle the error
    });

## Motivation

There is a [vimeo-client](https://github.com/tih-ra/vimeo-client) already but that module expose a middleware for upload and oauth process. 
But I needed is a client for work with the data API of vimeo, so I created this module.

## API

As I explain above, all the methods works in the same way, you expose the `vimeo` function at require. So
then you can use it:

    vimeo(METHOD, ID, REQUEST, RESPONSE);

Where `METHOD` can be:

    channel, user, activity, video, album, group

`ID` can be: The `user, channel, group` Identificator.

And `REQUEST` are the options for every method, `video` no use a `request` param.

Also, you can use specific methods like: `user`, `video`, or `activity` as follow:

    var user = require('n-vimeo').user;

    user('brad', 'album', function(err,data){
      // data
    });

O `video`:
  
    var video = require('n-vimeo').video;

    video('32646874', function(err,data){
      // Here the API expose three new objects: raw, thumb, username
      console.log(data.raw); // The whole response of the call
      data.thumb; // expose the 3 different sizes of thumbnail, thubm.s, thumb.m, thumb.l;
      data.username; // video owner
    });

    

## Contributors

* [Alejandro Morales](http://alejandromorales.co.cc)

## Licence:  MIT
