/**
 * Created by JetBrains PhpStorm.
 * User: yefanglin
 * Date: 11-12-12
 * Time: обнГ5:38
 * To change this template use File | Settings | File Templates.
 */
define(function(require, exports) {
    var constrList = [],_constr;
    exports.out = function(constr) {
        constrList.push(_constr = constr);
        return this;
    };
    exports.render = function(arg) {
        _constr = this.getPop();
        return new _constr(arg || {});
    };
    exports.getPop = function() {
        return constrList.pop() || this.getLast();
    };
    exports.getLast = function() {
        return _constr || function() {
        };
    }
});
