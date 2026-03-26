export function initCrosshair() {
    const crosshair = document.getElementById('crosshair');
    window.addEventListener('mousemove', e => {
        crosshair.style.left = e.clientX + 'px';
        crosshair.style.top = e.clientY + 'px';
    });
    return crosshair; // 返回实例供其他模块调用
}

export function prepareText() {
    document.querySelectorAll('.split-text').forEach(el => {
        const text = el.innerText;
        el.innerHTML = '';
        [...text].forEach(char => {
            const span = document.createElement('span');
            span.innerText = char; 
            span.className = 'char';
            el.appendChild(span);
        });
    });
}
/*DOM 视觉准备与基础监听*/
