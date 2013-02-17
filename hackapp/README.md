Deploy
======
$ npm install -d

Put movie file
---------------
$ ls .
app.js
...

$ cp <mp4 file> media/



Run
===
$ PORT=80 node app.js


thumbnail API
==============

Request
--------
* HTTP GET

```
http://<url>:<port>/media/<movie_file>?type=thumbnail&msec=<msec>&width=<px>&height=<px>

<movie_file> This file must be deployed in media directory. 
<msec>       The start time. If omitted, 0 is used.
<width>      The unit is px. If omitted, 640 is used.
<height>     The unis is px. If omitted, 480 is used.

```

Response
--------
Content-Type: image/png

audio wave png API
===================

Request
--------
* HTTP GET

```
http://<url>:<port>/media/<movie_file>?type=audioWave&width=<px>&height=<px>

<movie_file> This file must be deployed in media directory. 
<width>      The unit is px. If omitted, 640 is used.
<height>     The unis is px. If omitted, 480 is used.

```

Response
--------
Content-Type: image/png
