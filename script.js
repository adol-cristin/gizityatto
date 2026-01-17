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
        "keywords": ["これでいんじゃない", "これでいいんじゃない", "これでいいか", "これでいっか",  "まこれでいっか", "まあ大丈夫でしょ", "まあいいんですけどね"],
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
        "keywords": ["さあ行こう", "さ始めて行きますか", "始めて行きますか", "さあ行こうか",  "行こうか", "行きますか",  "さてさて"],
        "responses": [
            "よし、気合入れていこうぜ！",
            "準備は万端だね。最高のプレイを期待してるよ！",
            "いよいよだね！派手に暴れてこよう！"
        ]
    },
    "acceptance": {
        "keywords": ["気にしない", "なんとかなる", "いっか", "そんなことはさておき"],
        "responses": [
            "その切り替えの早さ、大事だね！次いこう次！",
            "そうだね、終わったことは気にせず楽しもうぜ！",
            "ポジティブだねぇ！なんとかなるなる！"
        ]
    },
    "trying": {
        "keywords": ["とりあえず", "やってみよう", "これでいっか"],
        "responses": [
            "まずはやってみるのが一番だね！",
            "ナイスチャレンジ！何かが掴めるはずだよ。",
            "その調子！試行錯誤が勝利への近道だ！"
        ]
    },
    "relief": {
        "keywords": ["ふう", "いい感じだ", "大丈夫", "まあね", "決まった",  "ふふふ"],
        "responses": [
            "お疲れ様！いい流れが来てるね。",
            "その調子！今のプレイ、安定感あったよ。",
            "余裕だね、さすが！"
        ]
    },
    "victory": {
        "keywords": ["倒した", "OKOK", "ナイス", "撃破"],
        "responses": [
            "ナイス撃破！",
            "今の連携、完璧だったよ！",
            "強い！完全に圧倒してるね！"
        ]
    },
    "trouble": {
        "keywords": ["どうしたものか", "どうしよ", "どうしようかな", "疲れた", "ふう疲れた", "さて", "どうしようか", "うーん", "あれ", "あれれ", "あらら", "全然わからん", "全くわからん", "えどういうこと", "いかほどか"],
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
// script.js の window.initCompanion 内を以下のように補強してください

window.initCompanion = function() {
    const overlay = document.getElementById('start-overlay');
    if (overlay) overlay.style.display = 'none';

    postMessage("SYSTEM", "音声エンジンを起動中...", "ai");

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("お使いのブラウザは音声認識に対応していません。ChromeまたはSafariの最新版をお試しください。");
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'ja-JP';
    recognition.continuous = true;
    recognition.interimResults = false;

    // GitHub(HTTPS)環境では、一度エラーが出ると止まることがあるため、明示的に開始
    try {
        recognition.start();
        postMessage("SYSTEM", "マイクの待機を開始しました。お話しください。", "ai");
    } catch (e) {
        console.error("マイク起動失敗:", e);
        postMessage("SYSTEM", "マイクの起動に失敗しました。設定を確認してください。", "ai");
    }

    // 途中で止まらないようにリスタート処理を強化
    recognition.onend = () => {
        if (!gameOver) { // ゲーム中の場合は自動で再開
            try { recognition.start(); } catch(e) {}
        }
    };

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

