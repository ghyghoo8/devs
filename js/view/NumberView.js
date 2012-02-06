/**
 * 统计表
 */
define(function(require, exports) {
    var NumberView = Backbone.View.extend({
        tagName:'p',
        initialize:function() {
            _.bindAll(this, 'render', 'toData');
            this.label = this.make("label", {}, '总结：');
            this.join = $(this.make("span", {"class":"join-in"}, "0"));
            this.busy = $(this.make("span", {"class":"no-join"}, "0"));
            this.dinner = $(this.make("span", {"class":"night-noon"}, "0"));
            this.model.bind('change', this.toData);
        },
        render:function() {
            return $(this.el).append(this.label, this.join, this.busy, this.dinner).addClass("sum");
        },
        toData:function() {
            var d = this.model.toJSON();
            _(['join','busy','dinner']).each(function(item) {
                this[item].html(d[item]);
            },this);
        }
    });
    return require("export").out(NumberView);
});