
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , fs = require('fs')
  , mime = require('mime')
  , exec = require('child_process').exec
  , url = require('url');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.static(path.join(__dirname, '../htdocs')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);


var MEDIA_DIR = '/media';
var DEFAULT_MSEC = 0;
var DEFAULT_WIDTH = 640;
var DEFAULT_HEIGHT = 360;
var IMG_EXT = 'jpg';
var AUDIO_WAVE_IMG_EXT = 'png';
var FFMPEG_VCODEC = 'mjpeg';

app.use('/media', function (req, res, next) {
  var media_file = req.url;

  if (media_file  == '/') {
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    res.end('405 /media not allowd');
    return;
  }

  var type  = req.query.type;
  if (!type) {
    // return media file itself.
    var path_movie = path.join(__dirname, MEDIA_DIR + media_file);
    console.log('reading...' + path_movie);
    if (!path.existsSync(path_movie)) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not found');
    } else {
      returnFile(res, path_movie);
    }
  } else if (type == "thumbnail") {
    media_file = url.parse(media_file).pathname;
    // make thumbnail if not exist
    var msec  = req.query.msec;
    if (!msec) {
      msec = DEFAULT_MSEC;
    }
    var width  = req.query.width;
    if (!width) {
      width = DEFAULT_WIDTH;
    }
    var height  = req.query.height;
    if (!height) {
      height = DEFAULT_HEIGHT;
    }
    
    var suffix = '.msec' + msec + '_width' + width + '_height' + height + '.' + IMG_EXT;
    var path_thumbnail = path.join(__dirname, MEDIA_DIR + media_file + suffix);
    if (!path.existsSync(path_thumbnail)) {
      var sec = parseInt(msec / 1000);
      var msec2 = msec % 1000;
      var cmd = '/usr/bin/ffmpeg -i ' + path.join(__dirname, MEDIA_DIR + media_file) + ' -vframes 1 -an -ss ' + sec + '.' + msec2 + ' -s ' + width + 'x' + height + '  -f image2 -vcodec ' + FFMPEG_VCODEC + ' ' + path_thumbnail;
      console.log('CMD ' + cmd);
      var child = exec(cmd, function(err, stdout, stderr) {
        if (err) {
          console.log(err);
          // err.code will be the exit code of the child process
          console.log(err.code);
          // err.signal will be set to the signal that terminated the process
          console.log(err.signal);

          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('500 fail thumbnail');
        }
        if (!path.existsSync(path_thumbnail)) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('500 fail thumbnail 2');
        } else {
          returnFile(res, path_thumbnail);
        }
      })
    } else {
      returnFile(res, path_thumbnail);
    }
  } else if (type == "audioWave") {
    media_file = url.parse(media_file).pathname;
    // make thumbnail if not exist

    var width  = req.query.width;
    if (!width) {
      width = DEFAULT_WIDTH;
    }
    var height  = req.query.height;
    if (!height) {
      height = DEFAULT_HEIGHT;
    }

    var suffix = '.audioWave.' + width + '.' + height + '.' + AUDIO_WAVE_IMG_EXT;
    var path_wave_img = path.join(__dirname, MEDIA_DIR + media_file + suffix);
    if (path.existsSync(path_wave_img)) {
      returnFile(res, path_wave_img);
      return;
    }

    var wave_file = media_file + '.wav';
    var path_wave = path.join(__dirname, MEDIA_DIR + wave_file);

    if (path.existsSync(path_wave)) {
      returnConvertWaveToImg(req, res, path_wave, path_wave_img);
    } else {
      var path_media = path.join(__dirname, MEDIA_DIR + media_file);
      returnConvertMovieToImg(req, res, path_media, path_wave, path_wave_img);
    }
  }
});

function returnFile(res, path) {
  var buf = fs.readFileSync(path);
  var mime_type = mime.lookup(path);
  res.writeHead(200, { 'Content-Type': mime_type });
  res.write(buf);
  res.end();
}

function returnConvertWaveToImg(req, res, path_wave, path_wave_img) {
  var width  = req.query.width;
  if (!width) {
    width = DEFAULT_WIDTH;
  }
  var height  = req.query.height;
  if (!height) {
    height = DEFAULT_HEIGHT;
  }

  var cmd_wave_to_img = 'python ./generate_audio_wave.py' + ' ' + path_wave + ' ' + width + ' ' + height + ' ' + path_wave_img;
  console.log('CMD MAKE WAVE IMG: ' + cmd_wave_to_img);
  var child = exec(cmd_wave_to_img, function(err, stdout, stderr) {
    if (err) {
      console.log(err);
      // err.code will be the exit code of the child process
      console.log(err.code);
      // err.signal will be set to the signal that terminated the process
      console.log(err.signal);

      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('500 fail Wave to img');
    }
    if (!path.existsSync(path_wave_img)) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('500 fail Wave to img 2');
    } else {
      returnFile(res, path_wave_img);
    }
  })
}

function returnConvertMovieToImg(req, res, movie_file, path_wave, path_wave_img) {
  var cmd_movie_to_wave = '/usr/bin/ffmpeg -i ' + movie_file + ' -ac 1 ' + path_wave;
  console.log('CMD MAKE WAV: ' + cmd_movie_to_wave);

  var child = exec(cmd_movie_to_wave, function(err, stdout, stderr) {
    if (err) {
      console.log(err);
      // err.code will be the exit code of the child process
      console.log(err.code);
      // err.signal will be set to the signal that terminated the process
      console.log(err.signal);

      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('500 fail movie to wave');
    } else {
      returnConvertWaveToImg(req, res, path_wave, path_wave_img);
    }
  })  
}
          
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
