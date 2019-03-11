var { ipcMain } = require('electron');
var fs = require('fs');
var path=require('path');
var fu = require('./js/fileutils')
let bip32 = require('bip32');
let addrCount = 0;

let fp=path.join(__dirname,'../data/account/');

ipcMain.on('create', function (event, data) {
    let Buffer = require('safe-buffer').Buffer;
    let _haveSendPhone = '18800000000';
    let pwd = '123456';
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
    console.log(dataString);
    //同步创建文件夹
    fu.mkdirsSync(fp);
    fs.writeFile(fp + 'addr_' + addrCount + '.cfg', dataString, (err) => {
        if (err) {
            console.log(err);
            return
        }
    })
    console.log('addr_' + addrCount + '.cfg 写入文件成功');
    event.sender.send('write_sccuess', 'addr_' + addrCount + '.cfg 写入文件成功');
})

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
