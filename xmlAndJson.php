<?php
//require_once("xml2json/json/JSON.php");
class xml_json {
    public function xml_to_json($source) {
        if (is_file($source)) { //�������ļ�������xml��string���ж�
            $xml_array = simplexml_load_file($source);
        } else {
            $xml_array = simplexml_load_string($source);
        }
        $json = json_encode($xml_array); //php5���Լ����ϣ�����Ǹ���汾��Ո���dJSON.php
        return $json;
    }

    public function json_to_xml($source, $charset = 'utf8') {
        if (emptyempty($source)) {
            return false;
        }
        $array = json_decode($source); //php5���Լ����ϣ�����Ǹ���汾��Ո���dJSON.php
        $xml = '<!--l version="1.0" encoding="' . $charset . '-->';
        $xml .= $this->change($array);
        return $xml;
    }

    public function change($source) {
        $string = "";
        foreach ($source as $k => $v) {
            $string .= "<" . $k . ">";
            if (is_array($v) || is_object($v)) { //�ж��Ƿ������飬���ߣ�����
                $string .= $this->change($v); //��������߶���͵ĵݹ����
            } else {
                $string .= $v; //ȡ�ñ�ǩ����
            }
            $string .= "";
        }
        return $string;
    }

}