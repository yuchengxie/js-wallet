
let btncreate = document.querySelector('#create');
let btnopen = document.querySelector('#open');
let { ipcRenderer } = require('electron')


//读取本地钱包目录文件
// let wallet_file = {};

onload = function () {
    let btnSelect = document.getElementById('btnSelect');
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
        initUlNode(data);
    })

    ipcRenderer.on('reply_read_file',function(event,data){
        file_content.innerText=data;
    })

    ipcRenderer.on('write_sccuess', function (event, data) {
        // alert(data);
        console.log('接收到file_wallet:\n',data.length,'\n',data);
        add(data);
        alert(data+'创建成功');
    })

    function initUlNode(data){
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
    }

    function add(newFilename){
        console.log('element:'+newFilename);
        let ele=document.createElement('li');
        ele.innerText=newFilename;
        ele.addEventListener('click',function(ele){
            //读取文件，写到界面
            ul_files.style.display='none';
            ipcRenderer.send('read_file',newFilename);
        });
        ul_files.appendChild(ele);
    }

    function remove(){
        let childList=ul_files.childNodes;
        console.log('要删除的元素childList length:'+childList.length);
        for(var i=0;i<childList.length;i++){
            ul_files.removeChild(childList[i]);
        }
    }
}

