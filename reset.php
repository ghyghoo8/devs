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
        //$node = $post->getElementsByTagName("id")->item(0);
        //$val = $node->nodeValue;
        //if ($val == $item['id']) {
        foreach ($item as $key => $value) {
            $post->getElementsByTagName($key)->item(0)->nodeValue = $value;
        }
        // }
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

    //    $msg = json_encode($item);
    return true;
}