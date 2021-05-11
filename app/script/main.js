window.jQuery = window.$ = require('jquery');
const startup_sound = new Audio("sound/startup.mp3");
const send_sound = new Audio("sound/send.mp3");
const reaction_sound = new Audio("sound/reaction.mp3");
const error_sound = new Audio("sound/error.mp3");
const { ipcRenderer } = require("electron");

$(function () {
    startup_sound.play();
    ipcRenderer.send("onload");
    ipcRenderer.on("theme", (e, arg) => {
        document.documentElement.setAttribute("theme", arg);
    });
    $(window).scroll(function () {
        $(".effect-fade").each(function () {
            var elemPos = $(this).offset().top;
            var scroll = $(window).scrollTop();
            var windowHeight = $(window).height();
            if (scroll > elemPos - windowHeight) {
                $(this).addClass("effect-scroll");
            }
        });
    });
    jQuery(window).scroll();
});

function send(text) {
    send_sound.play();
    $.getJSON("https://api.lainan.one/?msg=" + text, (data) => {
        reaction_sound.play();
        document.getElementById("message").value = "";
        document.getElementById("content").innerHTML = data.reaction;
        if (data.reaction.length >= 15) {
            document.getElementById("content").style.fontSize = "1em";
        };
    });
};