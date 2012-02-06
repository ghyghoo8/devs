<?php
require_once("xmlAndJson.php");
error_reporting(E_ALL & ~E_NOTICE);
$xmlFile = "data.xml";
$isSet = $_POST['isSet'];
$items = $_POST['item'];
if (!$isSet && $_POST['model']) {
    //ʹ�� JSON.stringifyת���� json_string ��Ҫ�� stripslashes ȥ��ת���ַ�  ��addslashes()Ϊ����ת���ַ�
    $model = json_decode(stripslashes($_POST['model'])); // ��"|" ������ "||"
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
            "info" => rawurlencode(iconv('utf-8', 'gb2312', "���������ˢ�£�")),
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
    // ����Ҫ��һ��DOMDocument����
    $doc = new DOMDocument();
// ����Xml�ļ�
    $doc->load($xmlpath);
    // ��ȡ���е�post��ǩ
    $postDom = $doc->getElementsByTagName("item");
//    print_r($doc);
    // ѭ������post��ǩ
    foreach ($postDom as $post) {
        // ��ȡid��ǩ value
        $node = $post->getElementsByTagName("id")->item(0);
        $val = $node->nodeValue;
        if ($val == $item['id']) {
            foreach ($item as $key => $value) {
                $post->getElementsByTagName($key)->item(0)->nodeValue = $value;
            }
            break;
        }
    }
    //����xml
    $xmlContent = $doc->saveXML();
    if (is_writable($xmlpath)) {
        if (!$handle = fopen($xmlpath, 'w+')) {
            throw new Exception("���ܴ��ļ� $xmlpath");
        }
// ��$somecontentд�뵽���Ǵ򿪵��ļ��С�
        if (fwrite($handle, $xmlContent) === FALSE) {
            throw new Exception("����д�뵽�ļ� $xmlpath");
        }
//        echo "����ɹ���";
        fclose($handle);
    } else {
        throw new Exception("�ļ� $xmlpath ����д");
    }

    $msg = json_encode($item);
    echo $msg;
}

/**
 * PHP stdClass Objectתarray
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