const Insta = require('../lib/index.js');
const InstaClient = new Insta();
const fs = require('fs');
const readlineSync = require('readline-sync');
const moment = require('moment');
const chalk = require('chalk');

(async () => {
    console.log('');
    const shortCode = readlineSync.question('Masukan link postingan : ');
    console.log('');
    const commentFile = await fs.readFileSync('comment.txt', 'utf-8');
    const commentArray = commentFile.toString().split("\n");
    const commentFinal = commentArray[Math.floor(Math.random() * commentArray.length)];

    const payload = {
        shortCode: shortCode.split('/')[4],
        commentText: commentFinal
    }

    const accounts = fs.readFileSync('../akunlist.txt', 'utf8').split('\n');

    try {
        for (i = 0; i < accounts.length; i++) {
            const user = accounts[i].split('|');
            console.log(`[ ${moment().format("HH:mm:ss")} ] `, chalk.green(`Mencoba login untuk akun ${user[0]}`));
            try {
                
                await InstaClient.login(user[0], user[1]);
                try {
                    const comment = await InstaClient.commentToMediaByShortCode(payload);
                    if (comment.status && comment.status == 'ok') {
                        console.log(`[ ${moment().format("HH:mm:ss")} ] `, chalk.green(`Berhasil komen : ${commentFinal}`));
                    }else{
                        console.log(`[ ${moment().format("HH:mm:ss")} ] `, chalk.yellow(`Gagal komen : ${commentFinal}`));
                    }
                } catch (error) {
                    console.log(`[ ${moment().format("HH:mm:ss")} ] `, chalk.red(`Ada masalah saat menambahkan komen.`));
                }

                try {
                    const save = await InstaClient.saveImageByShortCode(payload.shortCode);
                    if (save.status && save.status == 'ok') {
                        console.log(`[ ${moment().format("HH:mm:ss")} ] `, chalk.green(`Berhasil save media.`));
                    }else{
                        console.log(`[ ${moment().format("HH:mm:ss")} ] `, chalk.yellow(`Gagal save media.`));
                    }
                } catch (error) {
                    console.log(`[ ${moment().format("HH:mm:ss")} ] `, chalk.red(`Ada masalah saat save media.`));
                }

                console.log('')
                
            } catch (error) {
                console.log(`[ ${moment().format("HH:mm:ss")} ] `, chalk.red(`Ada masalah ${error}`));
                console.log('');
            }
        };
    } catch (error) {
        console.log(`[ ${moment().format("HH:mm:ss")} ] `, chalk.red(`Ada masalah ${error.toString}`));
        console.log('');
    }
})();