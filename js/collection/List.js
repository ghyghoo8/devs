//collection
define(function(require, exports) {
    var List = Backbone.Collection.extend({
        model: require("model/Item"),
        url:'main.php',
        parse: function(response) {
            return response.items.item;
        }
    });
    return require("export").out(List);
});