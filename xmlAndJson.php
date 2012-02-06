<?php
//require_once("xml2json/json/JSON.php");
class xml_json {
    public function xml_to_json($source) {
        if (is_file($source)) { //传的是文件，还是xml的string的判断
            $xml_array = simplexml_load_file($source);
        } else {
            $xml_array = simplexml_load_string($source);
        }
        $json = json_encode($xml_array); //php5，以及以上，如果是更早版本，請下載JSON.php
        return $json;
    }

    public function json_to_xml($source, $charset = 'utf8') {
        if (emptyempty($source)) {
            return false;
        }
        $array = json_decode($source); //php5，以及以上，如果是更早版本，請下載JSON.php
        $xml = '<!--l version="1.0" encoding="' . $charset . '-->';
        $xml .= $this->change($array);
        return $xml;
    }

    public function change($source) {
        $string = "";
        foreach ($source as $k => $v) {
            $string .= "<" . $k . ">";
            if (is_array($v) || is_object($v)) { //判断是否是数组，或者，对像
                $string .= $this->change($v); //是数组或者对像就的递归调用
            } else {
                $string .= $v; //取得标签数据
            }
            $string .= "";
        }
        return $string;
    }

}