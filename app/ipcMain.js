let { ipcMain, dialog } = require('electron');
let fs = require('fs');
let path = require('path');
let fu = require('./js/fileutils')
let gdata = require('./js/gdata')
let bip32 = require('bip32');

let fp = path.join(__dirname, '../data/account/');
let default_path = path.join(__dirname, '../data/')
//同步创建文件夹
// fu.mkdirsSync(fp);
// let files_wallet = fu.readDirSync(fp);
// let addrCount = files_wallet.length;
// console.log('初始化:' + files_wallet, '\n长度:', addrCount);

ipcMain.on('load_wallet', function (event, d) {
    // if (fu.mkdirsSync(fp) === 1) {
    //     files_wallet = fu.readDirSync(fp);
    //     event.sender.send('reply_load_wallet', files_wallet);
    // } else {
    //     addrCount = 0;
    //     files_wallet = [];
    //     console.log('全部初始化');
    //     event.sender.send('reply_load_wallet', []);
    // }
    fu.mkdirsSync(fp)
    files_wallet = fu.readDirSync(fp);
    event.sender.send('reply_load_wallet', files_wallet);
    console.log('重新加载 addrCount:', addrCount);
})

ipcMain.on('open', function (event, data) {
    dialog.showOpenDialog({
        properties: ['openfile', 'openDirectory'],
        defaultPath: fp
    }, function (files) {
        // if (files) event.sender.send('selected-directory', files)
    })
})

ipcMain.on('create', function (event, data) {
    var dataString = generateData();
    console.log(dataString);
    //用户文件夹
    fs.writeFile(fp + 'addr_' + addrCount + '.cfg', dataString, (err) => {
        if (err) {
            console.log(err);
            return
        }
        console.log('addr_' + addrCount + '.cfg 写入文件成功');
        // event.sender.send('write_sccuess', 'addr_' + addrCount + '.cfg 写入文件成功');
        // files_wallet = fu.readDirSync(fp)
        // console.log('更新后的files_wallet:\n', files_wallet.length, '\n', files_wallet);
        console.log('新增:' + 'addr_' + addrCount + '.cfg');
        event.sender.send('write_sccuess', 'addr_' + addrCount + '.cfg');
    })
    //default文件夹
    fs.writeFile(default_path + 'default.cfg', dataString, (err) => {
        if (err) {
            console.log(err);
            return
        }
    })
})

function generateData() {
    let Buffer = require('safe-buffer').Buffer;
    let _haveSendPhone = gdata.MathRand(11);
    let pwd = gdata.MathRand(6);
    let ss = '';
    addrCount++;

    let bip = bip32.fromSeed(Buffer.from('TianMiYu:' + _haveSendPhone + ':' + pwd));
    let d = bip.publicKey.toJSON().data;
    for (let i = 0; i < d.length; i++) {
        let tmp = d[i].toString(16);
        if (tmp.length == 1) {
            ss += '0' + tmp;
        } else {
            ss += tmp;
        }
    }
    var data = { pub_key: ss, prv_key: null };
    var dataString = JSON.stringify(data);
    return dataString;
}

ipcMain.on('read_file', function (event, filename) {
    fs.readFile(fp + filename, 'utf-8', function (err, data) {
        if (err) throw err;
        event.sender.send('reply_read_file', data);
    })
})

ipcMain.on('read', function (event, d) {
    if (d === '2') {
        console.log('can read')
        fs.readFile('config.json', 'utf-8', function (err, data) {
            console.log(data);
            event.sender.send('readply', data);
        })
    } else {
        console.log('can not read')
    }
})
