// 1. 辞書データ
const dictionaryData = {
    "climax": { "keywords": ["ここで決める", "ここだ", "今だ", "チャンス"], "responses": ["いけえええ！", "最高のタイミング！", "叩き込め！"] },
    "starting": { "keywords": ["さあ行こう", "始めて行きますか", "行こうか"], "responses": ["よし、気合入れていこうぜ！", "いよいよだね！"] },
    "trouble": { "keywords": ["どうしよう", "うーん", "あれ", "わからん"], "responses": ["落ち着いて、ゆっくりいこう！", "大丈夫、君なら解決できる。"] },
    "panic": { "keywords": ["やばい"], "responses": ["落ち着いて！深呼吸だ！", "ここを凌げばこっちのターンだ！"] },
    "research": { "keywords": ["サーチ", "リサーチ", "索敵"], "responses": ["了解。スキャンを開始します。", "解析データを展開するよ。"] }
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
    chatFlow.scrollTop = chatFlow.scrollHeight; // 自動スクロール
}

// 3. 音声認識の本体
let recognition;

window.initCompanion = function() {
    // 画面の「開始ボタン」を消す
    const overlay = document.getElementById('start-overlay');
    if (overlay) overlay.style.display = 'none';

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("このブラウザは音声認識に対応していません。PCのChromeで試してください。");
        return;
    }

    recognition = new SpeechRecognition();
    recognition.lang = 'ja-JP';
    recognition.continuous = true; // 連続認識
    recognition.interimResults = false;

    // 音声を拾った時の処理
    recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.trim();
        postMessage("YOU", transcript, "user");

        // 辞書チェック
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
    };

    // 止まったら自動再起動
    recognition.onend = () => {
        recognition.start();
    };

    // 起動
    try {
        recognition.start();
        postMessage("SYSTEM", "音声認識を開始しました。マイクに向かって話してください。", "ai");
    } catch (e) {
        console.error("起動エラー:", e);
    }
};
