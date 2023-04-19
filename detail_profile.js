const Insta = require('./lib/index.js');
const InstaClient = new Insta();
const fs = require('fs');
const colors = require('./lib/colors');
const fetch = require('node-fetch');
const readlineSync = require('readline-sync');
const moment = require('moment');
const chalk = require('chalk');
const delay = require('delay');


(async () => {

    let username;
    let password;

    if (fs.existsSync('./Cookies.json')) {
        try {
            const oldDataResult = await InstaClient.useExistingCookie();
            username = oldDataResult.username;
        } catch (e) {
            username = readlineSync.question('Masukan username : ');
            password = readlineSync.question('Masukan password : ');
            const result = await InstaClient.login(username, password);
            if (result.status && result.status == 'fail') {
                console.log(`[ ${moment().format("HH:mm:ss")} ] `, chalk.red(`Gagal login : ${result.message}`));
            }
        }
    } else {
        username = readlineSync.question('Masukan username : ');
        password = readlineSync.question('Masukan password : ');
        const result = await InstaClient.login(username, password);
        if (result.status && result.status == 'fail') {
            console.log(`[ ${moment().format("HH:mm:ss")} ] `, chalk.red(`Gagal login : ${result.message}`));
        }
    }
    console.log('')

    let profileDetail = await InstaClient.getImageByUser('aristyo586');

    fs.writeFileSync('./oldcode.txt', profileDetail.user.edge_owner_to_timeline_media.edges[0].node.shortcode, 'utf-8');
    let oldCode = fs.readFileSync('./oldCode.txt', 'utf-8');
    

    let newCode = '';
    const commentFinal = 'test aja seberapa cepat';

    do {
        try {
            oldCode = fs.readFileSync('./oldCode.txt', 'utf-8');
            profileDetail = await InstaClient.getImageByUser('aristyo586');
            if (oldCode !== profileDetail.user.edge_owner_to_timeline_media.edges[0].node.shortcode) {
                fs.writeFileSync('./oldcode.txt', profileDetail.user.edge_owner_to_timeline_media.edges[0].node.shortcode, 'utf-8');
                console.log('ada postingan baru');
                const photos = await InstaClient.getImageByUser('aristyo586')

                const mediaData = {
                    mediaUrl: photos.user.edge_owner_to_timeline_media.edges[0].node.edge_sidecar_to_children ? photos.user.edge_owner_to_timeline_media.edges[0].node.edge_sidecar_to_children.edges.map(data => {
                        return data.node.display_url;
                    }) : [photos.user.edge_owner_to_timeline_media.edges[0].node.display_url],
                    createdAt: photos.user.edge_owner_to_timeline_media.edges[0].node.taken_at_timestamp,
                    shortCode: photos.user.edge_owner_to_timeline_media.edges[0].node.shortcode,
                    mediaCaption: photos.user.edge_owner_to_timeline_media.edges[0].node.edge_media_to_caption.edges.length == 0 ? '' : photos.user.edge_owner_to_timeline_media.edges[0].node.edge_media_to_caption.edges[0].node.text
                }

                await InstaClient.likeMediaByShortCode(mediaData.shortCode);
                const resultCommentMedia = await InstaClient.commentToMediaByShortCode({ shortCode: mediaData.shortCode, commentText: commentFinal });
                if (resultCommentMedia.status && resultCommentMedia.status == 'ok') {
                    console.log(`[ ${moment().format("HH:mm:ss")} ] [ @${photos.user.username} | Shortcode : ${mediaData.shortCode} | Comment : ${commentFinal} ]  => `, chalk.green('Success Comment!'));
                } else {
                    console.log(`[ ${moment().format("HH:mm:ss")} ] [ @${photos.user.username} | Shortcode : ${mediaData.shortCode} | Comment : ${commentFinal}  ]  => `, chalk.red('Failed To Comment!'));
                }
            } else {
                console.log('tidak ada postingan baru')
            }
        } catch (error) {
            console.log(error)
            console.log('tidak ada postingan baru')
            newCode = ''
        }
        
    } while (oldCode !== newCode);
    console.log('selesai')
})();