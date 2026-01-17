// 1. 拡張版辞書データ
const dictionaryData = {
    "climax": {
        "keywords": ["ここで決める", "ここだ", "これで決める", "行くぜ", "今だ", "チャンス"],
        "responses": ["いけえええ！その一撃にすべてを込めろ！", "最高のタイミング！畳み掛けろ！", "君なら絶対に外さない！叩き込め！"]
    },
    "starting": {
        "keywords": ["さあ行こう", "行きますか", "始めて行きますか", "さて", "行こう", "よし", "これで行く", "さてさて"],
        "responses": ["よし、気合入れていこうぜ！", "準備は万端だね。最高のプレイを期待してるよ！", "いよいよだね！派手に暴れてこよう！"]
    },
    "trying": {
        "keywords": ["まあとりあえずこれでやってみるか", "まあやってみよう", "まいっか", "まあそんなことはさておき"],
        "responses": ["まずはやってみるのが一番だね！", "その切り替えの早さ、大事だね！次いこう次！", "ナイスチャレンジ！何かが掴めるはずだよ。"]
    },
    "relief": {
        "keywords": ["ふう", "倒した", "いい感じだ", "大丈夫", "まあ", "ふふふ", "まあ大丈夫でしょ", "よっしゃ"],
        "responses": ["お疲れ様！いい流れが来てるね。", "その調子！今のプレイ、安定感あったよ。", "ナイス撃破！完全に圧倒してるね！"]
    },
    "trouble": {
        "keywords": [
            "どうしたものか", "どうしよ", "どうしようかな", "疲れた", "ふう疲れた", 
            "どうしたものかな", "どうしようか", "うーん", "あれ", "あれれ", "あらら",
            "全然わからん", "全くわからん", "どういうこと", "いかほどか"
        ],
        "responses": ["落ち着いて、まだ挽回できるよ！", "一旦状況を整理してみようか。", "うーん、どうくるかな…？慎重に見極めよう。"]
    },
    "panic": {
        "keywords": [
            "やばいやばいやばいやばいやばいやばいやばい", "やばいやばいやばいやばいやばい", 
            "やばいやばいやばいやばい", "やばいやばい", "やばい"
        ],
        "responses": ["落ち着いて！深呼吸だ！", "ピンチはチャンス！まだ諦めるな！", "ここを凌げばこっちのターンだ！踏ん張れ！"]
    },
    "research": {
        "keywords": [
            "サーチしてくれ", "ジャービス 敵をロックしてくれ", "ロックオン サーチ", "ロックオン", 
            "敵を観測してくれ", "敵をリサーチしてくれ", "ジャービス 敵をリサーチしてくれ", 
            "ジャービス 敵を観測してくれ", "リサーチ機能", "リサーチ機能 オン", "リサーチ オン", 
            "サーチ", "サーチ機能 オン", "サーチ機能オンにしてくれ", "索敵 してくれ"
        ],
        "responses": ["了解。リサーチを開始します。", "ターゲット確認。解析データを展開するよ。", "スキャン完了。周囲の情報を同期するね。"]
    }
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
    const chatWindow = document.getElementById('chat-window');
    chatWindow.scrollTo({ top: chatWindow.scrollHeight, behavior: 'smooth' });
}

// 3. 音声認識の本体
let recognition;
let isStarted = false;

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
    // interimResultsをtrueにすることで、喋っている途中の文字も取得しやすくします
    recognition.interimResults = true;

    recognition.onresult = (event) => {
        let finalTranscript = ''; // 確定した文章
        let interimTranscript = ''; // 喋っている途中の文章

        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript;
            } else {
                interimTranscript += transcript;
            }
        }

        // 文章が確定したら処理を実行
        if (finalTranscript !== '') {
            processText(finalTranscript);
        }
    };

    // テキストを解析して返信を生成する関数
    function processText(text) {
        const transcript = text.trim();
        postMessage("YOU", transcript, "user");

        for (let key in dictionaryData) {
            if (dictionaryData[key].keywords.some(kw => transcript.includes(kw))) {
                const resList = dictionaryData[key].responses;
                const reply = resList[Math.floor(Math.random() * resList.length)];
                
                setTimeout(() => {
                    const charName = names[Math.floor(Math.random() * names.length)];
                    postMessage(charName, reply, "ai");
                }, 600);
                return; // 一致したら終了
            }
        }
    }

    recognition.onerror = (event) => {
        console.error("音声認識エラー:", event.error);
        if (event.error === 'no-speech') {
            // 無音状態が続いた場合は再起動を試みる
            restartRecognition();
        }
    };

    recognition.onend = () => {
        if (isStarted) {
            restartRecognition();
        }
    };

    function restartRecognition() {
        setTimeout(() => {
            try {
                recognition.start();
            } catch (e) {
                // すでに開始されている場合は無視
            }
        }, 400);
    }

    try {
        recognition.start();
        postMessage("SYSTEM", "音声エンジン始動。解析を開始します。", "ai");
    } catch (e) {
        console.error(e);
    }
};
