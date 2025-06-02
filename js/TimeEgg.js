function createEggRouletteRing(container, values, radius, label, activeIndex) {
    const ring = document.createElement('div');
    ring.className = 'egg-roulette-ring';
    ring.style.width = ring.style.height = (radius * 2) + 'px';
    ring.style.left = '50%';
    ring.style.top = '50%';
    ring.style.transform = 'translate(-50%, -50%)';
    ring.style.position = 'absolute';
    ring.style.pointerEvents = 'none';

    values.forEach((val, i) => {
        const angle = (360 / values.length) * i;
        const item = document.createElement('div');
        item.className = 'egg-roulette-item' + (i === activeIndex ? ' active' : '');
        
        const x = radius * Math.cos((angle - 90) * Math.PI / 180);
        const y = radius * Math.sin((angle - 90) * Math.PI / 180);
        
        item.style.transform = `translate(${x}px, ${y}px)`;
        item.textContent = val;
        ring.appendChild(item);
    });

    container.appendChild(ring);
}

// 添加秒数累积变量
let accumulatedSeconds = 0;
let timeSpeedMultiplier = 1;
let speedInterval;
let lastUpdate = Date.now();

// 修改 renderEggRoulette 函数
function renderEggRoulette() {
    const container = document.getElementById('egg-roulette');
    if(!container) return;
    container.innerHTML = '';

    // 计算时间增量
    const now = Date.now();
    const deltaTime = now - lastUpdate;
    lastUpdate = now;
    
    // 累积加速的秒数
    accumulatedSeconds += (deltaTime / 1000) * timeSpeedMultiplier;
    
    // 基于累积秒数创建新的时间
    const baseTime = new Date();
    const acceleratedTime = new Date(baseTime.getTime() + accumulatedSeconds * 1000);

    const ringRadii = [100, 160, 220, 280, 340, 400];
    const dividerRadiusOffset = 30;

    // 完全复制原时钟的分割线逻辑
    ringRadii.forEach((radius, index) => {
        if (index < ringRadii.length - 1) {
            const divider = document.createElement('div');
            divider.className = 'egg-roulette-divider';
            const dividerSize = (radius + dividerRadiusOffset) * 2;
            divider.style.width = `${dividerSize}px`;
            divider.style.height = `${dividerSize}px`;
            container.appendChild(divider);
        }
    });

    // 使用加速后的时间来渲染时钟
    const yearStart = 2025;
    const yearRing = [];
    for(let y=yearStart; y<yearStart+10; y++) yearRing.push(y);
    createEggRouletteRing(container, yearRing, 100, '年', (acceleratedTime.getFullYear()-yearStart)%10);

    // 月圈
    const months = Array.from({length:12},(_,i)=>i+1);
    createEggRouletteRing(container, months.map(m=>m+'月'), 160, '月', acceleratedTime.getMonth());

    // 日圈
    const days = Array.from({length:31},(_,i)=>i+1);
    createEggRouletteRing(container, days.map(d=>d+'日'), 220, '日', acceleratedTime.getDate()-1);

    // 时圈
    const hours = Array.from({length:24},(_,i)=>i);
    createEggRouletteRing(container, hours.map(h=>h+'时'), 280, '时', acceleratedTime.getHours());

    // 分圈
    const mins = Array.from({length:60},(_,i)=>i);
    createEggRouletteRing(container, mins.map(m=>m+'分'), 340, '分', acceleratedTime.getMinutes());

    // 秒圈
    const secs = Array.from({length:60},(_,i)=>i);
    createEggRouletteRing(container, secs.map(s=>s+'秒'), 400, '秒', acceleratedTime.getSeconds());
}

// 修改视频控制相关代码
document.addEventListener('DOMContentLoaded', () => {
    const timeVideo = document.getElementById('timeVideo');
    const eggRoulette = document.getElementById('egg-roulette');

    if (timeVideo && eggRoulette) {
        timeVideo.addEventListener('play', () => {
            eggRoulette.style.display = 'block';
            eggRoulette.style.opacity = '0';
            accumulatedSeconds = 0; // 重置累积秒数
            lastUpdate = Date.now();
            
            // 开始加速时间
            speedInterval = setInterval(() => {
                timeSpeedMultiplier *= 1.5; // 每秒增加20%的速度
                if (timeSpeedMultiplier > 100) {
                    timeSpeedMultiplier = 100000; // 限制最大速度为100倍
                }
            }, 1000);

            setTimeout(() => {
                eggRoulette.style.opacity = '1';
                eggRoulette.style.transition = 'opacity 0.5s ease-in-out';
            }, 0);
        });

        timeVideo.addEventListener('pause', () => {
            // 停止加速
            clearInterval(speedInterval);
            timeSpeedMultiplier = 1;
            accumulatedSeconds = 0;

            eggRoulette.style.opacity = '0';
            eggRoulette.style.transition = 'opacity 0.5s ease-in-out';
            
            setTimeout(() => {
                eggRoulette.style.display = 'none';
            }, 500);
        });
    }
});

// 使用更高的更新频率来保证流畅性
setInterval(renderEggRoulette, 16); // 提高刷新率到约60fps