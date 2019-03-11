
let btncreate = document.querySelector('#create');
let { ipcRenderer } = require('electron')

btncreate.onclick = function () {
    ipcRenderer.send('create', 'create file');
}

ipcRenderer.on('write_sccuess', function (event, data) {
    alert(data);
})
