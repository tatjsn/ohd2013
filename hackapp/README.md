Deploy
======
$ npm install -d

Run
===
$ PORT=80 node app.js


thumbnail API
==============

Request
--------
* HTTP GET

``
http://<url>:<port>/media/<movie_file>?type=thumbnail&msec=<msec>&width=<px>&height=<px>
```

<movie_file> must be deployed at media. (ex. media/cm.mp4)
             The base directory is the directory that contains app.js
<msec>       The start time. If omitted, 0 is used.
<width>      The unit is px. If omitted, 500 is used.
<height>     The unis is px. If omitted, 300 is used.

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
```

<movie_file> must be deployed at media. (ex. media/cm.mp4)
             The base directory is the directory that contains app.js
<width>      The unit is px. If omitted, 500 is used.
<height>     The unis is px. If omitted, 300 is used.


Response
--------
Content-Type: image/png
