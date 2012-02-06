//ps window View
define(function(require, exports) {
    var PsWin = Backbone.View.extend({
        tagName:"div",
        templeteHTML:$("#ps-win").html(),
        events:{
            "click a.ps-submit":"sureDone",
            "click a.ps-cancel":"waitDone"
        },
        initialize:function() {
            _.bindAll(this, "render", "waitDone", "sureDone");
            $(this.el).addClass("ps-win").appendTo("body");
        },
        render:function(str, item) {
            if (typeof str !== 'string' || $(str).hasClass("thinking"))str = item.model.getPs(true);
            $(this.el).html(Mustache.to_html(this.templeteHTML, {val:str})).show();
            this.item = item;
        },
        waitDone:function() {
            var str = "<strong class='thinking'>´ý¿¼ÂÇ¡£¡£¡£</strong>";
            this.item.trigger("busy.wait", str);
            $(this.el).hide();
        },
        sureDone:function() {
            var str = $(".ps-reason", this.el).val();
            this.item.trigger("busy.sure", str);
            $(this.el).hide();
        }
    });
    return require("export").out(PsWin);
});