document.addEventListener("DOMContentLoaded", () => {
    const goback = document.getElementById("goback");
    const quizScreen = document.getElementById('quiz-screen');
    const clawGame = document.getElementById('claw-game');
    const comfortScreen = document.getElementById('comfort-screen');
    const comfortText = document.getElementById('comfort-text');
    const nextComfortBtn = document.getElementById('next-comfort-btn');
    const grabBtn = document.getElementById('grab-btn');
    const plushContainer = document.getElementById('plush-container');
    const cplush = document.getElementById('cplush');
    const body = document.body;
    const claw = document.getElementById('claw');
    const cont = document.getElementById('cont');
    const hook = document.getElementById('hook');
    const shade = document.getElementById('shade');


    let plushies, comfortMessages;

    fetch("data.json")
        .then(res => res.json())
        .then(data => {
            plushies = data.plushIcons
            comfortMessages = data.comfortMessages
        })


    let clawPos = plushContainer.clientWidth / 2; 
    let clawPos2 = plushContainer.clientHeight / 2;

    function randomPosition() {
        const containerRect = plushContainer.getBoundingClientRect();
        const width = containerRect.width;
        const height = containerRect.height;
        const x = Math.random() * (width-70);
        const y = Math.random() * (height-70);
        return { x, y };
    }

    function createPlushies() {
        const plushContainer = document.getElementById("plush-container");
        plushContainer.querySelectorAll(".plush").forEach(div => div.remove());
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
        checkGrabEnable();
    }

    let selectedChoice = null;
    let selectedPlushIndex = null;

    function resetclaw(){
        shade.style.opacity = 1;
        claw.style.top = 80 + 'px';
        hook.style.top = -700 + 'px';
        document.querySelectorAll('#button-system button').forEach(btn => btn.disabled = false);     
        updateClawPosition(0,13.5*20);
    }

    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            selectedChoice = btn.dataset.choice;
            quizScreen.style.left = "-100%";
            quizScreen.style.overflow = "hidden";
            clawGame.style.display = 'flex';
            clawGame.style.left = "0%";
            body.style.background = "#ffe6f2";
            resetclaw()
            createPlushies();
            
            
            grabBtn.disabled = true;
            selectedPlushIndex = null;
        });
    });

    
    function updateClawPosition(x, y) {
        const containerRect = plushContainer.getBoundingClientRect();
        const minX = 0;
        const maxX = containerRect.width - claw.offsetWidth;
        const minY = 0 - 20;
        const maxY = containerRect.height - claw.offsetHeight;
        if (x < minX) x = minX;
        if (x > maxX) x = maxX;                                 
        if (y < minY) y = minY;
        if (y > maxY) y = maxY;
        clawPos = x;
        clawPos2 = y;
        if (claw) claw.style.left = (clawPos + 1080) + 'px';
        if (hook) hook.style.left = (clawPos+ 1080) + 'px';
        if (shade) {
            shade.style.left = (clawPos+ 1080 - 55) + 'px';
            shade.style.top = (clawPos2 + 13.5*20) + 'px';
        }
    }

    function findClosestPlush() {
    let closestIndex = null;
    let closestDist = 1e9;
    const clawsCenterX = clawPos + 40; 
    const clawsCenterY = clawPos2 + 50;
    plushContainer.querySelectorAll('.plush').forEach((plush, i) => {
        const plushX = parseFloat(plush.style.left) + 25;
        const plushY = parseFloat(plush.style.top) + 25;
        const dist = Math.sqrt(
            Math.pow(plushX - clawsCenterX, 2) +
            Math.pow(plushY - clawsCenterY, 2)
        );
        if (dist < closestDist && dist < 50) { 
            closestDist = dist;
            closestIndex = i;
        }
    });
    return closestIndex;
}

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

    function moveClaw(dir){
        let deltaX = 0, deltaY = 0;
        if (dir === '2') deltaX = -20;
        if (dir === '1') deltaX = 20;
        if (dir === '0') deltaY = -20;
        if (dir === '-1') deltaY = 20;
        updateClawPosition(clawPos + deltaX, clawPos2 + deltaY);
        checkGrabEnable();
    }

    document.getElementById('left').addEventListener('mousedown', () => moveClaw('2'));
    document.getElementById('right').addEventListener('click', () => moveClaw('1'));
    document.getElementById('up').addEventListener('click', () => moveClaw('0'));
    document.getElementById('down').addEventListener('click', () => moveClaw('-1'));

    grabBtn.addEventListener('click', () => {
        if(selectedPlushIndex === null) return;
        // 
        
        hook.style.top = clawPos2 + (-700+125) + 'px';
        claw.style.top = clawPos2 + 150 + 'px';
        document.querySelectorAll('#button-system button').forEach(btn => btn.disabled = true);        
        grabBtn.disabled = true;
        cont.style.marginTop = "800px"  
        //comfortScreen.style.left = "0%";
        //nextComfortBtn.style.display = "none";
        //body.style.background = "#ffccdf";
        setTimeout(() => {
            hook.style.top = -900 +'px'
            claw.style.top = -200 +'px'
            plushContainer.querySelectorAll('.plush')[selectedPlushIndex].style.top = -300 +'px';
            shade.style.opacity = 0
            //
        }, 1000);
        
        setTimeout(() => {
            clawGame.style.left = "-100%"
            comfortScreen.style.left = "0%";
            
            nextComfortBtn.style.display = "none";
            body.style.background = "#ffccdf";
            cplush.textContent = plushies[selectedPlushIndex];
            
                   
        }, 2000);

        setTimeout(() => {
            cont.style.marginTop = "-550px"  
            currentComfortIndex = 0;
            showComfortMessage();
        }, 4000);

        
        selectedPlushIndex === null;
    });

    function checkGrabEnable() {
        const closest = findClosestPlush();
        selectedPlushIndex = closest;
        highlightSelectedPlush();
        if (closest !== null) {
            const plush = plushContainer.querySelectorAll('.plush')[closest];
            const clawsCenterX = clawPos + 40;
            const clawsCenterY = clawPos2 + 50;
            const plushX = parseFloat(plush.style.left) + 25;
            const plushY = parseFloat(plush.style.top) + 25;
            const dist = Math.sqrt(
                Math.pow(plushX - clawsCenterX, 2) +
                Math.pow(plushY - clawsCenterY, 2)
            );
            grabBtn.disabled = dist > 50;
        } else {
            grabBtn.disabled = true;
        }
    }
    checkGrabEnable();

    

    let currentComfortIndex = 0;
    let currentComfortArray = [];

    function showComfortMessage() {
        comfortText.style.display = "none"
        currentComfortArray = comfortMessages[selectedChoice] || comfortMessages.A;
        currentComfortIndex = Math.floor(Math.random() * currentComfortArray.length);
        comfortText.innerHTML = currentComfortArray[currentComfortIndex];
        comfortText.style.animation = ""
        goback.style.animation = "change 1s ease-in-out"
        
        comfortText.style.animation = "anim 1s ease-in-out"
        setTimeout(() => {
            goback.style.display = "flex"
            comfortText.style.display = "flex"
            nextComfortBtn.style.display = "flex"
        }, 1000);
    }

    goback.addEventListener('click', () => {
        goback.style.display = "none"
        nextComfortBtn.style.display = "none"
        comfortText.style.display = "none"
        comfortText.style.animation = ""
        comfortText.style.animation = "anim 1s ease-in-out"
        quizScreen.style.left = "0%";
        quizScreen.style.overflow = "hidden";
        clawGame.style.display = 'flex';

        clawGame.style.left = "100%";
        comfortScreen.style.left = "100%";
        body.style.background = "#ffd7ec";
        setTimeout(() => {
            quizScreen.style.overflowY = "auto";
            nextComfortBtn.style.display = "flex"
        }, 1000);
    });

    nextComfortBtn.addEventListener('click', () => {
        nextComfortBtn.style.display = "none"
        comfortText.style.display = "none"
        showComfortMessage();
    });
});