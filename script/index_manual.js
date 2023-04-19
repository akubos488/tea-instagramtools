const Insta = require('../lib/index.js');
const InstaClient = new Insta();
const readlineSync = require('readline-sync');
const moment = require('moment');
const colors = require("../lib/colors");
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const { faker } = require('@faker-js/faker');

const randstr = length =>
    new Promise((resolve, reject) => {
        var text = "";
        var possible =
            "abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";

        for (var i = 0; i < length; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        resolve(text);
    });

const genUniqueId = length =>
    new Promise((resolve, reject) => {
        var text = "";
        var possible =
            "1234567890";

        for (var i = 0; i < length; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        resolve(text);
    });

const generateIndoName = () => {
    const randomName = faker.name.findName().toLowerCase();
    const random1 = faker.word.adjective().toLowerCase();
    const random2 = faker.word.adverb().toLowerCase();
    return {
        result: [
            {
                firstname: random2.replace(/\s/g, ""),
                lastname: randomName.replace(/\s/g, "")
            }
        ]
    }
};

const getSuggestionUsername = (headers, username, firstName) => new Promise((resolve, reject) => {
    const dataString = `email=${username}%40gmail.com&username=${username}&first_name=${firstName}&opt_into_one_tap=false`;
    fetch('https://www.instagram.com/accounts/web_create_ajax/attempt/', {
        method: 'POST',
        headers,
        body: dataString
    })
        .then(res => res.json())
        .then(res => {
            resolve(res)
        })
        .catch(err => {
            reject(err)
        })
});


function getString(start, end, all) {
    const regex = new RegExp(`${start}(.*?)${end}`);
    const str = all
    const result = regex.exec(str);
    return result;
}



const functionGetToken = (email, domain) => new Promise((resolve, reject) => {
    fetch(`https://generator.email/${domain}/${email}`, {
        method: "get",
        headers: {
            accept:
                "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
            "accept-encoding": "gzip, deflate, br",
            cookie: `_ga=GA1.2.659238676.1567004853; _gid=GA1.2.273162863.1569757277; embx=%5B%22${email}%40${domain}%22%2C%22hcycl%40nongzaa.tk%22%5D; _gat=1; io=io=tIcarRGNgwqgtn40O${randstr(3)}; surl=${domain}%2F${email}`,
            "upgrade-insecure-requests": 1,
            "user-agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36"
        }
    })
        .then(res => res.text())
        .then(text => {
            const instagramLinkConfirmation = getString('<div id="email-table"><a href="', '"', text);
            resolve(instagramLinkConfirmation);
        })
        .catch(err => reject(err));
});

const functionGetEmail = (email, token, domain) => new Promise((resolve, reject) => {
    fetch(`https://generator.email/${email}/${token}`, {
        method: "get",
        headers: {
            accept:
                "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
            "accept-encoding": "gzip, deflate, br",
            cookie: `_ga=GA1.2.659238676.1567004853; _gid=GA1.2.273162863.1569757277; embx=%5B%22${email}%40${domain}%22%2C%22hcycl%40nongzaa.tk%22%5D; _gat=1; io=io=tIcarRGNgwqgtn40O${randstr(3)}; surl=${domain}%2F${email}%2F${token}`,
            "upgrade-insecure-requests": 1,
            "user-agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36"
        }
    })
        .then(res => res.text())
        .then(text => {
            const instagramLinkConfirmation = getString('<a href="https://instagram.com/accounts/confirm_email/', '"', text);
            resolve(instagramLinkConfirmation);
        })
        .catch(err => reject(err));
});


const veryfEmail = (headers, url) => new Promise((resolve, reject) => {
    fetch(url, {
        method: 'GET',
        headers
    })
        .then(res => res.text())
        .then(res => {
            resolve(res)
        })
        .catch(err => {
            reject(err)
        })
});


(async () => {
    try {
        const phoneNumber = readlineSync.question('phone number : ')
        const password = readlineSync.question('masukan password : ')
        const imageLocation = 'images';
        const bioLocation = './bio.txt';
        const domain = 'gmailwe.com';
        const targetFollow = readlineSync.question('taget follow ex. amin_udin69 : ')
        console.log("");
        const indoName = await generateIndoName();
        const { result } = indoName;
        const name = result[0].firstname.toLowerCase() + result[0].lastname.toLowerCase()
        const uniqId = await genUniqueId(1);
        const username = name;
        console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgGreen, `mencoba buat akun dengan username ${username} dan password ${password}`, colors.Reset)

        //directory
        const folderYangMauDiUpload = imageLocation

        //joining path of directory
        const directoryPath = path.join(__dirname, '../' + folderYangMauDiUpload);
        const getPath = await fs.readdirSync(directoryPath);
        const listPath = [];
        getPath.map(file => {
            listPath.push(file);

        })

        const imageName = listPath[Math.floor(Math.random() * listPath.length)];

        const bioFile = await fs.readFileSync(bioLocation, 'utf-8');
        const bioArray = bioFile.toString().split("\n");
        const bioFinal = bioArray[Math.floor(Math.random() * bioArray.length)];

        if (!username.includes("-")) {
            const headers = await InstaClient.getCookie();
            let suggestionName = await getSuggestionUsername(headers, username, result[0].firstname.toLowerCase());

            if (suggestionName.errors.hasOwnProperty('username')) {
                console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgGreen, `username ${username} tidak tersedia, mencoba salah satu dari ${suggestionName.username_suggestions.join(',')}`, colors.Reset);
                suggestionName = {
                    ...suggestionName,
                    username: suggestionName.username_suggestions[Math.floor(Math.random() * suggestionName.username_suggestions.length)]
                }
            } else {
                console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgGreen, `username ${username} tersedia.`, colors.Reset)
                suggestionName = {
                    ...suggestionName,
                    username
                }
            }

            const theRealUsername = suggestionName.username;
            await InstaClient.registerLastAttemp(phoneNumber, theRealUsername, password, name);
            const sendOtp = await InstaClient.registerSendOtp(phoneNumber);
            if (sendOtp.sms_sent) {
                const otpCode = readlineSync.question('masukan kode otp : ');
                const resultRegister = await InstaClient.registerLastProcess(otpCode);
                if (resultRegister.account_created) {
                    console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgGreen,
                        `Akun berhasil dibuat dengan username ${theRealUsername} dan password ${password}`,
                        colors.Reset)

                    fs.appendFileSync('./userpass.txt', `${theRealUsername}|${password}\n`, 'utf8')

                    console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgGreen,
                        `mencoba login dengan username ${theRealUsername} dan password ${password} untuk update bio`,
                        colors.Reset);
                    try {
                        await InstaClient.login(theRealUsername, password);
                        const payload = {
                            biography: bioFinal,
                            email: `${theRealUsername}@${domain}`
                        }

                        try {
                            const resultUpdateBio = await InstaClient.updateProfile(payload);
                            console.log(resultUpdateBio)
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





                        const photo = path.join(__dirname, `../${imageLocation}/${imageName}`);

                        console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgGreen,
                            `update profile picture untuk username ${theRealUsername}`,
                            colors.Reset);
                        try {
                            const changeImageResult = await InstaClient.changeProfileImage(photo);

                            if (changeImageResult.changed_profile) {
                                console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgGreen,
                                    `sukses update profile pic`,
                                    colors.Reset);

                            } else {
                                console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgRed,
                                    `gagal update profile pic`,
                                    colors.Reset);
                            }
                        } catch (e) {
                            console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgRed,
                                `gagal update profile pic`,
                                colors.Reset);
                        }

                        console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgGreen,
                            `Mencoba follow username ${targetFollow}`,
                            colors.Reset);

                       try{
                        const follow = await InstaClient.followByUsername(targetFollow);
                        if (follow.status && follow.status == 'ok') {
                            console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgGreen,
                                `Sukses follow username ${targetFollow}`,
                                colors.Reset);


                        } else {
                            console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgRed,
                                `gagal follow username ${targetFollow}`,
                                colors.Reset);
                        }
                       }catch(e){
                        console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgRed,
                        `gagal follow`,
                        colors.Reset);
                       }

                        const caption = bioArray[Math.floor(Math.random() * bioArray.length)];
                        console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgGreen,
                            `Mencoba add post....`,
                            colors.Reset);

                        const imageNamePost = listPath.filter(x => x.includes('jpeg'))[Math.floor(Math.random() * listPath.length)];
                        const photoPost = path.join(__dirname, `../${imageLocation}/${imageNamePost}`);

                        try {
                            const resultAddPost = await InstaClient.addPost(photoPost, caption);
                            if (resultAddPost.status && resultAddPost.status == 'ok') {
                                console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgGreen,
                                    `Sukses add post.`,
                                    colors.Reset);
                            } else {
                                console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgRed,
                                    `gagal add post, silahkan coba add post manual untuk user ${theRealUsername}`,
                                    colors.Reset);
                            }
                        } catch (e) {
                            console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgRed,
                                `gagal add post, silahkan coba add post manual untuk user ${theRealUsername}`,
                                colors.Reset);
                        }


                    } catch (e) {
                        console.log(e)
                        console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgRed,
                            `ada masalah : ${e}`,
                            colors.Reset);
                        console.log("");
                        console.log("");
                    }

                } else {
                    console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgRed,
                        `Akun gagal dibuat.`,
                        colors.Reset)
                    console.log(resultRegister)
                    console.log("");
                    console.log("");
                }
            } else {
                console.log('Failed Send Otp.');
                console.log("");
                console.log("");
            }
        } else {
            console.log(
                "[" +
                " " +
                moment().format("HH:mm:ss") +
                " " +
                "]" +
                " " +
                "=>" +
                " " +
                colors.FgRed,
                "Message : username include character not allowed for register",
                colors.Reset
            );
            console.log("");
            console.log("");
        }
    } catch (e) {
        console.log(e)
    }
})();