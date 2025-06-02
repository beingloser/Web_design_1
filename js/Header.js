document.addEventListener('DOMContentLoaded', function() {
    //个人信息
     const aboutLink = document.querySelector('.mydata');
    // 添加点击事件
    aboutLink.addEventListener('click', function(e) {
        // 显示的信息
        const info = 
            "个人信息\n" +
            "-------------------\n" +
            "姓名：潘景豪\n" +
            "学号：2410250248\n" +
            "专业：软件工程\n" +
            "班级：软件2班\n" +
            "-------------------";
        alert(info);
    });
    
    // 滚动公告栏
    const scrollContainer = document.querySelector('.scroll_container');
    const ul = scrollContainer.querySelector('ul');
    // 克隆所有列表
    const clonedItems = Array.from(ul.children).map(item => item.cloneNode(true));
    clonedItems.forEach(item => ul.appendChild(item));
    // 计算ul的总宽度
    let totalWidth = 0;
    Array.from(ul.children).forEach(item => {
        totalWidth += item.offsetWidth;
    });
    ul.style.width = totalWidth + 'px';
    
    let scrollSpeed = 0.1; // 滚动速度
    let currentPosition = 0;
    
    function scroll() {
        currentPosition -= scrollSpeed;
        // 当滚动到一半时重置位置
        if (Math.abs(currentPosition) >= totalWidth / 2) {
            currentPosition = 0;
        }
        
        ul.style.transform = `translateX(${currentPosition}px)`;
        requestAnimationFrame(scroll);
    }
    let scrollAnimation;
    // 开始滚动
    function startScroll() {
        scrollAnimation = requestAnimationFrame(scroll);
    }
    // 鼠标悬停时加速
    scrollContainer.addEventListener('mouseleave', startScroll);
    // 开始滚动
    startScroll();

    //轮播图
    const imgs = document.querySelectorAll('.PIC.carousel .carousel-img');
    const prevBtn = document.querySelector('.PIC.carousel .prev');
    const nextBtn = document.querySelector('.PIC.carousel .next');
    const dots = document.querySelectorAll('.PIC.carousel .carousel-status .dot');
    let idx = 0;
    function showImg(i) {
        imgs.forEach((img, n) => img.classList.toggle('active', n === i));
        dots.forEach((dot, n) => dot.classList.toggle('active', n === i));
    }
    showImg(idx);
    // 自动播放定时器
    let autoTimer = null;
    function startAutoPlay() {
        clearInterval(autoTimer);
        autoTimer = setInterval(() => {
            idx = (idx + 1) % imgs.length;
            showImg(idx);
        }, 3000); // 每3秒切换一次
    }
    function stopAutoPlay() {
        clearInterval(autoTimer);
    }
    startAutoPlay();
    prevBtn.onclick = function() {
        idx = (idx - 1 + imgs.length) % imgs.length;
        showImg(idx);
        startAutoPlay(); // 手动切换后重置自动播放
    };
    nextBtn.onclick = function() {
        idx = (idx + 1) % imgs.length;
        showImg(idx);
        startAutoPlay();
    };
    dots.forEach((dot, i) => {
        dot.onclick = function() {
            idx = i;
            showImg(idx);
            startAutoPlay();
        }
    });
    // 鼠标悬停时暂停自动播放，移开时恢复
    const carousel = document.querySelector('.PIC.carousel');
    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);
    

});