//item lists View
define(function(require, exports, module) {
    var ListView = Backbone.View.extend({
        el:'.list-detail',
        initialize:function() {
            var persons = this.persons = require("./NumberView").render({model:require("model/PersonNumber").render({id:"personNumber"})});
            //弹窗 psWin
            var psWin = require("./PsWin").render();
            _.bindAll(this, 'render', 'appendItem');
            this.collection = require("collection/List").render();
            //绑定add事件===
            var _this=this;
            this.collection.fetch({success:function(e) {
                var num = 0,sum = persons.model.defaults;
//                console.log(e.models.length);
                _(e.models).each(function(item) { // in case collection is not empty
                    this.appendItem(item).win = psWin;
                    _.each(sum, function(val, key) {
                        var k = ~~item.get(key);
                        if (k)sum[key] = val + k;
                    });
                }, _this);
                //加入统计model，不触发add事件===
                _this.collection.add(persons.model.set(sum),{add: true});
            },error:function() {
                alert("获取数据失败！");
            }
            });//获取数据
            this.render();
        },
        render:function() {
            $(this.el).parent().parent().append(this.persons.render());
            //弹窗  view对象
            this.psWin = require("./PsWin").render();
        },
        appendItem:function(item) {
            var itemView = require("./ItemView").render({model: item});
            $(this.el).append(itemView.render());
            return itemView;
        }
    });
    return ListView;
//    exports.ListView=ListView;
});