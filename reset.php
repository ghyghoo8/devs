<?php
require_once("xmlAndJson.php");
error_reporting(E_ALL & ~E_NOTICE);
$xmlFile = "data.xml";
$pwd = $_POST['pwd'];

$item = array(
    "join" => 0,
    "busy" => 0,
    "dinner" => 0,
    "ps"=>0
);

$html = "<form name='reset' action='reset.php' method='post'>" .
        "<p><label>password:<input type='password' name='pwd' autofocus='true' autocomplete='off' /></label>&nbsp;" .
        "<input type='submit' value='submit for reset'/></p></form>" .
        "<style>h1{color:red;}</style>";
if ($pwd) {
    if ($pwd == 63621511) {
        $isDone = editXML($xmlFile, $item);
        if ($isDone) {
            echo '<h1><center>Successfull!!</center></h1>';
        }
    } else {
        echo '<h1><center>You can\'t reset it!!</center></h1>';
    }
}
echo $html;

function editXML($xmlpath, $item) {
    // 首先要建一个DOMDocument对象
    $doc = new DOMDocument();
// 加载Xml文件
    $doc->load($xmlpath);
    // 获取所有的post标签
    $postDom = $doc->getElementsByTagName("item");
//    print_r($doc);
    // 循环遍历post标签
    foreach ($postDom as $post) {
        // 获取id标签 value
        //$node = $post->getElementsByTagName("id")->item(0);
        //$val = $node->nodeValue;
        //if ($val == $item['id']) {
        foreach ($item as $key => $value) {
            $post->getElementsByTagName($key)->item(0)->nodeValue = $value;
        }
        // }
    }
    //保存xml
    $xmlContent = $doc->saveXML();
    if (is_writable($xmlpath)) {
        if (!$handle = fopen($xmlpath, 'w+')) {
            throw new Exception("不能打开文件 $xmlpath");
        }
// 将$somecontent写入到我们打开的文件中。
        if (fwrite($handle, $xmlContent) === FALSE) {
            throw new Exception("不能写入到文件 $xmlpath");
        }
//        echo "保存成功：";
        fclose($handle);
    } else {
        throw new Exception("文件 $xmlpath 不可写");
    }

    //    $msg = json_encode($item);
    return true;
}