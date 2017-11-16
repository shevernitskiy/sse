<?php

function sendNotyArray($user, $array)
{
    if ($user == 'all') {
        foreach (glob(dirname(__FILE__).'/streams/*', GLOB_NOSORT) as $stream) {
            file_put_contents($stream, time().PHP_EOL.json_encode($array).PHP_EOL);
        }
    } else {
        file_put_contents(dirname(__FILE__).'/streams/'.base64_encode($user).'.stream', time().PHP_EOL.json_encode($array).PHP_EOL);
    }
}

function sendNotyJson($user, $json)
{
    if ($user == 'all') {
        foreach (glob(dirname(__FILE__).'/streams/*', GLOB_NOSORT) as $stream) {
            file_put_contents($stream, time().PHP_EOL.$json.PHP_EOL);
        }
    } else {
        file_put_contents(dirname(__FILE__).'/streams/'.base64_encode($user).'.stream', time().PHP_EOL.$json.PHP_EOL);
    }
}

function isJson($string)
{
    return ((is_string($string) && (is_object(json_decode($string)) || is_array(json_decode($string))))) ? true : false;
}

// Массив input в качестве примера
// Ключи массива жестко заданы для формализации обработки

$input = array(
    'cmd' => 'notify',
    'data' => array(
        'color' => 'green',
        'icon'  => 'phone_forwarded',
        'text'  => 'входящий',
        'title' => '+4996456131213',
        'type'  => 'msg',
        'sound' => 'finally',
        'volume'=> '0.5',
        'button'=> array(
            array(
                'name' => 'создать контакт',
                'func' => 'window.location.replace("/shop/webasyst/contacts/#/contacts/add/");'
            ),)/*
            array(
                'name' => 'decline',
                'func' => 'alert("this is btn2");'
            )
        )*/
    )
);


if (!empty($_POST['sseid'])) {
    if (isJson($_POST['data'])) {
        sendNotyJson($_POST['user'], $_POST['data']);
        echo 'OK: data sent';
    } else {
        echo 'ERROR: data must be valid json string';
    }
} else {
    echo 'ERROR: permission denied';
}

//  Раскоментировать, чтобы  запускать вызовом скрипта
//sendNotyArray('admin',$input);
