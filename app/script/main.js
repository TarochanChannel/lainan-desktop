window.jQuery = window.$ = require('jquery');
const startup_sound = new Audio("sound/startup.mp3");
const send_sound = new Audio("sound/send.mp3");
const reaction_sound = new Audio("sound/reaction.mp3");
const timer_sound = new Audio("sound/timer.mp3");
const error_sound = new Audio("sound/error.mp3");
const { ipcRenderer, shell } = require("electron");

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
    send_sound.play();
    $.getJSON("https://api.lainan.one/?msg=" + text, (data) => {
        document.getElementById("message").value = "";
        if (data.extensions.timer.IsMsgTimer) {
            document.getElementById("content").innerHTML = `${document.getElementById("content").innerHTML}\n<div class="message" user="user">${text}</div>\n<div class="message" user="lainan">${data.extensions.timer.timer_start}</div>`;
            setTimeout(() => {
                document.getElementById("content").innerHTML = `${document.getElementById("content").innerHTML}\n<div class="message" user="lainan">${data.extensions.timer.timer_end}</div>`;
                timer_sound.play();
            }, data.extensions.timer.timer_ms);
        } else {
            document.getElementById("content").innerHTML = `${document.getElementById("content").innerHTML}\n<div class="message" user="user">${text}</div>\n<div class="message" user="lainan">${data.reaction}</div>`;
        };
        reaction_sound.play();
    });
};