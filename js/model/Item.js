//item model
define(function(require, exports) {
    var Item = Backbone.Model.extend({
        urlRoot:'main.php',
        url:function() {
            return this.urlRoot;
        },
        parse:function(a, b) {
        },
        defaults:{
            isSet:true,
            templete:$("#ps-item").html(),
            cKey:true,
            firstSet:true
        },
        getPs:function(isDefault) {
            var ps = this.get("ps"),def = require('ps_defalutValue')[this.get("id")] || "ƒæ”–…Ë÷√...";
            if (isDefault)return def;
            if (ps === "0" || ps === "")return def;
            return ps;
        }
    });
    return Item;
});