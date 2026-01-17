// 1. 辞書データ（アップデート版）
const dictionaryData = {
    "climax": {
        "keywords": ["ここで決める", "ここだ", "これで決める", "今だ", "チャンス", "行くぜ"],
        "responses": [
            "いけえええ！その一撃にすべてを込めろ！",
            "最高のタイミング！畳み掛けろ！",
            "勝機が見えたね！一気に勝負を決めちゃおう！",
            "君なら絶対に外さない！叩き込め！"
        ]
    },
    "confirmation": {
        "keywords": ["これでいんじゃない", "これでいいんじゃない", "これでいいか", "これでいっか", "まあ大丈夫でしょ", "まあいいんですけどね"],
        "responses": [
            "バッチリだと思うよ！自信持って行こうぜ！",
            "うん、それがベストな選択だよ。間違いない！",
            "いい感じだね！そのセッティングで無双しちゃおう！"
        ]
    },
    "decision_making": {
        "keywords": ["これでいこう", "これで行こう", "決めた", "これにする", "よしこれだ", "さてと", "よしこれで行こう", "これで行く"],
        "responses": [
            "いい決断だね！その選択が勝利をたぐり寄せるはずだぜ！",
            "OK、信じて突き進もう！俺も全力で応援するよ！",
            "その意気だ！最高の作戦だね！"
        ]
    },
    "starting": {
        "keywords": ["さあ行こう", "さ 始めて行きますか", "始めて行きますか", "さて行こう", "さてさて"],
        "responses": [
            "よし、気合入れていこうぜ！",
            "準備は万端だね。最高のプレイを期待してるよ！",
            "いよいよだね！派手に暴れてこよう！"
        ]
    },
    "acceptance": {
        "keywords": ["まいっか", "まあいっか", "気にしない", "なんとかなる", "いっか", "まあそんなことはさておき"],
        "responses": [
            "その切り替えの早さ、大事だね！次いこう次！",
            "そうだね、終わったことは気にせず楽しもうぜ！",
            "ポジティブだねぇ！なんとかなるなる！"
        ]
    },
    "trying": {
        "keywords": ["まあとりあえずこれでやってみるか", "まあやってみよう"],
        "responses": [
            "まずはやってみるのが一番だね！",
            "ナイスチャレンジ！何かが掴めるはずだよ。",
            "その調子！試行錯誤が勝利への近道だ！"
        ]
    },
    "relief": {
        "keywords": ["ふう", "いい感じだ", "大丈夫", "まあね", "ふふふ"],
        "responses": [
            "お疲れ様！いい流れが来てるね。",
            "その調子！今のプレイ、安定感あったよ。",
            "余裕だね、さすが！"
        ]
    },
    "victory": {
        "keywords": ["倒した", "ナイス", "撃破"],
        "responses": [
            "ナイス撃破！",
            "今の連携、完璧だったよ！",
            "強い！完全に圧倒してるね！"
        ]
    },
    "trouble": {
        "keywords": ["どうしたものか", "どうしよう", "どうしようかな", "疲れた", "ふう疲れた", "さて どうしたものかな", "さて どうしようか", "うーん", "あれ", "あれれ", "あらら", "全然わからん", "全くわからん", "えどういうこと", "いかほどか"],
        "responses": [
            "落ち着いて、まだ挽回できるよ！",
            "一旦状況を整理してみようか。",
            "大丈夫、君なら解決できる。ゆっくりいこう！",
            "うーん、どうくるかな…？慎重に見極めよう。"
        ]
    },
    "panic": {
        "keywords": ["やばい"],
        "responses": [
            "落ち着いて！深呼吸だ！",
            "ピンチはチャンス！まだ諦めるな！",
            "ここを凌げばこっちのターンだ！踏ん張れ！"
        ]
    },
    "research": {
        "keywords": [
            "サーチしてくれ", "ジャービス 敵をロックしてくれ", "ロックオン サーチ", "ロックオン", 
            "敵を観測してくれ", "敵をリサーチしてくれ", "ジャービス 敵をリサーチしてくれ", 
            "ジャービス 敵を観測してくれ", "リサーチ機能", "リサーチ機能 オン", 
            "リサーチ オン", "サーチ", "サーチ機能 オン", "サーチ機能オンにしてくれ", "索敵 してくれ"
        ],
        "responses": [
            "了解。リサーチを開始します。",
            "ターゲット確認。解析データを展開するよ。",
            "スキャン完了。周囲の情報を同期するね。"
        ]
    }
};


const names = ["♛ Empress Luna", "✦ Golden Duke", "✧ Madam Diamond"];

// 2. メッセージ表示
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

    if (chatFlow.children.length > 8) {
        chatFlow.removeChild(chatFlow.firstChild);
    }
}

// 3. 起動処理
window.initCompanion = function() {
    console.log("起動ボタンが押されました");
    const overlay = document.getElementById('start-overlay');
    if (overlay) overlay.style.display = 'none';

    postMessage("SYSTEM", "接続完了。マイクを許可してください。", "ai");

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("ブラウザが音声認識に対応していません。Chromeをお使いください。");
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'ja-JP';
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
        const userText = event.results[event.results.length - 1][0].transcript.trim();
        postMessage("YOU", userText, "user");

        let reply = "";
        for (let category in dictionaryData) {
            if (dictionaryData[category].keywords.some(k => userText.includes(k))) {
                reply = dictionaryData[category].responses[Math.floor(Math.random() * dictionaryData[category].responses.length)];
                break;
            }
        }

        if (reply) {
            setTimeout(() => {
                const name = names[Math.floor(Math.random() * names.length)];
                postMessage(name, reply, "ai");
            }, 500);
        }
    };

    recognition.onend = () => { recognition.start(); };
    
    try {
        recognition.start();
    } catch (e) {
        console.error("マイク起動失敗:", e);
    }
};

