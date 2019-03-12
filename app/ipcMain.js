let { ipcMain, dialog } = require('electron');
let fs = require('fs');
let path = require('path');
let fu = require('./js/fileutils')
let gdata=require('./js/gdata')
let bip32 = require('bip32');

let fp = path.join(__dirname, '../data/account/');
let default_path=path.join(__dirname,'../data/')
//同步创建文件夹
fu.mkdirsSync(fp);
let addrCount = fu.readDirSync(fp);

ipcMain.on('open', function (event, data) {
    dialog.showOpenDialog({
        properties: ['openfile', 'openDirectory'],
        defaultPath:fp
    }, function (files) {
        // if (files) event.sender.send('selected-directory', files)
        console.log('files:\n'+files);
    })
})

ipcMain.on('create', function (event, data) {
    var dataString=generateData();
    console.log(dataString);
    //用户文件夹
    fs.writeFile(fp + 'addr_' + addrCount + '.cfg', dataString, (err) => {
        if (err) {
            console.log(err);
            return
        }
    })
    //default文件夹
    fs.writeFile(default_path + 'default.cfg', dataString, (err) => {
        if (err) {
            console.log(err);
            return
        }
    })

    console.log('addr_' + addrCount + '.cfg 写入文件成功');
    event.sender.send('write_sccuess', 'addr_' + addrCount + '.cfg 写入文件成功');
})

function generateData(){
    let Buffer = require('safe-buffer').Buffer;
    let _haveSendPhone = gdata.MathRand(11);
    // let pwd = '123456';
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

ipcMain.on('read', function (event, d) {
    console.log(d);
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
