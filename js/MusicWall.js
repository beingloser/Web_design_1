document.addEventListener('DOMContentLoaded', function() {
    const addMusicBtn = document.getElementById('add-music-btn');
    const audioUpload = document.getElementById('audio-upload');
    const musicList = document.getElementById('music-list');
    
    let musicItems = [];
    
    // 从本地存储加载音乐
    loadMusicFromStorage();
    
    // 添加音乐按钮点击事件
    addMusicBtn.addEventListener('click', function() {
        audioUpload.click();
    });
    
    // 音频文件选择事件
    audioUpload.addEventListener('change', function(e) {
        const files = e.target.files;
        for (let i = 0; i < files.length; i++) {
            addMusicItem(files[i]);
        }
        audioUpload.value = '';
    });
    
    // 添加音乐项
    function addMusicItem(file) {
        const fileName = file.name.replace(/\.[^/.]+$/, "");
        const timeString = new Date().toLocaleString();
        
        const musicItem = {
            id: Date.now(),
            name: fileName,
            time: timeString,
            file: file,
            audioUrl: URL.createObjectURL(file)
        };
        
        musicItems.push(musicItem);
        saveMusicToStorage();
        renderMusicItem(musicItem);
    }
    
    // 渲染音乐项
    function renderMusicItem(item) {
        const musicItem = document.createElement('div');
        musicItem.className = 'music-item';
        musicItem.dataset.id = item.id;
        
        musicItem.innerHTML = `
            <div class="music-info">
                <div class="music-title">${item.name}</div>
                <div class="music-time">添加时间: ${item.time}</div>
                <audio controls class="audio-player">
                    <source src="${item.audioUrl}" type="${item.file.type}">
                    您的浏览器不支持音频元素。
                </audio>
            </div>
            <button class="delete-btn" data-id="${item.id}">删除</button>
        `;
        
        musicList.appendChild(musicItem);
        
        // 添加删除按钮事件
        const deleteBtn = musicItem.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            deleteMusicItem(item.id);
            musicItem.remove();
        });
    }
    
    // 删除音乐项
    function deleteMusicItem(id) {
        musicItems = musicItems.filter(item => item.id !== id);
        saveMusicToStorage();
    }
    
    // 保存到本地存储
    function saveMusicToStorage() {
        const storageItems = musicItems.map(item => ({
            id: item.id,
            name: item.name,
            time: item.time
        }));
        localStorage.setItem('musicItems', JSON.stringify(storageItems));
    }
    
    // 从本地存储加载
    function loadMusicFromStorage() {
        const storedItems = localStorage.getItem('musicItems');
        if (storedItems) {
            JSON.parse(storedItems).forEach(item => {
                // 处理已存储的音乐项
            });
        }
    }
});