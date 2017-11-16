/**
 * Константа к месту расположения кода (sseServer.php и js/)
 */
var script = document.getElementById('ssescript');
const SSEURL = script.src.replace("js/sse.js","");

/**
 * Функция динамической загрузки css
 * @param {string} file 
 */
function sseCSSLoad(file) {
    var link = document.createElement("link");
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("href", file);
    document.getElementsByTagName("head")[0].appendChild(link);
    return true;
}
/**
 * Функция динамической загрузки js
 * @param {string} src 
 */
function sseJSLoad(src) {
    var scriptElem = document.createElement("script");
    scriptElem.setAttribute("src", src);
    scriptElem.setAttribute("type", "text/javascript");
    document.getElementsByTagName("head")[0].appendChild(scriptElem);
    return true;
}
/**
 * Функция возвращает путь от домена до точки подключения скрипта
 */
function ssePathTo() {
    var pa = window.location.pathname.split("/");
    var pathToDir = "";
    for (i = 0; i < pa.length - 1; i++) {
        pathToDir += pa[i];
        pathToDir += "/";
    }
    return pathToDir;
}

/**
 * Основной код клиентской стороны SSE
 */
var timeStamp = 0; // Задаем переменную 0, чтобы не сработала команда при загрузке
if (typeof EventSource !== "undefined") {
    var source = new EventSource(SSEURL + "sseServer.php");
    source.onmessage = function(event) {
        //console.log(event);
        if (timeStamp != event.lastEventId && timeStamp != 0) {
            /* Id события изменилось => новое событие */
            timeStamp = event.lastEventId;
            var json = JSON.parse(event.data);
            try {
                var fe = typeof eval('sse'+json.cmd);
            } catch (err) {
                console.log(
                    'Command "sse' + json.cmd + '" must be declared in commands.js'
                );
            }
            if (fe) {
                eval('sse'+json.cmd)(json.data);
            }
        } else {
            /* Срабатывает только при загрузке */
            if (timeStamp == 0) {
                timeStamp = event.lastEventId;
            }
        }
    };
} else {
    document.getElementById("result").innerHTML =
        "Sorry, your browser does not support server-sent events...";
}

/**
 * Добавление звуков
 */

window.onload = function() {
    panel = document.createElement('div');
    panel.setAttribute("id", "sseaudio");
    panel.setAttribute("style", "display: none;");
    panel.innerHTML = '<audio id="sound_arpeggio" src="' + SSEURL + 'js/sound/arpeggio.ogg" controls preload="auto" autobuffer></audio>';
    panel.innerHTML = panel.innerHTML + '<audio id="sound_attention" src="' + SSEURL + 'js/sound/attention.ogg" controls preload="auto" autobuffer></audio>';
    panel.innerHTML = panel.innerHTML + '<audio id="sound_bell" src="' + SSEURL + 'js/sound/bell.ogg" controls preload="auto" autobuffer></audio>';
    panel.innerHTML = panel.innerHTML + '<audio id="sound_chime" src="' + SSEURL + 'js/sound/chime.ogg" controls preload="auto" autobuffer></audio>';
    panel.innerHTML = panel.innerHTML + '<audio id="sound_demo" src="' + SSEURL + 'js/sound/demo.ogg" controls preload="auto" autobuffer></audio>';
    panel.innerHTML = panel.innerHTML + '<audio id="sound_droplet" src="' + SSEURL + 'js/sound/droplet.ogg" controls preload="auto" autobuffer></audio>';
    panel.innerHTML = panel.innerHTML + '<audio id="sound_dwarf" src="' + SSEURL + 'js/sound/dwarf.ogg" controls preload="auto" autobuffer></audio>';
    panel.innerHTML = panel.innerHTML + '<audio id="sound_error" src="' + SSEURL + 'js/sound/error.ogg" controls preload="auto" autobuffer></audio>';
    panel.innerHTML = panel.innerHTML + '<audio id="sound_error1" src="' + SSEURL + 'js/sound/error1.ogg" controls preload="auto" autobuffer></audio>';
    panel.innerHTML = panel.innerHTML + '<audio id="sound_error2" src="' + SSEURL + 'js/sound/error2.ogg" controls preload="auto" autobuffer></audio>';
    panel.innerHTML = panel.innerHTML + '<audio id="sound_finally" src="' + SSEURL + 'js/sound/finally.ogg" controls preload="auto" autobuffer></audio>';
    panel.innerHTML = panel.innerHTML + '<audio id="sound_friend" src="' + SSEURL + 'js/sound/friend.ogg" controls preload="auto" autobuffer></audio>';
    panel.innerHTML = panel.innerHTML + '<audio id="sound_office" src="' + SSEURL + 'js/sound/office.ogg" controls preload="auto" autobuffer></audio>';   
    panel.innerHTML = panel.innerHTML + '<audio id="sound_pluck" src="' + SSEURL + 'js/sound/pluck.ogg" controls preload="auto" autobuffer></audio>';                             
    document.body.appendChild(panel);
}

/**
 * Функция воспроизведения звука, тэги <audio должны присутствовать на странице>
 * @return mixed 
 */
function ssePlaySound(sound, volume = 0.5) {
    var audio = document.getElementById('sound_' + sound);
    if(audio) {
        audio.volume = volume;
        audio.play();
    }
}

/**
 * Подключение функций обработчиков
 */

/**
 * Функция уведомления
 * 
 * Использует библиотеку iziToast
 */

sseJSLoad(SSEURL + "js/iziToast/iziToast.js");
sseCSSLoad(SSEURL + "js/iziToast/iziToast.css");
sseCSSLoad("https://fonts.googleapis.com/icon?family=Material+Icons");

function ssenotify(data) {
    if (data.type == "destroy") {
        iziToast.destroy();
        return true;
    }
    var color;
    switch (data.color) {
        case "green":
            color = "rgb(51, 255, 51)";
            break;
        case "red":
            color = "rgb(255, 36, 0)";
            break;
        case "yellow":
            color = "rgb(255, 255, 0)";
            break;
        case "blue":
            color = "rgb(0, 191, 255)";
            break;
        case "white":
            color = "rgb(255, 255, 255)";
            break;
        default:
            color = "rgb(0, 255, 184)";
            break;
    }

    toast = {
        title: data.title,
        message: data.text,
        progressBarColor: color,
        theme: "dark",
        close: true,
        pauseOnHover: true,
        layout: 2
    };

    if (data.icon) {
        toast.icon = "material-icons";
        toast.iconText = data.icon;
        toast.iconColor = color;
    }
    if (data.image) {
        toast.image = data.image;
        toast.imageWidth = 70;
    }
    if (data.button) {
        toast.buttons = [];
        data.button.forEach(function(el) {
            toast.buttons.push([
                "<button>" + el.name + "</button>",
                function(instance, toast) {
                    eval(el.func);
                    instance.hide(toast, "close", "buttonName");
                }
            ]);
        });
    }
    if (data.time) {
        toast.timeout = data.time*1000;
    }

    iziToast.show(toast);

    if (data.sound) {
        if (data.volume && data.volume >= 0 && data.volume <= 1) {
            ssePlaySound(data.sound,data.volume);
        } else {
            ssePlaySound(data.sound);
        }
    }

    return true;
}

/**
 * Функция выполнения любого кода
 * 
 * Код должен лежать в data.code
 * 
 * !!!
 * Потенцианльно опасная функция
 * !!!
 * 
 * @param {object} data 
 */
function sseexec(data) {
    eval(data.code);
}