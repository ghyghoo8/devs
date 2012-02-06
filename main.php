<?php
require_once("xmlAndJson.php");
error_reporting(E_ALL & ~E_NOTICE);
$xmlFile = "data.xml";
$isSet = $_POST['isSet'];
$items = $_POST['item'];
if (!$isSet && $_POST['model']) {
    //使用 JSON.stringify转化的 json_string 需要用 stripslashes 去除转义字符  ，addslashes()为加上转移字符
    $model = json_decode(stripslashes($_POST['model'])); // 用"|" 而不是 "||"
    $items = object2array($model);
    $isSet = $items['isSet'];
}
//echo "1";
if ($isSet) {
    try {
        editXML($items, $xmlFile);
    } catch (Exception $e) {
        $msgerror = array(
            "error" => 0,
            "info" => rawurlencode(iconv('utf-8', 'gb2312', "保存错误，请刷新！")),
            "msg" => rawurlencode(iconv('utf-8', 'gb2312', $e->getMessage()))
        );
        $msgerror = json_encode($msgerror);
        echo $msgerror;
    }
} else {
    $xm = new xml_json(); //new
    $json = $xm->xml_to_json($xmlFile);
    print_r($json);
}

function editXML($item, $xmlpath) {
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
        $node = $post->getElementsByTagName("id")->item(0);
        $val = $node->nodeValue;
        if ($val == $item['id']) {
            foreach ($item as $key => $value) {
                $post->getElementsByTagName($key)->item(0)->nodeValue = $value;
            }
            break;
        }
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

    $msg = json_encode($item);
    echo $msg;
}

/**
 * PHP stdClass Object转array
 *
 * @param  $array
 * @return array
 */
function object2array($array) {
    if (is_object($array)) {
        $array = (array) $array;
    }
    if (is_array($array)) {
        foreach ($array as $key => $value)
        {
            $array[$key] = object2array($value);
        }
    }
    return $array;
}