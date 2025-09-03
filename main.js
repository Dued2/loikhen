document.addEventListener("DOMContentLoaded", () => {
  const goback = document.getElementById("goback");
  const quizScreen = document.getElementById('quiz-screen');
  const clawGame = document.getElementById('claw-game');
  const comfortScreen = document.getElementById('comfort-screen');
  const comfortText = document.getElementById('comfort-text');
  const nextComfortBtn = document.getElementById('next-comfort-btn');
  const grabBtn = document.getElementById('grab-btn');
  const plushContainer = document.getElementById('plush-container');
  const body = document.body;
});

// Các thú bông (icon emoji) và vị trí lộn xộn
const plushies = [
"🐻", "🐰", "🐱", "🐭", "🐼", "🦊", "🐨", "🐯", "🐵", "🐶",
"🐸", "🐹", "🐢", "🐴", "🐧", "🦄", "🐔", "🐴", "🐮", "🐤"
];

// Vị trí ngẫu nhiên trong khu vực thú bông
function randomPosition() {
// Để thú bông không ra ngoài container
const containerRect = plushContainer.getBoundingClientRect();
const width = containerRect.width;
const height = containerRect.height;
// Tạo tọa độ (từ 10px đến width-60px, height-60px) để tránh thú bị cắt
const x = Math.random() * (width - 60) + 10;
const y = Math.random() * (height - 60) + 10;
return { x, y };
}

// Tạo thú bông trên màn hình gắp
function createPlushies() {
plushContainer.innerHTML = '';
plushies.forEach((emoji, i) => {
    const plush = document.createElement('div');
    plush.classList.add('plush');
    plush.textContent = emoji;
    const pos = randomPosition();
    plush.style.left = pos.x + 'px';
    plush.style.top = pos.y + 'px';
    plush.dataset.index = i;
    plushContainer.appendChild(plush);
});
}

// Biến lưu lựa chọn chủ đề
let selectedChoice = null;
let selectedPlushIndex = null;

// Bắt sự kiện chọn đáp án quiz
document.querySelectorAll('.option-btn').forEach(btn => {
btn.addEventListener('click', () => {
    selectedChoice = btn.dataset.choice;
    // Chuyển sang màn hình gắp thú
    quizScreen.style.left = "-100%";
    quizScreen.style.overflow = "hidden";
    clawGame.style.display = 'flex';
    clawGame.style.left = "0%";
    body.style.background = "#ffe6f2";
    
    createPlushies();
    grabBtn.disabled = true;
    selectedPlushIndex = null;
});
});

// Di chuyển cần cẩu bằng phím trái phải hoặc touch (bấm thú bông sẽ chọn)
const claw = document.createElement('div');
claw.id = 'claw';
plushContainer.appendChild(claw);

const hook = document.createElement('div');
hook.id = 'hook';
plushContainer.appendChild(hook);

let clawPos = plushContainer.clientWidth / 2; // vị trí left của cần cẩu
let isGrabbing = false;

// Cập nhật vị trí cần cẩu
function updateClawPosition(x) {
// Giới hạn trong container
const minX = 10;
const maxX = plushContainer.clientWidth - 80;
if(x < minX) x = minX;
if(x > maxX) x = maxX;
clawPos = x;
claw.style.left = clawPos + 'px';
hook.style.left = (clawPos + 36) + 'px'; // hook nhỏ hơn và ở giữa claw
}

// Khởi tạo vị trí
updateClawPosition(clawPos);

// Chọn thú bông theo vị trí cần cẩu
function findClosestPlush() {
let closestIndex = null;
let closestDist = 1e9;
const clawsCenterX = clawPos + 40; // chính giữa claw
plushContainer.querySelectorAll('.plush').forEach((plush, i) => {
    const plushX = parseFloat(plush.style.left) + 25; // giữa plush (50px font-size)
    const plushY = parseFloat(plush.style.top) + 25;
    const dist = Math.abs(plushX - clawsCenterX);
    if(dist < closestDist && dist < 50) { // chọn nếu gần cần cẩu < 50px
    closestDist = dist;
    closestIndex = i;
    }
});
return closestIndex;
}

// Khi người chơi click lên plush sẽ chọn luôn
plushContainer.addEventListener('click', e => {
if(!e.target.classList.contains('plush')) return;
// Lấy vị trí plush được click
const index = parseInt(e.target.dataset.index);
selectedPlushIndex = index;
highlightSelectedPlush();
grabBtn.disabled = false;
// Đưa cần cẩu về vị trí plush
const plushX = parseFloat(e.target.style.left);
updateClawPosition(plushX);
});

// Bôi đậm plush được chọn
function highlightSelectedPlush() {
plushContainer.querySelectorAll('.plush').forEach((plush, i) => {
    if(i === selectedPlushIndex) {
    plush.style.textShadow = '0 0 15px #ff72bc, 0 0 10px #ff72bc';
    plush.style.transform = 'scale(1.4)';
    } else {
    plush.style.textShadow = 'none';
    plush.style.transform = 'scale(1)';
    }
});
}

// Di chuyển cần cẩu bằng phím mũi tên trái phải
window.addEventListener('keydown', e => {
if(clawGame.style.display === 'none') return;
if(e.key === 'ArrowLeft') {
    updateClawPosition(clawPos - 20);
    checkGrabEnable();
} else if(e.key === 'ArrowRight') {
    updateClawPosition(clawPos + 20);
    checkGrabEnable();
}
});

// Kiểm tra bật nút gắp nếu có plush gần cần cẩu
function checkGrabEnable() {
const closest = findClosestPlush();
if(closest !== null) {
    selectedPlushIndex = closest;
    highlightSelectedPlush();
    grabBtn.disabled = false;
} else {
    selectedPlushIndex = null;
    highlightSelectedPlush();
    grabBtn.disabled = true;
}
}

// Khởi động kiểm tra nút gắp
checkGrabEnable();

// Bấm nút gắp thú
grabBtn.addEventListener('click', () => {
if(selectedPlushIndex === null) return;
// Ẩn màn hình gắp thú
clawGame.style.left = "-100%"
selectedPlushIndex === null;
grabBtn.disabled = true;
// Hiện màn hình an ủi
comfortScreen.style.left = "0%";
nextComfortBtn.style.display = "none";
body.style.background = "#ffccdf";
setTimeout(() => {
    currentComfortIndex = 0;
    showComfortMessage();
}, 2000);

});

// Dữ liệu các câu an ủi theo chủ đề
const comfortMessages = {
A: [
    "Mọi chuyện đều có cách giải quyết nếu bạn chịu ngồi xuống tâm sự những thứ mình nghĩ ra - Mình tin bạn làm được.",
    "Gia đình luôn là bến đỗ vững chắc, đừng ngại sẻ chia nhé.",
    "Có lúc khó khăn trong gia đình là chuyện bình thường, bạn không cô đơn đâu.",
    "Dù chuyện gì xảy ra, bạn luôn có những người thân yêu bên cạnh.",
    "Chia sẻ giúp bạn nhẹ lòng hơn, hãy dành thời gian trò chuyện cùng gia đình.",
    "Gia đình là nơi bình yên nhất, hãy giữ vững niềm tin.",
    "Thử lắng nghe và nói ra những cảm xúc của bạn, mọi thứ sẽ tốt hơn.",
    "Bạn rất mạnh mẽ khi dám đối mặt với chuyện gia đình khó khăn.",
    "Đừng ngần ngại nhờ sự giúp đỡ từ người thân khi cần.",
    "Yêu thương và thấu hiểu sẽ giúp hàn gắn mọi rạn nứt.",
    "Mọi khó khăn rồi cũng sẽ qua, chỉ cần bạn kiên nhẫn.",
    "Gia đình là tình yêu lớn nhất mà bạn có, hãy giữ gìn nó nhé.",
    "Bạn không phải gánh hết mọi chuyện một mình đâu.",
    "Tâm sự là cách giải tỏa tuyệt vời cho những nỗi buồn trong gia đình.",
    "Hãy dành thời gian cho nhau, mọi thứ sẽ trở nên tốt đẹp hơn.",
    "Bạn có thể tạo nên sự khác biệt bằng tình cảm chân thành.",
    "Gia đình luôn muốn bạn hạnh phúc, hãy để họ biết điều đó.",
    "Tình yêu gia đình giúp bạn luôn có động lực để vượt qua.",
    "Có những lúc thử thách là cơ hội để gắn kết hơn.",
    "Mỗi ngày là một cơ hội để làm mới và yêu thương hơn."
],
B: [
    "Không có con đường thành công nào trải đầy hoa hồng nhưng cũng không có thử thách nào trải đầy gai.",
    "Học tập là hành trình dài để tích lũy kiến thức, đừng nản lòng và từ bỏ quá sớm khi bạn chưa đủ cứng cáp.",
    "Mỗi thất bại là một bài học quý giá cho sự trưởng thành và thành công trong tương lai.",
    "Bạn có thể làm được mọi thứ nếu bạn quyết theo đuổi nó đến cùng.",
    "Đừng sợ sai, hãy sợ không có lỗi sai cho sự hoàn hảo.",
    "Thời gian học tập không bao giờ là thừa thải, bởi vì học mới khẳng định được chính mình.",
    "Bạn là người có quyền quyết định mình là ai trong tương lai.,"
    "Hãy nhớ rằng bạn không cô đơn trên hành trình ấy đâu, vì xung quanh bạn luôn có những người sẵn sàng đợi chờ ngày bạn thành công !",
    "Giữ vững niềm tin và nỗ lực, thành công sẽ đến với những trái tim kiên cường.",
    "Mỗi ngày học một chút sẽ tạo nên điều lớn lao trong đời bạn.",
    "Bạn đang xây dựng tương lai, đừng để chùn bước khi chưa bắt đầu.",
    "Đừng so sánh mình với người khác, chỉ cần vượt qua bản thân của ngày hôm qua một chút thôi.",
    "Hãy tin vào chính mình, vì bạn sở hữu những tài năng và khả năng đặc biệt mà không ai có được.
​"Học không phải là gánh nặng, mà là một hành trình thú vị. Hãy khám phá và yêu thích nó!",
​"Mỗi thử thách trong học tập đều là cơ hội vàng để bạn bứt phá và trở nên mạnh mẽ hơn.",
​"Đừng ngại ngần khi gặp khó khăn. Hãy lên tiếng, vì xung quanh bạn luôn có những người sẵn lòng giúp đỡ.",
​"Những kiến thức bạn tích lũy hôm nay chính là sức mạnh để bạn chinh phục tương lai.",
​"Hãy giữ ngọn lửa nhiệt huyết trong tim, để mỗi bài học đều trở nên ý nghĩa và đáng nhớ.",
"​Tiềm năng của bạn là vô hạn. Hãy tiến về phía trước và đừng để bất cứ điều gì cản bước.",
"Thành công không tự nhiên mà có, nó là món quà xứng đáng cho những ai kiên trì và nỗ lực hết mình."
],
C: [
    "Tình cảm có thể có những thăng trầm, nhưng hãy trân trọng từng khoảnh khắc vì nó giúp bạn trưởng thành hơn.",
"Mỗi trái tim đều cần thời gian để chữa lành. Hãy cho phép mình được buồn, được yếu đuối, nhưng đừng quên đứng lên và mạnh mẽ hơn.",
"Hãy nhớ rằng bạn xứng đáng được yêu thương và trân trọng một cách trọn vẹn nhất.",
"Trước khi yêu thương người khác, hãy học cách chăm sóc và nâng niu bản thân mình trước.",
"Mỗi câu chuyện tình cảm, dù kết thúc thế nào, đều là một bài học vô giá trên hành trình tìm kiếm hạnh phúc.",
"Hãy kiên nhẫn, vì thời gian sẽ cho bạn thấy mọi thứ rõ ràng hơn và giúp bạn bình tâm trở lại.",
"Bạn mạnh mẽ hơn những gì bạn nghĩ rất nhiều, và bạn hoàn toàn có thể vượt qua mọi tổn thương."
],
D: [
    "Tình bạn là món quà quý giá. Hãy trân trọng và giữ gìn những mối quan hệ mang lại niềm vui và sự tích cực.",
"Hãy chấp nhận rằng có những người sẽ chỉ đồng hành cùng bạn một chặng đường. Điều đó hoàn toàn bình thường và không có gì sai cả.",
"Bạn là một người bạn tuyệt vời và bạn xứng đáng có những người bạn luôn ủng hộ, tin tưởng và trân trọng bạn.",
"Đôi khi, khoảng cách lại giúp bạn nhận ra ai là người thực sự quan trọng và xứng đáng được ở lại.",
"Hãy nói ra cảm xúc thật của mình, vì bạn không hề đơn độc. Luôn có những người sẵn lòng lắng nghe bạn.",
"Tình bạn tuyệt vời nhất là khi bạn được sống thật với chính mình, không cần phải thay đổi vì bất kỳ ai.",
"Mỗi khó khăn trong tình bạn đều là cơ hội để bạn học cách thấu hiểu, trưởng thành và xây dựng những mối quan hệ bền chặt hơn."
],
E: [
    "Sức khỏe là tài sản quý giá nhất, hãy chăm sóc bản thân nhé!",
    "Đừng quên nghỉ ngơi và giữ tinh thần thoải mái.",
    "Bạn đang làm rất tốt việc chăm sóc bản thân đấy.",
    "Mỗi ngày là cơ hội để khỏe mạnh hơn.",
    "Bạn có quyền ưu tiên cho sức khỏe của mình.",
    "Đừng ngần ngại tìm kiếm sự giúp đỡ khi cần.",
    "Sức khỏe tốt giúp bạn vượt qua mọi thử thách.",
    "Hãy uống đủ nước và ăn uống cân đối nhé!",
    "Thể dục nhẹ nhàng sẽ giúp bạn khỏe khoắn hơn.",
    "Bạn rất mạnh mẽ khi biết chăm sóc bản thân.",
    "Giấc ngủ đủ giấc là liều thuốc tốt nhất cho bạn.",
    "Mỗi bước nhỏ trong chăm sóc sức khỏe đều quý giá.",
    "Bạn đang làm rất tốt, hãy tiếp tục phát huy.",
    "Đừng quên dành thời gian cho bản thân mỗi ngày.",
    "Tinh thần khỏe mạnh sẽ giúp thể chất tốt lên.",
    "Bạn xứng đáng được khỏe mạnh và hạnh phúc.",
    "Mọi khó khăn về sức khỏe đều có thể vượt qua.",
    "Bạn đang đi đúng hướng cho một cơ thể khỏe mạnh.",
    "Đừng quên cười nhiều hơn để giải tỏa căng thẳng.",
    "Chăm sóc sức khỏe là cách yêu thương chính mình."
],
F: [
    "Công việc là thử thách giúp bạn phát triển bản thân.",
    "Đừng để áp lực công việc làm bạn quên mất niềm vui.",
    "Bạn đang làm rất tốt, đừng tự nghi ngờ bản thân nhé.",
    "Mỗi ngày là một cơ hội để tiến bộ hơn trong công việc.",
    "Hãy giữ vững tinh thần và niềm đam mê của bạn.",
    "Bạn có khả năng vượt qua mọi khó khăn.",
    "Đôi khi nghỉ ngơi là điều cần thiết để làm việc tốt hơn.",
    "Bạn là người rất chăm chỉ và kiên trì.",
    "Cố gắng của bạn sẽ được đền đáp xứng đáng.",
    "Đừng ngại hỏi ý kiến đồng nghiệp hoặc cấp trên khi cần.",
    "Bạn đang xây dựng nền tảng vững chắc cho sự nghiệp.",
    "Mỗi bước đi đều giúp bạn tiến gần hơn mục tiêu.",
    "Giữ cân bằng giữa công việc và cuộc sống để luôn vui khỏe.",
    "Bạn xứng đáng được công nhận và trân trọng.",
    "Mỗi thử thách là cơ hội để bạn trưởng thành hơn.",
    "Bạn rất tài năng và có tiềm năng phát triển lớn.",
    "Hãy tin vào bản thân và khả năng của mình.",
    "Bạn có thể làm được những điều tuyệt vời.",
    "Đừng quên dành thời gian cho gia đình và bản thân.",
    "Bạn là người có giá trị lớn trong môi trường làm việc."
],
G: [
    "Tương lai của bạn là một trang trắng, bạn có thể viết nên câu chuyện của riêng mình.",
    "Đừng lo lắng quá nhiều về những điều chưa đến.",
    "Bạn có tất cả khả năng để tạo dựng tương lai tươi sáng.",
    "Mỗi bước bạn đi hôm nay là nền tảng cho ngày mai.",
    "Hãy tin tưởng vào chính mình và đừng bỏ cuộc.",
    "Tương lai là phần thưởng cho sự kiên trì và cố gắng.",
    "Bạn có thể thay đổi thế giới theo cách của riêng mình.",
    "Không có gì là không thể nếu bạn thực sự muốn.",
    "Bạn đang trên con đường đúng đắn để thành công.",
    "Mọi khó khăn hiện tại đều là bài học quý báu.",
    "Bạn xứng đáng có một tương lai rực rỡ.",
    "Hãy mơ lớn và hành động quyết liệt.",
    "Tương lai là nơi những ước mơ được biến thành hiện thực.",
    "Bạn có sức mạnh tạo nên sự khác biệt.",
    "Mỗi ngày hãy làm một điều tốt cho tương lai của bạn.",
    "Bạn có thể vượt qua mọi thử thách trên hành trình phía trước.",
    "Tương lai được xây dựng từ những lựa chọn hôm nay.",
    "Bạn rất thông minh và đầy sáng tạo.",
    "Hãy giữ vững tinh thần lạc quan và yêu đời.",
    "Tương lai là của bạn, hãy nắm lấy nó."
],
H: [
    "Buồn một chút cũng không sao, mọi cảm xúc đều quan trọng.",
    "Bạn không cần phải mạnh mẽ mọi lúc, hãy cho phép bản thân yếu đuối.",
    "Cảm xúc của bạn là điều quý giá và đáng trân trọng.",
    "Hãy dành thời gian cho bản thân và để tâm hồn nghỉ ngơi.",
    "Bạn không đơn độc, có rất nhiều người hiểu và đồng cảm với bạn.",
    "Mỗi ngày là một cơ hội để làm mới chính mình.",
    "Hãy cho phép bản thân được nghỉ ngơi và hồi phục.",
    "Cảm xúc của bạn sẽ thay đổi, và ngày mai sẽ tốt hơn.",
    "Bạn rất can đảm khi đối mặt với cảm xúc của mình.",
    "Đừng ngại nói ra những điều bạn đang nghĩ.",
    "Mọi chuyện rồi sẽ ổn, chỉ cần bạn kiên nhẫn chờ đợi.",
    "Hãy tìm niềm vui nhỏ mỗi ngày để chữa lành tâm hồn.",
    "Bạn xứng đáng được hạnh phúc và an yên.",
    "Thời gian sẽ giúp bạn nhẹ lòng hơn.",
    "Đừng quên chăm sóc và yêu thương bản thân nhiều hơn.",
    "Mỗi giây phút buồn cũng là một phần của cuộc sống.",
    "Bạn là người mạnh mẽ hơn bạn nghĩ.",
    "Hãy tin vào những điều tốt đẹp đang chờ đợi phía trước.",
    "Bạn có thể vượt qua mọi thử thách bằng lòng dũng cảm.",
    "Tự chăm sóc bản thân là cách yêu thương tốt nhất."
]
};

let currentComfortIndex = 0;
let currentComfortArray = [];

function showComfortMessage() {
// Lấy mảng an ủi theo lựa chọn
comfortText.style.animation = ""

currentComfortArray = comfortMessages[selectedChoice] || comfortMessages.H;
// Lấy câu ngẫu nhiên
currentComfortIndex = Math.floor(Math.random() * currentComfortArray.length);
comfortText.textContent = currentComfortArray[currentComfortIndex];
comfortText.style.display = "flex"
comfortText.style.animation = "anim 1s ease-in"
setTimeout(() => {
    goback.style.display = "flex"
    
    nextComfortBtn.style.display = "flex"
}, 1000);
}

// Bấm nút lời khuyên khác

goback.addEventListener('click', () => {
goback.style.display = "none"
nextComfortBtn.style.display = "none"
comfortText.style.display = "none"
quizScreen.style.left = "0%";
quizScreen.style.overflow = "hidden";
clawGame.style.display = 'flex';

clawGame.style.left = "100%";
comfortScreen.style.left = "100%";
body.style.background = "#ffd7ec";
setTimeout(() => {
    goback.style.display = "flex"
    quizScreen.style.overflowY = "auto";
    nextComfortBtn.style.display = "flex"
}, 1000);
});

nextComfortBtn.addEventListener('click', () => {
nextComfortBtn.style.display = "none"
comfortText.style.display = "none"
showComfortMessage();
});
