$(function() {
    seajs.config({base: 'http://www.abc.com/devs/js',alias:{"model":"model/","collection":"collection/","view":"view/"},charset: 'gbk'}).use("ps_defalutValue", function(exp) {
        //export竟然是chrome关键字！
        var ps_defalutValue = exp;
        Backbone.emulateJSON = true;//json
        Backbone.emulateHTTP = true;//method=post
        //item model
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
                var ps = this.get("ps"),def = ps_defalutValue[this.get("id")] || "木有设置...";
                if (isDefault)return def;
                if (ps === "0" || ps === "")return def;
                return ps;
            }
        });
        //person number model
        var PersonNumber = Backbone.Model.extend({
            defaults:{
                join:0,
                busy:0,
                dinner:0
            }
        });
        //collection
        var List = Backbone.Collection.extend({
            model: Item,
            url:'main.php',
            parse: function(response) {
                return response.items.item;
            }
        });
        //item view
        var ItemView = Backbone.View.extend({
            tagName:"li",
            events:{
                'click a.green':"takeGreen",
                'click a.red':"takeRed",
                'click a.ora':"takeOra"
            },
            initialize:function() {
                _.bindAll(this, 'render', 'psReset', 'toSave', 'takeGreen', 'takeRed', 'takeOra', 'setVal', 'saveJoinABusy', 'saveDinner', 'errorSave'); // every function that uses 'this' as the current object should be in here
                var model = this.model,data = model.toJSON();
                //'0'转化为 0
                data.join -= 0;
                data.busy -= 0;
                data.dinner -= 0;
                data.getPs = function() {
                    return function(text, render) {
                        if (data.busy)return render(text);
                        return "";
                    }
                };
                data.isAche = function() {
                    return function() {
                        return model.getPs();
                    }
                };
                model.bind("change", this.setVal);
                model.bind("save.dinner", this.saveDinner);
                model.bind("save.join-busy", this.saveJoinABusy);
                model.bind("save.error", this.errorSave);
                this.bind("busy.wait", this.toSave);
                this.bind("busy.sure", this.toSave);
                $(this.el).append(Mustache.to_html(this.model.get('templete'), data));
                model.unset("templete", {silent: true});
            },
            render:function() {
                return $(this.el);
            },
            psReset:function(model) {
                var d = {
                    ps:model.get("ps"),
                    isAche:function() {
                        return function(text) {
                            if (model.get("busy")) return d.ps;
                            return "";
                        }
                    }};
                $(".ps-busy", this.el).remove();
                if (model.get("busy"))$(this.el).append(Mustache.to_html('<span class="ps-busy"><samp>(</samp><em>PS:{{#isAche}}{{ps}}{{/isAche}}</em><samp>)</samp></span>', d));
            },
            setVal: function(m) {
                var personNumber = m.collection.get("personNumber");
                m.hasChanged("dinner") ? m.trigger("save.dinner", m, this.el, personNumber) : m.trigger("save.join-busy", m, this.el, personNumber);
            },
            saveJoinABusy:function(m, el, personNumber) {
                var item = this,isChanged = m.hasChanged("busy");
                m.save(null, {success:function(model, rep) {
                    log("修改属性saveJoinABusy：" + rep.cKey);
                    var val = personNumber.toJSON(),firstSet = model.get("firstSet");
                    var def = firstSet ? {join:0,busy:0} : {join:-1,busy:-1};
                    if (firstSet)model.unset("firstSet", {silent:true});
                    if (rep.cKey === "join") {
                        $("a.green", el).removeClass("off").next().addClass("off");
                        def.join = 1;
                    } else {
                        $("a.red", el).removeClass("off").prev().addClass("off");
                        def.busy = 1;
                    }
                    //reset HTML
                    item.psReset(model);
                    //属性组合
                    for (var n in def) val[n] = parseInt(val[n]) + def[n];
                    //发生变化，则数据同步到 personNumber 统计
                    log("busy数据变化：" + isChanged);
                    if (isChanged)personNumber.set(val);
                },error:function(ev) {
                    m.trigger("save.error", m, ev);
                }});
            },
            saveDinner:function(m, el, personNumber) {
                m.save(null, {success:function(model, rep) {
                    log("修改属性saveDinner：" + rep.cKey);
                    var val = personNumber.toJSON(),def = !!rep.dinner ? {dinner:1} : {dinner:-1},a = $("a.ora", el);
                    a.hasClass("off") ? a.removeClass("off") : a.addClass("off");
                    //属性组合
                    for (var n in def) val[n] = parseInt(val[n]) + def[n];
                    //数据同步到 personNumber 统计
                    personNumber.set(val);
                },error:function(ev) {
                    m.trigger("save.error", m, ev);
                } });
            },
            errorSave:function(m, ev) {
                //previousAttributes-->当保存成功时，previousAttributes被attributes覆盖,出错时，不进行赋值
                m.set(m.previousAttributes(), {silent: true});////回滚数据，不触发change事件
                log(ev);
                alert("保存失败");
            },
            takeGreen:function(ev) {
                var _mod = this.model;
                if (_mod.get("join") - 0)return;
                _mod.set({join:1,busy:0,cKey:"join",ps:""});
                //                    log(_mod.toJSON());
            },
            takeRed:function(ev) {
                var _mod = this.model,ps = _mod.getPs();
                log("takeRed");
                _mod.set({join:0,busy:1,cKey:"busy",ps:ps}, {silent: true});
                this.win.render(ps, this);
            },
            takeOra:function(ev) {
                var _mod = this.model,d = {dinner:0,cKey:"dinner"};
                (_mod.get("dinner") - 0) ? d.dinner = 0 : d.dinner = 1;
                _mod.set(d);
            },
            toSave:function(str) {
                var val = str == "" ? this.model.getPs() : str;
                this.psReset(this.model.set({ps:val}));
            }
        });
        /**
         * 统计表
         */
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
                var d = this.model.toJSON(),_this = this;
                _(['join','busy','dinner']).each(function(item) {
                    _this[item].html(d[item]);
                })
            }
        });
//ps window View
        var PsWin = Backbone.View.extend({
            tagName:"div",
            templeteHTML:$("#ps-win").html(),
            events:{
                "click a.ps-submit":"sureDone",
                "click a.ps-cancel":"waitDone"
            },
            initialize:function() {
                _.bind(this, "render", "waitDone", "sureDone");
                $(this.el).addClass("ps-win").appendTo("body");
            },
            render:function(str, item) {
                if (typeof str !== 'string' || $(str).hasClass("thinking"))str = item.model.getPs(true);
                $(this.el).html(Mustache.to_html(this.templeteHTML, {val:str})).show();
                this.item = item;
            },
            waitDone:function() {
                var str = "<strong class='thinking'>待考虑。。。</strong>";
                this.item.trigger("busy.wait", str);
                $(this.el).hide();
            },
            sureDone:function() {
                var str = $(".ps-reason", this.el).val();
                this.item.trigger("busy.sure", str);
                $(this.el).hide();
            }
        });

//item lists View
        var ListView = Backbone.View.extend({
            el:'.list-detail',
            initialize:function() {
                var _this = this,persons = _this.persons = new NumberView({model:new PersonNumber({id:"personNumber"})});
                //弹窗 psWin
                var psWin = new PsWin();
                _.bindAll(this, 'render', 'appendItem');
                _this.collection = new List();
                //绑定add事件===
                _this.collection.fetch({add: true,success:function(e) {
                    var num = 0,sum = persons.model.defaults;
                    _(e.models).each(function(item) { // in case collection is not empty
                        _this.appendItem(item).win = psWin;
                        _.each(sum, function(val, key) {
                            var k = ~~item.get(key);
                            if (k)sum[key] = val + k;
                        });
                    }, _this);
                    //加入统计model，不触发add事件===
                    _this.collection.add(persons.model.set(sum));
                },error:function() {
                    alert("获取数据失败！");
                }
                });//获取数据
                this.render();
            },
            render:function() {
                $(this.el).parent().parent().append(this.persons.render());
                //弹窗  view对象
                this.psWin = new PsWin();
            },
            appendItem:function(item) {
                var itemView = new ItemView({
                    model: item
                });
                $(this.el).append(itemView.render());
                return itemView;
            }
        });
        new ListView();
    });
});
/**
 * log
 * @string str
 */
function log(str) {
    console.log(str);
}