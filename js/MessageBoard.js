// 备忘录功能
document.addEventListener('DOMContentLoaded', function() {
    const memoTextarea = document.querySelector('.memo_textarea');
    const memoSaveBtn = document.querySelector('.memo_save');
    const memoItems = document.querySelector('.memo_items');

    // 初始化加载
    loadMemos();
    
    // 输入实时校验（禁用保存按钮当内容为空）
    memoTextarea.addEventListener('input', function() {
        const isEmpty = this.value.trim() === '';
        memoSaveBtn.disabled = isEmpty;
        if (isEmpty) memoSaveBtn.classList.add('disabled');
        else memoSaveBtn.classList.remove('disabled');
    });

    // 保存按钮点击事件
    memoSaveBtn.addEventListener('click', saveMemo);
    
    // 删除按钮事件委托（新增确认逻辑）
    memoItems.addEventListener('click', function(e) {
        if (e.target.classList.contains('memo_delete')) {
            if (window.confirm('确定要删除这条备忘录吗？')) {
                const memoItem = e.target.closest('.memo_item');
                deleteMemo(memoItem);
            }
        }
    });
});

function saveMemo() {
    const textarea = document.querySelector('.memo_textarea');
    const memoText = textarea.value.trim();
    
    if (!memoText) {
        showMessage('.memo_message_empty');
        return;
    }
    
    // 创建新的备忘录项（显示时间戳替代编号）
    const memoItems = document.querySelector('.memo_items');
    const timestamp = new Date().toLocaleString(); // 新增：获取当前时间
    
    const memoItem = document.createElement('li');
    memoItem.className = 'memo_item';
    memoItem.innerHTML = `
        <button class="memo_delete">删除</button>
        <span class="memo_item_content">
            <time>${timestamp}</time><br>
            ${memoText}
        </span>
    `;
    
    memoItems.appendChild(memoItem);
    textarea.value = '';
    document.querySelector('.memo_save').disabled = true; // 保存后禁用按钮
    
    saveMemosToLocal();
    showMessage('.memo_message');
}

function deleteMemo(memoItem) {
    if (!memoItem) return;
    
    memoItem.remove();
    saveMemosToLocal();
    showMessage('.memo_message_delete');
    
    // 重新编号剩余的备忘录
    const memoItems = document.querySelectorAll('.memo_item');
    memoItems.forEach((item, index) => {
        const contentSpan = item.querySelector('.memo_item_content');
        const text = contentSpan.textContent.replace(/备忘录\d+:/, `备忘录${index + 1}:`);
        contentSpan.textContent = text;
    });
}

function saveMemosToLocal() {
    const memos = [];
    document.querySelectorAll('.memo_item').forEach(item => {
        memos.push(item.querySelector('.memo_item_content').textContent);
    });
    
    try {
        localStorage.setItem('memos', JSON.stringify(memos));
    } catch (e) {
        console.error('保存备忘录失败:', e);
        showMessage('.memo_message_error');
    }
}

function loadMemos() {
    try {
        const savedMemos = localStorage.getItem('memos');
        if (savedMemos) {
            const memos = JSON.parse(savedMemos);
            const memoItems = document.querySelector('.memo_items');
            
            memos.forEach((memo, index) => {
                const memoItem = document.createElement('li');
                memoItem.className = 'memo_item';
                memoItem.innerHTML = `
                    <button class="memo_delete">删除</button>
                    <span class="memo_item_content">${memo}</span>
                `;
                memoItems.appendChild(memoItem);
            });
        }
    } catch (e) {
        console.error('加载备忘录失败:', e);
    }
}

function showMessage(selector) {
    const message = document.querySelector(selector);
    message.style.display = 'block';
    message.classList.add('active'); // 触发动画
    setTimeout(() => {
        message.classList.remove('active');
        setTimeout(() => message.style.display = 'none', 300); // 等待动画完成
    }, 3000);
}

// 留言板功能
document.addEventListener('DOMContentLoaded', function() {
    const messageBoardTextarea = document.querySelector('.message_board_textarea');
    const messageBoardSaveBtn = document.querySelector('.message_board_save');
    const messageBoardItems = document.querySelector('.message_board_items');

    // 初始化加载
    loadMessageBoards();
    
    // 输入实时校验（禁用保存按钮当内容为空）
    messageBoardTextarea.addEventListener('input', function() {
        const isEmpty = this.value.trim() === '';
        messageBoardSaveBtn.disabled = isEmpty;
        if (isEmpty) messageBoardSaveBtn.classList.add('disabled');
        else messageBoardSaveBtn.classList.remove('disabled');
    });

    // 保存按钮点击事件
    messageBoardSaveBtn.addEventListener('click', saveMessageBoard);
    
    // 删除按钮事件委托（新增确认逻辑）
    messageBoardItems.addEventListener('click', function(e) {
        if (e.target.classList.contains('message_board_delete')) {
            if (window.confirm('确定要删除这条留言吗？')) {
                const messageBoardItem = e.target.closest('.message_board_item');
                deleteMessageBoard(messageBoardItem);
            }
        }
    });
});

function saveMessageBoard() {
    const textarea = document.querySelector('.message_board_textarea');
    const messageText = textarea.value.trim();
    
    if (!messageText) {
        showMessage('.message_board_message_empty');
        return;
    }
    
    const messageBoardItems = document.querySelector('.message_board_items');
    const timestamp = new Date().toLocaleString();
    
    const messageBoardItem = document.createElement('li');
    messageBoardItem.className = 'message_board_item';
    messageBoardItem.innerHTML = `
        <button class="message_board_delete">删除</button>
        <span class="message_board_item_content">
            <time>${timestamp}</time><br>
            ${messageText}
        </span>
    `;
    
    messageBoardItems.appendChild(messageBoardItem);
    textarea.value = '';
    document.querySelector('.message_board_save').disabled = true; // 保存后禁用按钮
    
    saveMessageBoardsToLocal();
    showMessage('.message_board_message');
}

function deleteMessageBoard(messageBoardItem) {
    if (!messageBoardItem) return;
    
    messageBoardItem.remove();
    saveMessageBoardsToLocal();
    showMessage('.message_board_message_delete');
    
    // 重新编号剩余留言
    const messageBoardItems = document.querySelectorAll('.message_board_item');
    messageBoardItems.forEach((item, index) => {
        const contentSpan = item.querySelector('.message_board_item_content');
        const text = contentSpan.textContent.replace(/留言\d+:/, `留言${index + 1}:`);
        contentSpan.textContent = text;
    });
}

function saveMessageBoardsToLocal() {
    const messages = [];
    document.querySelectorAll('.message_board_item').forEach(item => {
        messages.push(item.querySelector('.message_board_item_content').textContent);
    });
    
    try {
        localStorage.setItem('message_boards', JSON.stringify(messages));
    } catch (e) {
        console.error('保存留言失败:', e);
        showMessage('.message_board_message_error');
    }
}

function loadMessageBoards() {
    try {
        const savedMessages = localStorage.getItem('message_boards');
        if (savedMessages) {
            const messages = JSON.parse(savedMessages);
            const messageBoardItems = document.querySelector('.message_board_items');
            
            messages.forEach((message, index) => {
                const messageBoardItem = document.createElement('li');
                messageBoardItem.className = 'message_board_item';
                messageBoardItem.innerHTML = `
                    <button class="message_board_delete">删除</button>
                    <span class="message_board_item_content">${message}</span>
                `;
                messageBoardItems.appendChild(messageBoardItem);
            });
        }
    } catch (e) {
        console.error('加载留言失败:', e);
    }
}

function showMessage(selector) {
    const message = document.querySelector(selector);
    message.style.display = 'block';
    message.classList.add('active'); // 触发动画
    setTimeout(() => {
        message.classList.remove('active');
        setTimeout(() => message.style.display = 'none', 300); // 等待动画完成
    }, 3000);
}
