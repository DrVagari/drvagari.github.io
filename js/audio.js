// 初始化音频上下文
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

export function playShotSound() {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.connect(gain); 
    gain.connect(audioCtx.destination);
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(150, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(10, audioCtx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
    
    osc.start(); 
    osc.stop(audioCtx.currentTime + 0.1);
}
/*独立封装音频上下文*/
