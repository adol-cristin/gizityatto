const dictionaryData = {
    "climax": { "keywords": ["ここで決める", "ここだ", "これで決める", "行くぜ", "今だ", "チャンス"], "responses": ["いけえええ！", "最高のタイミング！", "君なら絶対に外さない！"] },
    "starting": { "keywords": ["さあ行こう", "行きますか", "始めて行きますか", "さて", "行こう", "よし", "これで行く", "さてさて"], "responses": ["よし、気合入れていこうぜ！", "準備は万端だね。", "いよいよだね！"] },
    "trying": { "keywords": ["まあとりあえずこれでやってみるか", "まあやってみよう", "まいっか", "まあそんなことはさておき"], "responses": ["まずはやってみるのが一番だね！", "その切り替えの早さ、大事だね！", "ナイスチャレンジ！"] },
    "relief": { "keywords": ["ふう", "倒した", "いい感じだ", "大丈夫", "まあ", "ふふふ", "まあ大丈夫でしょ", "よっしゃ"], "responses": ["お疲れ様！いい流れだね。", "その調子！安定感あったよ。", "ナイス撃破！"] },
    "trouble": { "keywords": ["どうしたものか", "どうしよ", "どうしようかな", "疲れた", "ふう疲れた", "うーん", "あれ", "全然わからん", "いかほどか"], "responses": ["落ち着いて、まだ挽回できるよ！", "一旦状況を整理してみようか。", "うーん、慎重に見極めよう。"] },
    "panic": { "keywords": ["やばいやばい", "やばい"], "responses": ["落ち着いて！深呼吸だ！", "ピンチはチャンス！", "ここを凌げばこっちのターンだ！"] },
    "research": { "keywords": ["サーチ", "リサーチ", "ロックオン", "観測", "索敵"], "responses": ["了解。リサーチを開始します。", "ターゲット確認。解析データを展開するよ。", "スキャン完了。情報を同期するね。"] }
};

const names = ["♛ Empress Luna", "✦ Golden Duke", "✧ Madam Diamond"];

function postMessage(name, text, type = "ai") {
    const chatFlow = document.getElementById('chat-flow');
    if (!chatFlow) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = 'yt-message';
    const isUser = (type === "user");
    msgDiv.innerHTML = `<div class="yt-avatar ${isUser ? 'user-avatar' : ''}"></div>
        <div class="yt-content"><span class="yt-name">${name}</span><span class="yt-text">${text}</span></div>`;
    chatFlow.appendChild(msgDiv);
    const chatWindow = document.getElementById('chat-window');
    chatWindow.scrollTo({ top: chatWindow.scrollHeight, behavior: 'smooth' });
}

let recognition;
let isStarted = false;

// 起動処理をイベントリスナーに変更
document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-button');
    if (startBtn) {
        startBtn.addEventListener('click', initCompanion);
    }
});

function initCompanion() {
    if (isStarted) return;
    isStarted = true;

    const overlay = document.getElementById('start-overlay');
    if (overlay) overlay.style.display = 'none';

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("お使いのブラウザは音声認識に対応していません。Chromeをお使いください。");
        return;
    }

    recognition = new SpeechRecognition();
    recognition.lang = 'ja-JP';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
        postMessage("SYSTEM", "音声エンジン始動。解析を開始します。", "ai");
    };

    recognition.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
            }
        }
        if (finalTranscript !== '') {
            const transcript = finalTranscript.trim();
            postMessage("YOU", transcript, "user");
            
            // 辞書照合
            for (let key in dictionaryData) {
                if (dictionaryData[key].keywords.some(kw => transcript.includes(kw))) {
                    const resList = dictionaryData[key].responses;
                    const reply = resList[Math.floor(Math.random() * resList.length)];
                    setTimeout(() => {
                        const charName = names[Math.floor(Math.random() * names.length)];
                        postMessage(charName, reply, "ai");
                    }, 600);
                    break;
                }
            }
        }
    };

    recognition.onerror = (event) => {
        console.error("Recognition Error:", event.error);
        if (event.error === 'not-allowed') {
            alert("マイクの使用が許可されていません。ブラウザの設定を確認してください。");
        }
    };

    recognition.onend = () => {
        if (isStarted) {
            setTimeout(() => {
                try { recognition.start(); } catch(e) {}
            }, 500);
        }
    };

    recognition.start();
}

window.initCompanion = function() {
    if (isStarted) return;
    isStarted = true;

    const overlay = document.getElementById('start-overlay');
    if (overlay) overlay.style.display = 'none';

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("音声認識未対応です。Chromeでお試しください。");
        return;
    }

    recognition = new SpeechRecognition();
    recognition.lang = 'ja-JP';
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.trim();
        postMessage("YOU", transcript, "user");

        let found = false;
        for (let key in dictionaryData) {
            if (dictionaryData[key].keywords.some(kw => transcript.includes(kw))) {
                const resList = dictionaryData[key].responses;
                const reply = resList[Math.floor(Math.random() * resList.length)];
                
                setTimeout(() => {
                    const charName = names[Math.floor(Math.random() * names.length)];
                    postMessage(charName, reply, "ai");
                }, 600);
                found = true;
                break;
            }
        }
        // 辞書にない言葉でも「YOU」として表示はされるので安心してください
    };

    recognition.onerror = (event) => {
        console.error("Recognition error:", event.error);
    };

    recognition.onend = () => {
        if (isStarted) recognition.start();
    };

    try {
        recognition.start();
        postMessage("SYSTEM", "音声エンジン始動。解析を開始します。", "ai");
    } catch (e) {
        console.error(e);
    }
};

