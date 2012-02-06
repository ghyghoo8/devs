seajs.config({
    base:getURI() + "/js",
    preload: ["jquery","underscore","backbone","mustache"],
    alias:{"model":"model/","collection":"collection/","view":"view/"},
    charset: 'gbk'}).use("view/ListView", function(exp) {
        //…Ë÷√∏Ò Ω°¢±‡¬Î
        Backbone.emulateJSON = true;//json
        Backbone.emulateHTTP = true;//method=post
        //run app
        new exp();
    });
/**
 * log
 * @string str
 */
function log(str) {
    console.log(str);
}

//function createObj(req,path,args){
//    var _req=req(path);
//};


function getURI() {
//    return window.location.href;
    var host=window.location.host.replace("http://","");
    return "http://"+host;
}