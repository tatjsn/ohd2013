var ohd = ohd || {};
ohd.VideoWidget = (function() {
    return Backbone.View.extend({
        playPause: function () {
            console.log('videoWidget: playPause');
        },
        jumpPrev: function () {
            console.log('videoWidget: jumpPrev');
        },
        jumpNext: function () {
            console.log('videoWidget: jumpNext');
        },

        events: {
            'click .play': 'playPause',
            'click .prev': 'jumpPrev',
            'click .next': 'jumpNext'
        },

        initialize: function() {
            console.log('videoWidget: initialize', this.options);
            this.template = $(this.options.tmplSel).html();
        },

        render: function() {
            console.log('videoWidget: render');
            this.$el.html(this.template);
            return this;
        }
    });
})();
