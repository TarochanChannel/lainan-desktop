window.jQuery = window.$ = require('jquery');
const startup_sound = new Audio("sound/startup.mp3");
const send_sound = new Audio("sound/send.mp3");
const reaction_sound = new Audio("sound/reaction.mp3");
const error_sound = new Audio("sound/error.mp3");
const { ipcRenderer, shell } = require("electron");
//var chat = localStorage.getItem("config")?JSON.parse(localStorage.getItem("config")):{};

window.onerror = async (message, file, lineNo, colNo, error) => {
    await error_sound.play();
    alert(`エラーが発生しました。\n\nDiscordで開発者へこのスクリーンショットを送信してください。\nhttps://discord.gg/FrRbqXWzpC \n\n\nメッセージ: ${message}\nファイル: ${file}\n${lineNo}行 ${colNo}文字\nエラー: ${error}`);
};

$(function () {
    startup_sound.play();
    ipcRenderer.send("onload");
    ipcRenderer.on("theme", (e, arg) => {
        document.documentElement.setAttribute("theme", arg);
    });
    /*$(window).scroll(function () {
        $(".effect-fade").each(function () {
            var elemPos = $(this).offset().top;
            var scroll = $(window).scrollTop();
            var windowHeight = $(window).height();
            if (scroll > elemPos - windowHeight) {
                $(this).addClass("effect-scroll");
            }
        });
    });
    jQuery(window).scroll();*/
    $("#maximize_btn").on("click", () => {
        ipcRenderer.send("maximize");
    });
    $("#minimize_btn").on("click", () => {
        ipcRenderer.send("minimize");
    });
    $("#close_btn").on("click", () => {
        ipcRenderer.send("close");
    });
});

function send(text) {
    //chat[Object.keys(chat).length + 1] = {"user": "user","content": text};
    send_sound.play();
    $.getJSON("https://api.lainan.one/?msg=" + text, (data) => {
        document.getElementById("message").value = "";
        var temp = document.getElementById("content").innerHTML;
        document.getElementById("content").innerHTML = `${temp}\n<div class="message" user="user">${text}</div>\n<div class="message" user="lainan">${data.reaction}</div>`;
        //chat[Object.keys(chat).length + 1] = {"user": "lainan","content": data.reaction};
        reaction_sound.play();
        //localStorage.setItem("config",JSON.stringify(chat));
    });
};