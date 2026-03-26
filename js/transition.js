import { playShotSound } from './audio.js';

const pages = document.querySelectorAll('.page');
const shutterBox = document.getElementById('shutter-container');

// 内部状态维护
let current = 0; 
let isBusy = false;
let crosshairRef = null;

// 接收来自外部的准星 DOM 引用
export function setCrosshairReference(crosshairElement) {
    crosshairRef = crosshairElement;
}

function updateDOM(idx) {
    pages.forEach(p => p.classList.remove('active'));
    pages[idx].classList.add('active');
    current = idx;
    if (crosshairRef) {
        crosshairRef.style.borderColor = pages[idx].dataset.color;
    }
}

export async function switchPage(e) {
    if(isBusy) return;
    playShotSound();
    
    // 弹孔效果
    const hole = document.createElement('div');
    hole.className = 'bullet-hole'; 
    hole.style.left = e.clientX+'px'; 
    hole.style.top = e.clientY+'px';
    document.body.appendChild(hole); 
    setTimeout(()=>hole.remove(), 2000);

    isBusy = true;
    const currentPage = pages[current];
    const nextPageIdx = (current + 1) % pages.length;
    const nextPage = pages[nextPageIdx];
    const nextColor = nextPage.dataset.color;

    const clonedPage = currentPage.cloneNode(true);
    clonedPage.style.display = 'flex'; 

    const cloneContainer = document.createElement('div');
    cloneContainer.id = 'slice-container';
    cloneContainer.style.position = 'fixed';
    cloneContainer.style.inset = '0';
    cloneContainer.style.zIndex = '6000';
    cloneContainer.style.pointerEvents = 'none';

    // 5种物理切割策略 (原封不动)
    const strategies = [
        [ { clip: 'polygon(0 0, 100% 0, 0 100%)', move: 'translate(-25vw, -25vh) rotate(-3deg)' }, { clip: 'polygon(100% 0, 100% 100%, 0 100%)', move: 'translate(25vw, 25vh) rotate(3deg)' } ],
        [ { clip: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)', move: 'translate(0, -45vh)' }, { clip: 'polygon(0 50%, 100% 50%, 100% 100%, 0 100%)', move: 'translate(0, 45vh)' } ],
        [ { clip: 'polygon(0 0, 50% 50%, 0 100%)', move: 'translate(-35vw, 0)' }, { clip: 'polygon(0 0, 100% 0, 50% 50%)', move: 'translate(0, -35vh)' }, { clip: 'polygon(100% 0, 100% 100%, 50% 50%)', move: 'translate(35vw, 0)' }, { clip: 'polygon(0 100%, 50% 50%, 100% 100%)', move: 'translate(0, 35vh)' } ],
        [ { clip: 'polygon(0 0, 33.3% 0, 33.3% 100%, 0 100%)', move: 'translate(0, -60vh)' }, { clip: 'polygon(33.3% 0, 66.6% 0, 66.6% 100%, 33.3% 100%)', move: 'translate(0, 60vh)' }, { clip: 'polygon(66.6% 0, 100% 0, 100% 100%, 66.6% 100%)', move: 'translate(0, -60vh)' } ],
        [ { clip: 'polygon(0 0, 50% 50%, 100% 0)', move: 'translate(0, -45vh)' }, { clip: 'polygon(0 0, 50% 50%, 100% 0, 100% 100%, 0 100%)', move: 'translate(0, 35vh)' } ]
    ];

    const strat = strategies[current % strategies.length];

    strat.forEach(s => {
        const slice = document.createElement('div');
        slice.style.position = 'absolute';
        slice.style.inset = '0';
        slice.style.clipPath = s.clip;
        slice.style.transition = 'transform 1.2s cubic-bezier(0.85, 0, 0.15, 1), opacity 1s cubic-bezier(0.85, 0, 0.15, 1) 0.2s';
        
        const content = clonedPage.cloneNode(true);
        slice.appendChild(content);
        cloneContainer.appendChild(slice);
    });

    document.body.appendChild(cloneContainer);

    shutterBox.innerHTML = '';
    shutterBox.style.opacity = '1';

    const baseBg = document.createElement('div');
    baseBg.style.position = 'absolute';
    baseBg.style.inset = '0';
    baseBg.style.background = 'var(--bg)';
    shutterBox.appendChild(baseBg);

    const colorBg = document.createElement('div');
    colorBg.className = 'shutter-part'; 
    colorBg.style.background = nextColor;
    colorBg.style.clipPath = `circle(0% at ${e.clientX}px ${e.clientY}px)`;
    shutterBox.appendChild(colorBg);

    updateDOM(nextPageIdx); 

    await new Promise(r => requestAnimationFrame(r));
    await new Promise(r => requestAnimationFrame(r));

    colorBg.style.transition = 'clip-path 1.2s cubic-bezier(0.85, 0, 0.15, 1)';
    colorBg.style.clipPath = `circle(150% at ${e.clientX}px ${e.clientY}px)`;

    Array.from(cloneContainer.children).forEach((slice, idx) => {
        slice.style.transform = strat[idx].move;
        slice.style.opacity = '0'; 
    });

    await new Promise(r => setTimeout(r, 1200));

    shutterBox.style.transition = 'opacity 0.6s ease';
    shutterBox.style.opacity = '0';

    await new Promise(r => setTimeout(r, 600));

    cloneContainer.remove();
    shutterBox.innerHTML = '';
    shutterBox.style.transition = 'none'; 
    shutterBox.style.opacity = '1';       
    isBusy = false;
}
/*切割与转场算法*/
