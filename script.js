// 1. 辞書データ (維持)
const dictionaryData = {
    "climax": { "keywords": ["ここで決める", "ここだ", "これで決める", "行くぜ", "今だ", "チャンス"], "responses": ["いけえええ！その一撃にすべてを込めろ！", "最高のタイミング！畳み掛けろ！", "君なら絶対に外さない！叩き込め！"] },
    "starting": { "keywords": ["さあ行こう", "行きますか", "始めて行きますか", "さて", "行こう", "よし", "これで行く", "さてさて"], "responses": ["よし、気合入れていこうぜ！", "準備は万端だね。最高のプレイを期待してるよ！", "いよいよだね！派手に暴れてこよう！"] },
    "trying": { "keywords": ["まあとりあえずこれでやってみるか", "まあやってみよう", "まいっか", "まあそんなことはさておき"], "responses": ["まずはやってみるのが一番だね！", "その切り替えの早さ、大事だね！次いこう次！", "ナイスチャレンジ！何かが掴めるはずだよ。"] },
    "relief": { "keywords": ["ふう", "倒した", "いい感じだ", "大丈夫", "まあ", "ふふふ", "まあ大丈夫でしょ", "よっしゃ"], "responses": ["お疲れ様！いい流れが来てるね。", "その調子！今のプレイ、安定感あったよ。", "ナイス撃破！完全に圧倒してるね！"] },
    "trouble": { "keywords": ["どうしたものか", "どうしよ", "どうしようかな", "疲れた", "ふう疲れた", "どうしたものかな", "どうしようか", "うーん", "あれ", "あれれ", "あらら", "全然わからん", "全くわからん", "どういうこと", "いかほどか"], "responses": ["落ち着いて、まだ挽回できるよ！", "一旦状況を整理してみようか。", "うーん、どうくるかな…？慎重に見極めよう。"] },
    "panic": { "keywords": ["やばいやばいやばいやばいやばいやばいやばい", "やばいやばいやばいやばいやばい", "やばいやばいやばいやばい", "やばいやばい", "やばい"], "responses": ["落ち着いて！深呼吸だ！", "ピンチはチャンス！まだ諦めるな！", "ここを凌げばこっちのターンだ！踏ん張れ！"] },
    "research": { "keywords": ["サーチしてくれ", "ジャービス 敵をロックしてくれ", "ロックオン サーチ", "ロックオン", "敵を観測してくれ", "敵をリサーチしてくれ", "ジャービス 敵をリサーチしてくれ", "ジャービス 敵を観測してくれ", "リサーチ機能", "リサーチ機能 オン", "リサーチ オン", "サーチ", "サーチ機能 オン", "サーチ機能オンにしてくれ", "索敵 してくれ"], "responses": ["了解。リサーチを開始します。", "ターゲット確認。解析データを展開するよ。", "スキャン完了。周囲の情報を同期するね。"] }
};

const names = ["♛ Empress Luna", "✦ Golden Duke", "✧ Madam Diamond"];

// 2. メッセージ表示関数
function postMessage(name, text, type = "ai") {
    const chatFlow = document.getElementById('chat-flow');
    if (!chatFlow) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = 'yt-message';
    const isUser = (type === "user");
    
    msgDiv.innerHTML = `
        <div class="yt-avatar ${isUser ? 'user-avatar' : ''}"></div>
        <div class="yt-content">
            <span class="yt-name">${name}</span>
            <span class="yt-text">${text}</span>
        </div>
    `;

    chatFlow.appendChild(msgDiv);

    // 古いメッセージ（15件以上）を上からフェードアウトさせて削除
    const messages = chatFlow.getElementsByClassName('yt-message');
    if (messages.length > 15) {
        const firstMsg = messages[0];
        firstMsg.style.opacity = '0';
        firstMsg.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            if (firstMsg.parentNode === chatFlow) {
                chatFlow.removeChild(firstMsg);
            }
        }, 300);
    }

    // スクロール調整
    const chatWindow = document.getElementById('chat-window');
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// 3. 起動処理
let recognition;
let isStarted = false;

document.addEventListener('DOMContentLoaded', () => {
    const startOverlay = document.getElementById('start-overlay');
    if (startOverlay) {
        startOverlay.addEventListener('click', () => {
            if (!isStarted) initCompanion();
        });
    }
});

function initCompanion() {
    isStarted = true;
    const overlay = document.getElementById('start-overlay');
    if (overlay) overlay.style.display = 'none';

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("Chromeブラウザを使用してください。");
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

            for (let key in dictionaryData) {
                if (dictionaryData[key].keywords.some(kw => transcript.includes(kw))) {
                    const resList = dictionaryData[key].responses;
                    const reply = resList[Math.floor(Math.random() * resList.length)];
                    setTimeout(() => {
                        postMessage(names[Math.floor(Math.random() * names.length)], reply, "ai");
                    }, 600);
                    break;
                }
            }
        }
    };

    recognition.onend = () => {
        if (isStarted) {
            setTimeout(() => { try { recognition.start(); } catch(e) {} }, 400);
        }
    };

    recognition.start();
}
            if (firstMsg.parentNode === chatFlow) {
                chatFlow.removeChild(firstMsg);
            }
        }, 300);
    }

    // 最新にスクロール
    const chatWindow = document.getElementById('chat-window');
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// 3. 起動処理と音声認識
let recognition;
let isStarted = false;

document.addEventListener('DOMContentLoaded', () => {
    const startOverlay = document.getElementById('start-overlay');
    if (startOverlay) {
        startOverlay.addEventListener('click', initCompanion);
    }
});

function initCompanion() {
    if (isStarted) return;
    isStarted = true;

    document.getElementById('start-overlay').style.display = 'none';

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("Chromeブラウザを使用してください。");
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

    recognition.onend = () => {
        if (isStarted) {
            setTimeout(() => { try { recognition.start(); } catch(e) {} }, 400);
        }
    };

    recognition.start();
}
