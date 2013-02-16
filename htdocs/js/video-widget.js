var ohd = ohd || {};
ohd.InputWidget = (function() {
    return Backbone.View.extend({
        done: function() {
            //TODO 華麗なアニメーション
        },
        cancel: function() {
            this.$el.remove();
        },
        events: {
            'click .ok': 'done',
            'click .cancel': 'cancel',
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
            var input = new ohd.InputWidget({value:'面白いこと書いて！'});
            this.video.pause();
            input.render().$el.appendTo(this.$('#movie'));
            //TODO ほかのボタンを押せないようにする
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
            'click .next': 'jumpNext',
            'click .pon': 'pon'
        },

        initialize: function() {
            console.log('videoWidget: initialize', this.options);
            // for non-deligates events
            _.bindAll(this,
                      'notifyCanPlay',
                      'notifyPlay',
                      'notifyTime');
            this.video = this.$('video')[0];
            this.$time = this.$('.time');
            // non-deligates events
            $(this.video).on({
                canplay: this.notifyCanPlay,
                play: this.notifyPlay,
                pause: this.notifyPause,
                timeupdate: this.notifyTime
            });
        }
    });
})();
