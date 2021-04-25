$.getJSON("https://api.lainan.one/?msg=こんにちは",(data) => {
    document.getElementById("reaction").innerHTML = data.reaction;
});

function getreac() {
    $.getJSON("https://api.lainan.one/?msg="+document.getElementById("text").value,(data) => {
    document.getElementById("text").value = "";
    document.getElementById("reaction").innerHTML = data.reaction;
    new Audio("https://api.lainan.one/voice.wav?text="+data.reaction).play();
});
};