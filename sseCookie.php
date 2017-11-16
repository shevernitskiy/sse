<?php

if (isset($_GET['set'])) {
    setcookie("sseid", base64_encode($_GET['set']), time()+60*60*24*365);
    echo 'Cookie setted, now redirecting...';
    header('Location: '.dirname($_SERVER['PHP_SELF']));
} else {
    echo 'Try use '.$_SERVER['PHP_SELF'].'?set=username';
}
