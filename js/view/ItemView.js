define(function(require, exports) {
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
    return require("export").out(ItemView);
});