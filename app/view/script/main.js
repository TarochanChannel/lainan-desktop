window.jQuery = window.$ = require('jquery');
const startup_sound = new Audio("sound/startup.mp3");
const send_sound = new Audio("sound/send.mp3");
const reaction_sound = new Audio("sound/reaction.mp3");
const pop_sound = new Audio("sound/pop.mp3");
const timer_sound = new Audio("sound/timer.mp3");
const error_sound = new Audio("sound/error.mp3");
const { ipcRenderer, shell } = require("electron");
const version = "0.0.3.2";

window.onerror = async (message, file, lineNo, colNo, error) => {
    await error_sound.play();
    alert(`エラーが発生しました。\n\nDiscordで開発者へこのスクリーンショットを送信してください。\nhttps://discord.gg/FrRbqXWzpC \n\n\nメッセージ: ${message}\nバージョン: ${version}\nファイル: ${file}\n${lineNo}行 ${colNo}文字\nエラー: ${error}`);
};

function say(text) {
    return new Promise(async (resolve, reject) => {
        const voice = new Audio("https://api.lainan.one/voice.wav?text=" + text);
        await voice.play();
        resolve();
    });
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
    document.getElementById("message").value = "";
    document.getElementById("message").setAttribute("placeholder", "送信中...");
    document.getElementById("message").setAttribute("disabled", "");
    document.getElementById("content").innerHTML = `${document.getElementById("content").innerHTML}\n<div class="message" user="user">${text}</div>`;
    $.ajax({
        url: "https://api.lainan.one/?msg=" + text,
        type: "GET",
        dataType: 'json',
        success: (data) => {
            if (data.extensions.timer.IsMsgTimer) {
                document.getElementById("content").innerHTML = `${document.getElementById("content").innerHTML}\n<div class="message" user="lainan">${data.extensions.timer.timer_start}</div>`;
                say(data.extensions.timer.timer_start);
                setTimeout(() => {
                    document.getElementById("content").innerHTML = `${document.getElementById("content").innerHTML}\n<div class="message" user="lainan">${data.extensions.timer.timer_end}</div>`;
                    timer_sound.play();
                    say(data.extensions.timer.timer_end);
                }, data.extensions.timer.timer_ms);
            } else {
                document.getElementById("content").innerHTML = `${document.getElementById("content").innerHTML}\n<div class="message" user="lainan">${data.reaction}</div>`;
                say(data.reaction);
            };
            reaction_sound.play();
            document.getElementById("message").setAttribute("placeholder", "メッセージを送信");
            document.getElementById("message").removeAttribute("disabled");
        },
        timeout: 10000
    });
};