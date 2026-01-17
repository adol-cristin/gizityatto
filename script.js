// 1. 辞書データ（内容は維持）
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

// 2. メッセージ表示関数（フェードアウトと自動削除を追加）
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

    // --- 【重要】古いメッセージの削除ロジック ---
    // メッセージが溜まって「上で詰まる」のを防ぐため、一定数を超えたら古いものを消します
    const messages = chatFlow.getElementsByClassName('yt-message');
    if (messages.length > 15) { // 同時に表示する上限を15件に設定
        const firstMsg = messages[0];
        // 上へフェードアウトさせるためのクラスを追加（CSSのアニメーションと連動）
        firstMsg.style.opacity = '0';
        firstMsg.style.transform = 'translateY(-20px)';
        firstMsg.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
            if (firstMsg.parentNode === chatFlow) {
                chatFlow.removeChild(firstMsg);
            }
        }, 300);
    }

    // 最新のメッセージが常に下に来るようにスクロールを調整
    const chatWindow = document.getElementById('chat-window');
    setTimeout(() => {
        chatWindow.scrollTo({
            top: chatWindow.scrollHeight,
            behavior: 'smooth'
        });
    }, 50);
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
    recognition.interimResults = true; // 認識の精度とレスポンスを上げるためにtrueに変更

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
        }
    };

    recognition.onerror = (event) => {
        console.error("Recognition error:", event.error);
        if (event.error === 'not-allowed') {
            alert("マイクの使用を許可してください。");
        }
    };

    recognition.onend = () => {
        // 音声認識が切れても自動で再開する
        if (isStarted) {
            setTimeout(() => {
                try {
                    recognition.start();
                } catch (e) {
                    console.error("再開に失敗:", e);
                }
            }, 400);
        }
    };

    try {
        recognition.start();
        postMessage("SYSTEM", "音声エンジン始動。解析を開始します。", "ai");
    } catch (e) {
        console.error(e);
    }
};
