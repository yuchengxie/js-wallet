
let btncreate = document.querySelector('#create');
let btnopen = document.querySelector('#open');
let { ipcRenderer } = require('electron')

btncreate.onclick = function () {
    ipcRenderer.send('create', 'create file');
}

btnopen.onclick = function () {
    ipcRenderer.send('open', 'open file');
}

ipcRenderer.on('write_sccuess', function (event, data) {
    alert(data);
})
