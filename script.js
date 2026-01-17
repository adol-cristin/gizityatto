// 1. 辞書データ (変更なし)
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
    // スムーズなスクロール
    chatFlow.parentElement.scrollTo({ top: chatFlow.scrollHeight, behavior: 'smooth' });
}

// 3. 音声認識の本体
let recognition;
let isStarted = false; // 二重起動防止

window.initCompanion = function() {
    if (isStarted) return; 
    isStarted = true;

    const overlay = document.getElementById('start-overlay');
    if (overlay) overlay.style.display = 'none';

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("お使いのブラウザは音声認識に対応していません。PCのChromeかSafariをお試しください。");
        return;
    }

    recognition = new SpeechRecognition();
    recognition.lang = 'ja-JP';
    recognition.continuous = true;
    recognition.interimResults = false;

    // 音声を認識した時
    recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.trim();
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
    };

    // 重要：エラーハンドリング（これが無いと止まったままになります）
    recognition.onerror = (event) => {
        console.error("Speech Recognition Error:", event.error);
        if (event.error === 'not-allowed') {
            postMessage("SYSTEM", "マイクの許可が必要です。URL横の鍵マークを確認してください。", "ai");
        }
    };

    // 重要：安全な再起動
    recognition.onend = () => {
        if (isStarted) {
            console.log("Recognition ended, restarting...");
            try {
                recognition.start();
            } catch (e) {
                console.error("Restart failed:", e);
            }
        }
    };

    try {
        recognition.start();
        postMessage("SYSTEM", "音声認識アクティブ：お話しください", "ai");
    } catch (e) {
        console.error("Start failed:", e);
    }
};
