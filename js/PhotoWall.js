document.addEventListener('DOMContentLoaded', function() {
    const addPhotoBtn = document.getElementById('add-photo-btn');
    const photoUpload = document.getElementById('photo-upload');
    const photoWall = document.getElementById('photo-wall');
    
    let photoItems = [];
    
    // 从本地存储加载照片
    loadPhotosFromStorage();
    
    // 添加照片按钮点击事件
    addPhotoBtn.addEventListener('click', function() {
        photoUpload.click();
    });
    
    // 照片文件选择事件
    photoUpload.addEventListener('change', function(e) {
        const files = e.target.files;
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.type.startsWith('image/')) {
                addPhotoItem(file);
            }
        }
        photoUpload.value = '';
    });
    
    // 添加照片项
    function addPhotoItem(file) {
        const fileName = file.name.replace(/\.[^/.]+$/, "");
        const timeString = new Date().toLocaleString();
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const photoItem = {
                id: Date.now(),
                name: fileName,
                time: timeString,
                url: e.target.result
            };
            
            photoItems.push(photoItem);
            savePhotosToStorage();
            renderPhotoItem(photoItem);
        };
        reader.readAsDataURL(file);
    }
    
    // 渲染照片项
    function renderPhotoItem(item) {
        const photoItem = document.createElement('div');
        photoItem.className = 'photo-item';
        photoItem.dataset.id = item.id;
        
        photoItem.innerHTML = `
            <img src="${item.url}" class="photo-img" alt="${item.name}">
            <div class="photo-info">
                <div class="photo-title">${item.name}</div>
                <div class="photo-time">添加时间: ${item.time}</div>
            </div>
            <button class="delete-photo-btn" data-id="${item.id}">&times;</button>
        `;
        
        photoWall.appendChild(photoItem);
        
        // 删除按钮事件
        photoItem.querySelector('.delete-photo-btn').addEventListener('click', function(e) {
            e.stopPropagation();
            deletePhotoItem(item.id);
        });
        
        // 照片点击事件
        photoItem.addEventListener('click', () => showPhotoModal(item));
    }
    
    // 删除照片
    function deletePhotoItem(id) {
        photoItems = photoItems.filter(item => item.id !== id);
        savePhotosToStorage();
        document.querySelector(`.photo-item[data-id="${id}"]`)?.remove();
    }
    
    // 显示大图
    function showPhotoModal(photo) {
        const modal = document.createElement('div');
        modal.className = 'photo-modal';
        modal.innerHTML = `
            <div style="position: relative; max-width: 90%; max-height: 90%;">
                <img src="${photo.url}" style="max-width: 100%; max-height: 80vh;">
                <div style="color: white; text-align: center; padding: 10px;">
                    <div>${photo.name}</div>
                    <div style="font-size: 14px; color: #ccc;">${photo.time}</div>
                </div>
                <button style="position: absolute; top: 10px; right: 10px; background: #ff6b6b; color: white; border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer;">&times;</button>
            </div>
        `;
        
        Object.assign(modal.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: '1000'
        });
        
        document.body.appendChild(modal);
        
        // 关闭事件
        modal.addEventListener('click', e => {
            if (e.target === modal || e.target.tagName === 'BUTTON') {
                modal.remove();
            }
        });
    }
    
    // 存储照片
    function savePhotosToStorage() {
        localStorage.setItem('photoWallData', JSON.stringify(photoItems));
    }
    
    // 加载照片
    function loadPhotosFromStorage() {
        try {
            photoItems = JSON.parse(localStorage.getItem('photoWallData')) || [];
            photoItems.forEach(item => renderPhotoItem(item));
        } catch (e) {
            console.error('Failed to load photos:', e);
            photoItems = [];
        }
    }
});