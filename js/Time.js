function createRouletteRing(container, values, radius, label, activeIndex) {
    const ring = document.createElement('div');
    ring.className = 'roulette-ring';
    ring.style.width = ring.style.height = (radius * 2) + 'px';
    ring.style.left = '50%';
    ring.style.top = '50%';
    ring.style.transform = 'translate(-50%, -50%)';
    ring.style.position = 'absolute';
    ring.style.pointerEvents = 'none';

    values.forEach((val, i) => {
        const angle = (360 / values.length) * i;
        const item = document.createElement('div');
        item.className = 'roulette-item' + (i === activeIndex ? ' active' : '');
        
        //使文本中心在圆环线上
        const x = radius * Math.cos((angle - 90) * Math.PI / 180);
        const y = radius * Math.sin((angle - 90) * Math.PI / 180);
        
        item.style.transform = `translate(${x}px, ${y}px)`;
        item.textContent = val;
        ring.appendChild(item);
    });

    container.appendChild(ring);
}

function renderBigRoulette() {
    const container = document.getElementById('big-roulette');
    if(!container) return;
    container.innerHTML = '';

    const now = new Date();
    // 定义各时间环的半径（年圈100px，月圈160px，日圈220px，时圈280px，分圈340px，秒圈400px）
    const ringRadii = [100, 160, 220, 280, 340, 400];
    const dividerRadiusOffset = 30; // 相邻环间距60px（如160-100=60），分割线位于中间30px处

    // 生成分割线（位于相邻环之间）
    ringRadii.forEach((radius, index) => {
        if (index < ringRadii.length - 1) { // 最后一个环后不添加分割线
            const divider = document.createElement('div');
            divider.className = 'roulette-divider';
            const dividerSize = (radius + dividerRadiusOffset) * 2; // 直径=半径*2
            divider.style.width = `${dividerSize}px`;
            divider.style.height = `${dividerSize}px`;
            container.appendChild(divider);
        }
    });

    // 年圈（10年为一圈，显示2025~2105）
    const yearStart = 2025;
    const year = now.getFullYear();
    const yearRing = [];
    for(let y=yearStart; y<yearStart+10; y++) yearRing.push(y);
    createRouletteRing(container, yearRing, 100, '年', (year-yearStart)%10);

    // 月圈
    const months = Array.from({length:12},(_,i)=>i+1);
    createRouletteRing(container, months.map(m=>m+'月'), 160, '月', now.getMonth());

    // 日圈
    const days = Array.from({length:31},(_,i)=>i+1);
    createRouletteRing(container, days.map(d=>d+'日'), 220, '日', now.getDate()-1);

    // 时圈
    const hours = Array.from({length:24},(_,i)=>i);
    createRouletteRing(container, hours.map(h=>h+'时'), 280, '时', now.getHours());

    // 分圈
    const mins = Array.from({length:60},(_,i)=>i);
    createRouletteRing(container, mins.map(m=>m+'分'), 340, '分', now.getMinutes());

    // 秒圈
    const secs = Array.from({length:60},(_,i)=>i);
    createRouletteRing(container, secs.map(s=>s+'秒'), 400, '秒', now.getSeconds());
}

// 动态刷新
setInterval(renderBigRoulette, 1000);
document.addEventListener('DOMContentLoaded', renderBigRoulette);

// 页面加载后绑定视频点击事件
document.addEventListener('DOMContentLoaded', () => {
    const timeVideo = document.getElementById('timeVideo');
    if (timeVideo) {
        // 已有点击播放/暂停逻辑
        timeVideo.addEventListener('click', function() {
            if (this.paused) {
                this.play();
            } else {
                this.pause();
            }
        });

        // 监听所有 .main 类的菜单项（切换页面的触发点）
        const functionMenus = document.querySelectorAll('.main');
        functionMenus.forEach(menu => {
            menu.addEventListener('click', () => {
                if (!timeVideo.paused) {
                    timeVideo.pause(); // 切换页面时暂停视频（变量名同步修改）
                }
            });
        });
    }
});
