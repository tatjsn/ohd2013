var ohd = ohd || {};
ohd.InputWidget = (function() {
    return Backbone.View.extend({
        keyup: function(e) {
            if (e.keyCode == 13) {
                //TODO 時間、文言を記録
                this.$el.remove();
            }
        },
        events: {
            'keyup input': 'keyup',
        },
        initialize: function() {
            this.tmpl = _.template($('#iw-template').html());
        },
        render: function() {
            var data = {
                value: (this.options.value)? this.options.value: ''
            };
            this.$el.html(this.tmpl(data));
            return this;
        }
    });
})();

ohd.VideoWidget = (function() {
    function formatTime(sec) {
        var m = Math.floor(sec / 60),
        s = Math.floor(sec % 60);
        return '' +
            ((m < 10)? '0'+m: m) +
            ':' +
            ((s < 10)? '0'+s: s);
    }

    return Backbone.View.extend({
        playPause: function () {
            console.log('videoWidget: playPause');
            if (this.video.paused) {
                this.video.play();
            } else {
                this.video.pause();
            }
        },

        jumpPrev: function () {
            console.log('videoWidget: jumpPrev');
        },

        jumpNext: function () {
            console.log('videoWidget: jumpNext');
        },

        pon: function() {
            var input = new ohd.InputWidget({
                className:'ponInput',
                value:'面白いこと書いて！'});
            this.video.pause();
            input.render().$el.appendTo(this.$('#movie'));
            //TODO ほかのボタンを押せないようにする
        },

        notifyCanPlay: function() {
            console.log('videoWidget: canplay');
            var dur = this.video.duration;
            this.$('.time li:nth-child(2)').html(formatTime(dur));
            this.$('#slider input').attr('max', Math.floor(dur * 1000));
            this.$('.loading').remove();
            this.$('button').prop('disabled', false);
        },

        notifyPlay: function() {
            console.log('videoWidget: play #change display here!');
        },

        notifyPause: function() {
            console.log('videoWidget: pause #change display here!');
        },

        notifyTime: function() {
            this.$('#slider input').val(Math.floor(this.video.currentTime * 1000));
        },

        notifySeek: function() {
            this.video.currentTime = this.$seek.val() / 1000; //double
        },

        events: {
            'click .play': 'playPause',
            'click .prev': 'jumpPrev',
            'click .next': 'jumpNext',
            'click .pon': 'pon',
        },

        initialize: function() {
            console.log('videoWidget: initialize', this.options);
            // for non-deligates events
            _.bindAll(this,
                      'notifyCanPlay',
                      'notifyPlay',
                      'notifyTime',
                      'notifySeek');
            this.video = this.$('video')[0];
            this.$time = this.$('.time');
            this.$seek = this.$('#slider input');
            // non-deligates events
            $(this.video).on({
                canplay: this.notifyCanPlay,
                play: this.notifyPlay,
                pause: this.notifyPause,
                timeupdate: this.notifyTime
            });
            this.$seek.on('change', this.notifySeek);
        }
    });
})();
