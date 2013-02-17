var ohd = ohd || {};

//１文字0.25秒の計算

ohd.PonItemWidget = (function() {
    var tmpl = _.template($('#pi-template').html());
    return Backbone.View.extend({
        activate: function(noSeek) {
            ohd.thePon.activateItem(null);
            this.$('a').addClass('current');
            if (noSeek !== true) {
                console.log('seek');
                ohd.theVideo.video.pause();
                ohd.theVideo.seek(this.time);
                ohd.theVideo.editPon(this);
            }
        },
        events: {
            'click': 'activate',
        },
        initialize: function() {
            this.text = this.options.text;
            this.time = this.options.time;
        },
        render: function() {
            this.duration = this.text.length * 0.25;
            var data = {
                text: this.text,
                imgSrc: 'media/chanel5.mp4?type=thumbnail&msec=' +
                    Math.floor(this.time * 1000),
                timeFrom: ohd.formatTime(this.time),
                timeTo: ohd.formatTime(this.time + this.duration),
                duration: ohd.formatTime(this.duration)
            };
            this.$el.html(tmpl(data));
            return this;
        }
    });
})();


ohd.PonWidget = (function() {
    return Backbone.View.extend({
        items: [],
        getItem: function(time) {
            for (var i=0, len=this.items.length; i < len; i++) {
                if (time >= this.items[i].time &&
                    time < this.items[i].time + this.items[i].duration) {
                    //console.log('found', time);
                    return this.items[i];
                }
            }
            //console.log('not found', time);
            return null;
        },
        addItem: function(time, text) {
            console.log('ponWidget: addItem', time, text);
            var item = new ohd.PonItemWidget({
                tagName: 'li',
                className: 'ponitem',
                time: time,
                text: text
            });
            this.$('a').removeClass('current'); // all items
            item.render().$el.appendTo(this.el);
            this.items.push(item);
        },
        activateItem: function(item, noSeek) {
            this.$('a').removeClass('current'); // all items
            if (item) {
                item.activate(noSeek);
            }
        },
        events: {
        },
        initialize: function() {
        },
        render: function() {
            return this;
        }
    });
})();
