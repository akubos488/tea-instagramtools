const Insta = require('../lib/index.js');
const InstaClient = new Insta();
const readlineSync = require('readline-sync');
const moment = require('moment');
const colors = require("../lib/colors");
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');


(async () => {
    try {
        inquirer.prompt(
            [
                {
                    type: "list",
                    name: "index",
                    message: 'Pilih script yang akan di jalankan',
                    choices: [
                        'Auto Get Headers Cookies',
                        'Auto Add Post',
                        'Auto Change Password',
                        'Auto Change Username',
                        'Auto Comment and Save Media',
                        'Auto Add bio and Profile Pic',
                        'Auto Add Profile Pic',
                        'Auto Like reel/igtv/post'
                    ]
                }
            ])
            .then(async answers => {
                console.log('');

                let accountListLocation = './akunlist.txt';
                let akunList = await fs.readFileSync(accountListLocation, 'utf-8');
                let akunListArray = akunList.toString().split("\n");

                if (answers['index'] == 'Auto Like reel/igtv/post') {

                    const shortCode = readlineSync.question('Masukan shortCode postingan : ');
                    const type = readlineSync.question('Masukan Type (reel/igtv/post) : ');
                    console.log('')


                    for (let index = 0; index < akunListArray.length; index++) {
                        const akun = akunListArray[index];
                        const theRealUsername = akun.split('|')[0];
                        const password = akun.split('|')[1];

                        console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgGreen,
                            `mencoba login dengan username ${theRealUsername} dan password ${password}.`,
                            colors.Reset);
                        const resultLogin = await InstaClient.login(theRealUsername, password);
                        if (resultLogin.hasOwnProperty('authenticated') && resultLogin.authenticated == true) {
                            console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgGreen,
                                `Mencoba like ${type} dengan shortcode ${shortCode}`,
                                colors.Reset);

                            try {
                                const resultLikeMedia = await InstaClient.likeMediaByShortCodeAndType(shortCode)
                                if (resultLikeMedia.status && resultLikeMedia.status == 'ok') {
                                    console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgGreen,
                                        `sukses like`,
                                        colors.Reset);


                                } else {
                                    console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgRed,
                                        `Gagal like`,
                                        colors.Reset);
                                }
                            } catch (error) {
                                console.log(error)
                                console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgRed,
                                    `Gagal update profile pic, ${error}`,
                                    colors.Reset);
                            }
                        } else {
                            console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgRed,
                                `Gagal Login, ${resultLogin.message}`,
                                colors.Reset);
                        }





                        console.log('')


                    }


                }

                if (answers['index'] == 'Auto Add Profile Pic') {
                    const imageLocation = 'images';

                    //directory
                    const folderYangMauDiUpload = imageLocation

                    //joining path of directory
                    const directoryPath = path.join(__dirname, '../' + folderYangMauDiUpload);
                    const getPath = await fs.readdirSync(directoryPath);
                    const listPath = [];
                    getPath.map(file => {
                        listPath.push(file);

                    })




                    for (let index = 0; index < akunListArray.length; index++) {
                        const akun = akunListArray[index];
                        const theRealUsername = akun.split('|')[0];
                        const password = akun.split('|')[1];

                        const imageName = listPath[Math.floor(Math.random() * listPath.length)];
                        console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgGreen,
                            `mencoba login dengan username ${theRealUsername} dan password ${password}.`,
                            colors.Reset);
                        await InstaClient.login(theRealUsername, password);


                        console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgGreen,
                            `update profile picture untuk username ${theRealUsername}`,
                            colors.Reset);

                        const photo = path.join(__dirname, `../${imageLocation}/${imageName}`);

                        let retry = true;

                        try {
                            const changeImageResult = await InstaClient.changeProfileImage(photo);
                            if (changeImageResult.changed_profile) {
                                retry = false;
                                console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgGreen,
                                    `sukses update profile pic`,
                                    colors.Reset);


                            } else {
                                console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgRed,
                                    `Gagal update profile pic`,
                                    colors.Reset);
                            }
                        } catch (error) {
                            console.log(error)
                            console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgRed,
                                `Gagal update profile pic, ${error}`,
                                colors.Reset);
                        }


                        console.log('')


                    }


                }

                if (answers['index'] == 'Auto Add bio and Profile Pic') {
                    const imageLocation = 'images';
                    const bioLocation = './bio.txt';

                    //directory
                    const folderYangMauDiUpload = imageLocation

                    //joining path of directory
                    const directoryPath = path.join(__dirname, '../' + folderYangMauDiUpload);
                    const getPath = await fs.readdirSync(directoryPath);
                    const listPath = [];
                    getPath.map(file => {
                        listPath.push(file);

                    })

                    const bioFile = await fs.readFileSync(bioLocation, 'utf-8');
                    const bioArray = bioFile.toString().split("\n");



                    for (let index = 0; index < akunListArray.length; index++) {
                        const akun = akunListArray[index];
                        const theRealUsername = akun.split('|')[0];
                        const password = akun.split('|')[1];

                        const imageName = listPath[Math.floor(Math.random() * listPath.length)];
                        const bioFinal = bioArray[Math.floor(Math.random() * bioArray.length)];

                        console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgGreen,
                            `mencoba login dengan username ${theRealUsername} dan password ${password}.`,
                            colors.Reset);
                        await InstaClient.login(theRealUsername, password);

                        const payload = {
                            biography: bioFinal
                        }

                        console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgGreen,
                            `mencoba update bio untuk akun ${theRealUsername}`,
                            colors.Reset);
                        try {
                            const resultUpdateBio = await InstaClient.updateProfile(payload);
                            if (resultUpdateBio.status && !resultUpdateBio.status == 'ok') {
                                console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgRed,
                                    `gagal update bio untuk username ${theRealUsername}`,
                                    colors.Reset);
                            } else {
                                console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgGreen,
                                    `sukses update bio untuk username ${theRealUsername}`,
                                    colors.Reset);
                            }

                        } catch (e) {
                            console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgRed,
                                `gagal update bio untuk username ${theRealUsername}`,
                                colors.Reset);
                        }

                        console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgGreen,
                            `update profile picture untuk username ${theRealUsername}`,
                            colors.Reset);

                        const photo = path.join(__dirname, `../${imageLocation}/${imageName}`);

                        try {
                            const changeImageResult = await InstaClient.changeProfileImage(photo);
                            console.log(changeImageResult)
                            if (changeImageResult.changed_profile) {
                                console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgGreen,
                                    `sukses update profile pic`,
                                    colors.Reset);


                            } else {
                                console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgRed,
                                    `Gagal update profile pic`,
                                    colors.Reset);
                            }
                        } catch (error) {
                            console.log(error)
                            console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgRed,
                                `Gagal update profile pic`,
                                colors.Reset);
                        }

                        console.log('')


                    }


                }

                if (answers['index'] == 'Auto Comment and Save Media') {

                    console.log('');
                    const shortCode = readlineSync.question('Masukan link postingan : ');
                    console.log('');


                    try {
                        for (i = 0; i < akunListArray.length; i++) {
                            const commentFile = await fs.readFileSync('./comment.txt', 'utf-8');
                            const commentArray = commentFile.toString().split("\n");
                            const commentFinal = commentArray[Math.floor(Math.random() * commentArray.length)];

                            const payload = {
                                shortCode: shortCode.split('/')[4],
                                commentText: commentFinal
                            }

                            const user = akunListArray[i].split('|');
                            console.log(`[ ${moment().format("HH:mm:ss")} ] `, chalk.green(`Mencoba login untuk akun ${user[0]}`));
                            try {

                                await InstaClient.login(user[0], user[1]);
                                try {
                                    const comment = await InstaClient.commentToMediaByShortCode(payload);
                                    if (comment.status && comment.status == 'ok') {
                                        console.log(`[ ${moment().format("HH:mm:ss")} ] `, chalk.green(`Berhasil komen : ${commentFinal}`));
                                    } else {
                                        console.log(`[ ${moment().format("HH:mm:ss")} ] `, chalk.yellow(`Gagal komen : ${commentFinal}`));
                                    }
                                } catch (error) {
                                    console.log(`[ ${moment().format("HH:mm:ss")} ] `, chalk.red(`Ada masalah saat menambahkan komen.`));
                                }

                                try {
                                    const save = await InstaClient.saveImageByShortCode(payload.shortCode);
                                    if (save.status && save.status == 'ok') {
                                        console.log(`[ ${moment().format("HH:mm:ss")} ] `, chalk.green(`Berhasil save media.`));
                                    } else {
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

                }


                if (answers['index'] == 'Auto Get Headers Cookies') {

                    for (let index = 0; index < akunListArray.length; index++) {
                        console.log('')
                        const akun = akunListArray[index];

                        const theRealUsername = akun.split('|')[0];
                        const password = akun.split('|')[1];
                        console.log('');
                        console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgGreen,
                            `mencoba login dengan username ${theRealUsername} dan password ${password}.`,
                            colors.Reset);
                        await InstaClient.login(theRealUsername, password);

                        console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgGreen,
                            `mengambil cookie.`,
                            colors.Reset);
                        const getHeadersCookie = await InstaClient.getHeaders();
                        fs.appendFileSync('./akuncookies.txt', `${JSON.stringify(getHeadersCookie)}\n`);

                    };

                }

                if (answers['index'] == 'Auto Add Post') {
                    console.log('')
                    const imageLocation = 'images';
                    const bioLocation = './bio.txt';

                    const totalAddPost = readlineSync.question('mau berapa postingan yang di upload ex. 10 : ');
                    console.log("");

                    if (totalAddPost && parseInt(totalAddPost) < 1) {
                        console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgRed,
                            `total postingan yang di upload harus lebih dari 0`,
                            colors.Reset);
                    }

                    //directory
                    const folderYangMauDiUpload = imageLocation

                    //joining path of directory
                    const directoryPath = path.join(__dirname, folderYangMauDiUpload);
                    const getPath = await fs.readdirSync(directoryPath);
                    const listPath = [];
                    getPath.map(file => {
                        listPath.push(file);

                    })

                    const bioFile = await fs.readFileSync(bioLocation, 'utf-8');
                    const bioArray = bioFile.toString().split("\n");



                    for (let index = 0; index < akunListArray.length; index++) {
                        const akun = akunListArray[index];
                        const theRealUsername = akun.split('|')[0];
                        const password = akun.split('|')[1];

                        console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgGreen,
                            `mencoba login dengan username ${theRealUsername} dan password ${password}.`,
                            colors.Reset);
                        await InstaClient.login(theRealUsername, password);

                        let dataIndex = 1;
                        do {

                            const caption = bioArray[Math.floor(Math.random() * bioArray.length)];
                            console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgGreen,
                                `Mencoba add post....`,
                                colors.Reset);

                            const imageNamePost = listPath.filter(x => x.includes('jpeg'))[Math.floor(Math.random() * listPath.length)];
                            const photoPost = path.join(__dirname, `./${imageLocation}/${imageNamePost}`);

                            const resultAddPost = await InstaClient.addPost(photoPost, caption);
                            if (resultAddPost.status && resultAddPost.status == 'ok') {
                                console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgGreen,
                                    `Sukses add post ke ${dataIndex} untuk username ${theRealUsername}.`,
                                    colors.Reset);
                            } else {
                                console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgRed,
                                    `gagal add post, silahkan coba add post manual untuk user ${theRealUsername}`,
                                    colors.Reset);
                            }


                            console.log(' ')
                            dataIndex++
                        } while (dataIndex <= parseInt(totalAddPost));


                    }
                }


                if (answers['index'] == 'Auto Change Password') {
                    console.log('');
                    const newPassword = readlineSync.question('Masukan password baru : ');
                    console.log('')
                    for (let index = 0; index < akunListArray.length; index++) {
                        const akun = akunListArray[index];
                        const theRealUsername = akun.split('|')[0];
                        const password = akun.split('|')[1];

                        console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgGreen,
                            `mencoba login dengan username ${theRealUsername} dan password ${password}.`,
                            colors.Reset);
                        await InstaClient.login(theRealUsername, password);

                        console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgGreen,
                            `mencoba merubah password user dengan username ${theRealUsername}`,
                            colors.Reset);
                        const resultChangePassword = await InstaClient.changePassword(password, newPassword);

                        if (resultChangePassword.status && resultChangePassword.status == 'ok') {
                            console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgGreen,
                                `Sukses merubah password user dengan username ${theRealUsername}`,
                                colors.Reset);
                            console.log('')
                        } else {
                            console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgRed,
                                `Gagal merubah password user dengan username ${theRealUsername}`,
                                colors.Reset);
                            console.log('')
                        }
                    }

                }

                if (answers['index'] == 'Auto Change Username') {
                    console.log('');
                    console.log('')
                    for (let index = 0; index < akunListArray.length; index++) {
                        const akun = akunListArray[index];
                        const theRealUsername = akun.split('|')[0];
                        const password = akun.split('|')[1];

                        console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgGreen,
                            `mencoba login dengan username ${theRealUsername} dan password ${password}.`,
                            colors.Reset);
                        await InstaClient.login(theRealUsername, password);

                        console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgGreen,
                            `mencoba merubah username untuk username ${theRealUsername}`,
                            colors.Reset);

                        const username = readlineSync.question(`Masukan username baru untuk user ${theRealUsername} : `);

                        if (!username) {
                            console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.yellow,
                                `username harus diisi`,
                                colors.Reset);
                            continue;
                        }

                        const payload = {
                            username: username
                        }


                        const resultUpdateUsername = await InstaClient.updateProfile(payload);
                        if (resultUpdateUsername.status && !resultUpdateUsername.status == 'ok') {
                            console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgRed,
                                `gagal update username untuk username ${theRealUsername}`,
                                colors.Reset);
                            console.log("");
                            console.log("");
                        }

                        console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgGreen,
                            `sukses update username untuk username ${theRealUsername}`,
                            colors.Reset);
                    }

                }



            })
            .catch((e) => {
                console.log(e, "err")
            })





    } catch (e) {
        console.log(e)
    }
})();