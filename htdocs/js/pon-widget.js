var ohd = ohd || {};

//１文字0.25秒の計算

ohd.PonItemWidget = (function() {
    var tmpl = _.template($('#pi-template').html());
    return Backbone.View.extend({
        seekVideo: function() {
        },
        events: {
            'click': 'seekVideo',
        },
        initialize: function() {
            this.text = this.options.text;
            this.duration = this.options.text.length * 0.25;
            this.time = this.options.time;
        },
        render: function() {
            var data = {
                text: this.text,
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
                if (time > this.items[i].time &&
                    time <= this.items[i].time + this.items[i].duration) {
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
            this.$('a').removeClass('current');
            item.render().$el.appendTo(this.el);
            this.items.push(item);
            console.log(item);
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
