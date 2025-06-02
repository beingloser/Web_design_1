document.addEventListener('DOMContentLoaded', function() {
    // 横向滚动条
    (function() {
        const scrollBar = document.querySelector('.scrollBar-container');
        const list = document.querySelector('.scrollBar-list');
        let scrollLeft = 0;
        let speed = 0.5;
        let rafId = null;
        if (!scrollBar || !list) return;
        list.innerHTML += list.innerHTML;
        function animate() {
            scrollLeft -= speed;
            if (Math.abs(scrollLeft) >= list.scrollWidth / 2) {
                scrollLeft = 0;
            }
            list.style.transform = `translateX(${scrollLeft}px)`;
            rafId = requestAnimationFrame(animate);
        }
        function startScroll() { if (!rafId) animate(); }
        function stopScroll() { if (rafId) { cancelAnimationFrame(rafId); rafId = null; } }
        scrollBar.addEventListener('mouseenter', stopScroll);
        scrollBar.addEventListener('mouseleave', startScroll);
        startScroll();
    })();

    // message1 导航栏板块切换
    (function() {
        const tabs = document.querySelectorAll('.message1_bar .tab');
        const contents = document.querySelectorAll('.message1_content');
        if (tabs.length === 0 || contents.length === 0) return;
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.style.display = 'none');
        tabs[0].classList.add('active');
        contents[0].style.display = 'block';
        tabs.forEach((tab, idx) => {
            tab.addEventListener('mouseenter', function() {
                tabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                contents.forEach(c => c.style.display = 'none');
                if (contents[idx]) contents[idx].style.display = 'block';
            });
        });
    })();

    // showing2 导航栏板块切换
    (function() {
        const functionBar = document.querySelector('.function_bar');
        const submenus = document.querySelectorAll('.submenu');
        if (!functionBar || submenus.length === 0) return;
        
        // 默认激活日历功能
        const defaultFunction = document.querySelector('.function1');
        const defaultSubmenu = document.querySelector('.submenu[data-content="function1"]');
        defaultFunction.classList.add('active');
        defaultFunction.style.transform = 'rotateX(-90deg)'; // 添加这行保持翻转状态
        defaultSubmenu.classList.add('active');

        functionBar.addEventListener('click', function(e) {
            const link = e.target.closest('a');
            if (!link) return;
            e.preventDefault();
            const li = link.parentElement;
            const functionType = li.dataset.function;
            
            // 重置所有按钮状态
            functionBar.querySelectorAll('li').forEach(item => {
                item.classList.remove('active');
                item.style.transform = ''; // 移除翻转状态
            });
            
            // 隐藏所有submenu
            submenus.forEach(submenu => submenu.classList.remove('active'));
            
            // 激活选中的区域
            if (functionType) {
                li.classList.add('active');
                li.style.transform = 'rotateX(-90deg)'; // 保持翻转状态
                const targetSubmenu = document.querySelector(`.submenu[data-content="${functionType}"]`);
                if (targetSubmenu) targetSubmenu.classList.add('active');
            }
        });
    })();
    
});