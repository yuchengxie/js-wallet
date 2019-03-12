
let btncreate = document.querySelector('#create');
let btnopen = document.querySelector('#open');
let { ipcRenderer } = require('electron')


//读取本地钱包目录文件
let wallet_file = {};

onload = function () {
    let btnSelect = document.getElementById('btnSelect');
    let dropdown = document.getElementById('dropdown');
    let ul_files = document.getElementById('ul_files');
    let file_content=document.getElementById('file_content');

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
            let ele=document.createElement('li');
            ele.innerText=element;
            ele.addEventListener('click',function(ele){
                //读取文件，写到界面
                ul_files.style.display='none';
                ipcRenderer.send('read_file',element);
            });
            ul_files.appendChild(ele);
        });
    })

    ipcRenderer.on('reply_read_file',function(event,data){
        file_content.innerText=data;
    })

    ipcRenderer.on('write_sccuess', function (event, data) {
        alert(data);
    })

}

