//person number model
define(function(require, exports) {
    var PersonNumber = Backbone.Model.extend({
        defaults:{
            join:0,
            busy:0,
            dinner:0
        }
    });
    return require("export").out(PersonNumber);
});