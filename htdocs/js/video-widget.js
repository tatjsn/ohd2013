var ohd = ohd || {};

// Ugh! separate file
ohd.formatTime = function(sec) {
        var m = Math.floor(sec / 60),
        s = Math.floor(sec % 60);
        return '' +
            ((m < 10)? '0'+m: m) +
            ':' +
            ((s < 10)? '0'+s: s);
};

ohd.InputWidget = (function() {
    var tmpl = _.template($('#iw-template').html());
    return Backbone.View.extend({
        keyup: function(e) {
            if (e.keyCode == 13) {
                var text = this.$('input').val();
                this.$el.remove();
                ohd.theVideo.notifyInputDone();
                if (text !== '') {
                    ohd.thePon.addItem(ohd.theVideo.video.currentTime, text);
                    ohd.theVideo.notifyTime(); //Ugh! this is rude
                }
            }
        },
        clearInitText: function() {
            if (this.hasInitText) {
                this.$('input').val('');
                this.hasInitText = false;
            }
        },
        focusInput: function() {
            this.$('input').focus();
        },
        notifyInputBlur: function() {
            if (this.hasInitText) {
                this.$el.remove();
                ohd.theVideo.notifyInputDone();
            }
        },
        events: {
            'keyup input': 'keyup',
            'touchstart input': 'clearInitText'
        },
        initialize: function() {
            this.text = (this.options.text)? this.options.text: '';
            if (this.text.length > 0) {
                this.hasInitText = true;
            }
            _.bindAll(this, 'notifyInputBlur');
        },
        render: function() {
            var data = {
                text: this.text
            };
            this.$el.html(tmpl(data));
            this.$('input').on('blur', this.notifyInputBlur);
            return this;
        }
    });
})();

ohd.VideoWidget = (function() {

    return Backbone.View.extend({
        play: function () {
            console.log('videoWidget: play');
            this.video.play();
        },

        pause: function () {
            console.log('videoWidget: pause');
            this.video.pause();
        },

        jumpPrev: function () {
            console.log('videoWidget: jumpPrev');
        },

        jumpNext: function () {
            console.log('videoWidget: jumpNext');
        },

        pon: function() {
            if (this.lastPon) {
                // seek to head of pon
                // TODO: update from sidebar
                this.video.currentTime = this.lastPon.time;
            } else if (!this.input) {
                var input = new ohd.InputWidget({
                    className:'ponInput',
                    text:this.options.initText});
                this.video.pause();
                input.render().$el.appendTo(this.$('#movie'));
                input.focusInput();
                this.input = input;
            }
        },

        seek: function(time) {
            this.video.currentTime = time;
        },

        notifyCanPlay: function() {
            console.log('videoWidget: canplay');
            var dur = this.video.duration;
            this.$('.time li:nth-child(2)').html(ohd.formatTime(dur));
            this.$('#slider input').attr('max', Math.floor(dur * 1000));
            this.$('.loading').remove();
            this.$('button').prop('disabled', false);
        },

        notifyPlay: function() {
            console.log('videoWidget: notifyPause');
            this.$('.play').removeClass('play').addClass('pause');
        },

        notifyPause: function() {
            console.log('videoWidget: pause #change display here!');
            this.$('.pause').removeClass('pause').addClass('play');
        },

        notifyTime: function() {
            var time = this.video.currentTime,
            pon = ohd.thePon.getItem(time);
            this.$('#slider input').val(Math.floor(time * 1000));
            if (pon == this.lastPon) {
                return;
            }
            if (pon) {
                console.log('update pon', pon.text);
                this.$('#movie p').remove();
                $('<p>'+pon.text+'</p>').appendTo('#movie');
                ohd.thePon.activateItem(pon, true /* no seek */);
            } else {
                console.log('end pon');
                this.$('#movie p').remove();
                ohd.thePon.activateItem(null); //remove focus
            }
            this.lastPon = pon;
        },

        notifyInputDone: function() {
            delete this.input;
        },

        notifySeek: function() {
            this.video.currentTime = this.$seek.val() / 1000; //double
        },

        events: {
            'click .play': 'play',
            'click .pause': 'pause',
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
                      'notifyPause',
                      'notifyTime',
                      'notifySeek');
            this.video = this.$('video')[0];
            this.$time = this.$('.time');
            this.$seek = this.$('#slider input');
            this.lastPon = null;
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
