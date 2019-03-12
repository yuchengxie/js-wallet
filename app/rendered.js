
let btncreate = document.querySelector('#create');
let btnopen = document.querySelector('#open');
let { ipcRenderer } = require('electron')


//读取本地钱包目录文件
let wallet_file = {};

onload = function () {
    let btnSelect = document.getElementById('btnSelect');
    let dropdown = document.getElementById('dropdown');
    let ul_files = document.getElementById('ul_files');

    ipcRenderer.send('load_wallet', 'request load_wallet');

    btnSelect.onclick = function () {
        ul_files.style.display = ul_files.style.display === 'none' ? 'block' : 'none';
    }
    btnSelect.onmouseover = function () {
        ul_files.style.display = 'block';
    }

    btncreate.onclick = function () {
        ipcRenderer.send('create', 'create file');
    }

    btnopen.onclick = function () {
        ipcRenderer.send('open', 'open file');
    }

    ipcRenderer.on('reply_load_wallet', function (event, data) {
        // 渲染文件列表
        data.forEach(element => {
            //Todo 动态创建元素
            console.log('element:'+element);
            
        });
    })

    ipcRenderer.on('write_sccuess', function (event, data) {
        alert(data);
    })

}

