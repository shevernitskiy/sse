<!DOCTYPE html>
<html>
<head>
    <script async id="ssescript" src="js/sse.js"></script>
    <script 
        src="http://code.jquery.com/jquery-3.2.1.js"
        integrity="sha256-DZAnKJ/6XZ9si04Hgrsxu/8s717jcIzLy3oi35EouyE="
        crossorigin="anonymous">
    </script>    
</head>

<body>
    <p>
        <?php
        if ($_COOKIE['sseid']) {
            echo 'Cookie setted, your username: '.base64_decode($_COOKIE['sseid']);
            echo '<p><input type="button" value="Check" id="checkBtn"></p>';
        } else {
            echo 'Cookie must be setted, use /sseCookie.php?set=username';
        }
        ?>
    </p>
    <input type="hidden" value="<?php echo $_COOKIE['sseid'];?>" id="ssecookie">
    <input type="hidden" value="<?php echo base64_decode($_COOKIE['sseid']);?>" id="sseuser">
    <input type="hidden" value="<?php echo dirname($_SERVER['SCRIPT_NAME']);?>" id="rooturl">
</body>

<script>
    $('#checkBtn').click(function () {
        var input = {
            sseid: $('#ssecookie').val(),
            user: $('#sseuser').val(),
            data: JSON.stringify({
                cmd: "notify",
                data: {
                    text: "тестовая уведомляшка",
                    title: 'user: ' + $('#sseuser').val(),
                    color: 'yellow',
                    sound: 'finally',
                    icon: 'warning'
                }
            })
        };

        $.ajax({
            url: $('#rooturl').val() + '/sseWriter.php',
            type: 'POST',
            data: input
        });
        return false;
    });
</script>

</html>