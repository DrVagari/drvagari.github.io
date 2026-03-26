import { initCrosshair, prepareText } from './ui.js';
import { switchPage, setCrosshairReference } from './transition.js';

// 等待 DOM 树加载完毕后执行初始化
document.addEventListener('DOMContentLoaded', () => {
    // 1. 初始化文字和准星
    prepareText();
    const crosshair = initCrosshair();
    
    // 2. 将准星实例传递给转场模块，以便同步改变边框颜色
    setCrosshairReference(crosshair);

    // 3. 挂载全局点击事件触发页面转场
    document.body.addEventListener('mousedown', switchPage);
});
