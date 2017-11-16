<?php
session_start();
header('Content-Type: text/event-stream');
header('Cache-Control: no-cache'); // recommended to prevent caching of event data

$arr = sseGetMsg(dirname(__FILE__).'/streams/'.$_COOKIE['sseid'].'.stream');
if ($arr) {
    $timest = $arr[0];
    $msg = $arr[1];
    sseSendMsg($timest, $msg);
}

function sseSendMsg($id, $msg)
{
    echo "id: ".$id. PHP_EOL;
    echo "data: ".$msg. PHP_EOL;
    ob_flush();
    flush();
}
      
function sseGetMsg($path)
{
    if (file_exists($path)) {
        $lines = file($path);
        return $lines;
    } else {
        return false;
    }
}
