var ohd = ohd || {};
ohd.VideoWidget = (function() {
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

        notifyCanPlay: function() {
            console.log('videoWidget: canplay');
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
            var time = this.video.currentTime,
            m = Math.floor(time / 60),
            s = Math.floor(time % 60);
            this.$time.html('' +
                            ((m < 10)? '0'+m: m) +
                            ':' +
                            ((s < 10)? '0'+s: s));
        },

        events: {
            'click .play': 'playPause',
            'click .prev': 'jumpPrev',
            'click .next': 'jumpNext'
        },

        initialize: function() {
            console.log('videoWidget: initialize', this.options);
            this.template = $(this.options.tmplSel).html();
            // for non-deligates events
            _.bindAll(this,
                      'notifyCanPlay',
                      'notifyPlay',
                      'notifyTime');

        },

        render: function() {
            console.log('videoWidget: render');
            this.$el.html(this.template);
            this.video = this.$('video')[0];
            this.$time = this.$('.time');
            // non-deligates events
            $(this.video).on({
                canplay: this.notifyCanPlay,
                play: this.notifyPlay,
                pause: this.notifyPause,
                timeupdate: this.notifyTime
            });
            return this;
        }
    });
})();
