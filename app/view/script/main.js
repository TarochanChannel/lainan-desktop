window.jQuery = window.$ = require('jquery');
const startup_sound = new Audio("sound/startup.mp3");
const send_sound = new Audio("sound/send.mp3");
const reaction_sound = new Audio("sound/reaction.mp3");
const pop_sound = new Audio("sound/pop.mp3");
const timer_sound = new Audio("sound/timer.mp3");
const error_sound = new Audio("sound/error.mp3");
const { ipcRenderer, shell } = require("electron");
const version = "0.0.3.4";

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
    document.getElementById("version").innerHTML = `v ${version}`;
    $("#goside_btn").on("click", () => {
        ipcRenderer.send("goside");
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

    $.ajax({
        "url": "https://raw.githubusercontent.com/TarochanChannel/lainan-desktop/main/last_release",
        "type": "GET",
        "success": async (data) => {
            var v_score = 0, d_score = 0;
            const v = version.split(".");
            const d = data.split(".");
            if (v.length >= d.length) {
                d.forEach((val, ind) => {
                    if (Number(v[ind]) < Number(val)) d_score = + 1;
                    if (Number(v[ind]) > Number(val)) v_score = + 1;
                });
            } else if (v.length < d.length) {
                for (let index = 0; index < (d.length - v.length); index++) {
                    v.push("0");
                };
                d.forEach((val, ind) => {
                    if (Number(v[ind]) < Number(val)) d_score = + 1;
                    if (Number(v[ind]) > Number(val)) v_score = + 1;
                });
            };
            console.log(`${v_score},${d_score}`)
            if (v_score < d_score) new_modal("update", "更新があります", `Laiann Desktop v${data}がリリースされました。<br>今すぐ新しいバージョンに更新してください。<br><br><small>現在のバージョンは、v${version}です。</small>`);
        }
    });
});

function send(text) {
    send_sound.play();
    document.getElementById("message").value = "";
    document.getElementById("message").setAttribute("placeholder", "送信中...");
    document.getElementById("message").setAttribute("disabled", "");
    document.getElementById("content").innerHTML = `${document.getElementById("content").innerHTML}\n<div class="message" user="user">${text}</div>`;
    $("#content").animate({ scrollTop: $("#content").get(0).scrollHeight });
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
            $("#content").animate({ scrollTop: $("#content").get(0).scrollHeight });
        },
        timeout: 10000
    });
};

function new_modal(_modal_id, _modal_title, _modal_content) {
    var _modal = document.createElement("div");
    _modal.setAttribute("id", _modal_id + "_modal");
    _modal.classList.add("modal");
    _modal.innerHTML = `<h3 id="${_modal_id}_modal_title">${_modal_title}</h3><div id="${_modal_id}_modal_content">${_modal_content}</div>`;
    document.body.appendChild(_modal);
    return _modal_id;
};

function delete_modal(_modal_id) {
    $("#" + _modal_id + "_modal").fadeOut("0.2");
    setTimeout(() => {
        document.getElementById(_modal_id + "_modal").remove();
    }, 200);
};