const canvas = document.getElementById('rouletteCanvas');
const ctx = canvas.getContext('2d');
const spinButton = document.getElementById('spinButton');
const resultDiv = document.getElementById('result');

const items = [
    "千代田区", "中央区", "港区", "新宿区", "文京区",
    "台東区", "墨田区", "江東区", "品川区", "目黒区",
    "大田区", "世田谷区", "渋谷区", "中野区", "杉並区",
    "豊島区", "北区", "荒川区", "板橋区", "練馬区",
    "足立区", "葛飾区", "江戸川区"
];

let startAngle = 0;
const arcSize = (2 * Math.PI) / items.length;

const spinSound = new Audio('spin-sound.mp3');
let selectedItemIndex = -1; // 追加: 選択されたアイテムのインデックス

function drawRoulette() {
    const radius = canvas.width / 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "16px Arial";

    for (let i = 0; i < items.length; i++) {
        const angle = startAngle + i * arcSize;
        ctx.beginPath();
        ctx.arc(radius, radius, radius, angle, angle + arcSize);
        ctx.lineTo(radius, radius);
        ctx.fillStyle = '#e0e0e0'; // 背景色と同じ色を使用して色を消す
        ctx.fill();
        ctx.save();

        // Draw neumorphism effect for each item
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'; // 濃い影
        ctx.shadowBlur = 15; // Increased shadow blur for effect
        ctx.shadowOffsetX = 5;
        ctx.shadowOffsetY = 5;
        ctx.fill();

        ctx.translate(radius + Math.cos(angle + arcSize / 2) * radius * 0.7, radius + Math.sin(angle + arcSize / 2) * radius * 0.7);
        ctx.rotate(angle + arcSize / 2 + Math.PI / 2);

        // 色を変更するロジック
        if (i === selectedItemIndex) {
            ctx.fillStyle = 'red'; // 選択されたアイテムに色を付ける
        } else {
            ctx.fillStyle = '#000'; // テキストの色を黒に変更
        }

        const text = items[i];
        for (let j = 0; j < text.length; j++) {
            ctx.fillText(text[j], -ctx.measureText(text[j]).width / 2, j * 20);
        }
        ctx.restore();
    }
}

function getSelectedItem() {
    const endAngle = (startAngle + (Math.PI / 2)) % (2 * Math.PI);
    const index = Math.floor((items.length - endAngle / arcSize) % items.length);
    return index;
}

function rotateRoulette() {
    const duration = 3000; // 3 seconds
    const start = performance.now();
    const rotations = Math.random() * 5 + 5; // Random number of rotations between 5 and 10

    function animate(time) {
        const elapsed = time - start;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 0.5 - Math.cos(progress * Math.PI) / 2;
        startAngle = ease * rotations * 2 * Math.PI;

        drawRoulette();

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            selectedItemIndex = getSelectedItem(); // 選択されたアイテムのインデックスを保存
            const selectedItem = items[selectedItemIndex];
            resultDiv.textContent = `${selectedItem}に行こう！！！`;
            spinSound.pause();
            spinSound.currentTime = 0;
            drawRoulette(); // 選択されたアイテムに色を付けるために再描画
        }
    }

    spinSound.play();
    requestAnimationFrame(animate);
}

drawRoulette();

spinButton.addEventListener('click', () => {
    resultDiv.textContent = '次の散歩は...'; // ボタンが押されたときに結果をクリアするためのプレースホルダー
    selectedItemIndex = -1; // リセット
    rotateRoulette();
});
