const Insta = require('./lib/index.js');
const InstaClient = new Insta();
const readlineSync = require('readline-sync');
const moment = require('moment');
const colors = require("./lib/colors");
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const SMSActivate = require('sms-activate');
require('dotenv').config()
const sms = new SMSActivate(process.env.SMS_ACTIVATE_TOKEN);
const NodeCache = require('node-cache');
const delay = require('delay');
const myCache = new NodeCache();
const proxy = require('node-global-proxy').default;

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

const generateIndoName = () => new Promise((resolve, reject) => {
    fetch('https://swappery.site/data.php?qty=1', {
        method: 'GET'
    })
        .then(res => res.json())
        .then(res => {
            resolve(res)
        })
        .catch(err => {
            reject(err)
        })
});

const getSuggestionUsername = (headers, username, firstName) => new Promise((resolve, reject) => {
    headers['referer'] = 'https://www.instagram.com/accounts/signup/birthday';
    const dataString = `email=&username=${username}&first_name=${firstName}&opt_into_one_tap=false`;
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


const twoFac = (headers) => new Promise((resolve, reject) => {
    headers['referer'] = 'https://www.instagram.com/accounts/signup/phone';
    fetch('https://www.instagram.com/accounts/signup/twofac?__a=1', {
        method: 'GET',
        headers
    })
        .then(res => res.json())
        .then(res => {
            resolve(res)
        })
        .catch(err => {
            reject(err)
        })
});

const validatePhone = (headers, phoneNumber, otpCode) => new Promise((resolve, reject) => {
    headers['referer'] = 'https://www.instagram.com/accounts/signup/twofac';
    fetch('https://www.instagram.com/accounts/validate_signup_sms_code_ajax/', {
        method: 'POST',
        headers,
        body: `client_id=${headers.cookie.split('mid=')[1]}&phone_number=%2B${phoneNumber}&sms_code=${otpCode}`
    })
        .then(res => res.json())
        .then(res => {
            resolve(res)
        })
        .catch(err => {
            reject(err)
        })
});

const signupName = (headers) => new Promise((resolve, reject) => {
    headers['referer'] = 'https://www.instagram.com/accounts/signup/name';
    fetch('https://www.instagram.com/accounts/signup/name?__a=1', {
        method: 'GET',
        headers
    })
        .then(res => res.json())
        .then(res => {
            resolve(res)
        })
        .catch(err => {
            reject(err)
        })
});

const signupBirthday = (headers) => new Promise((resolve, reject) => {
    headers['referer'] = 'https://www.instagram.com/accounts/signup/birthday';
    fetch('https://www.instagram.com/accounts/signup/birthday?__a=1', {
        method: 'GET',
        headers
    })
        .then(res => res.json())
        .then(res => {
            resolve(res)
        })
        .catch(err => {
            reject(err)
        })
});

const signupUsername = (headers) => new Promise((resolve, reject) => {
    headers['referer'] = 'https://www.instagram.com/accounts/signup/username';
    fetch('https://www.instagram.com/accounts/signup/username?__a=1', {
        method: 'GET',
        headers
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
        // 

        const targetFollowData = readlineSync.question('target follow ex. amin_udin69,dada79 : ')

        while (true) {

            const password = process.env.DEFAULT_PASSWORD_IG_ACCOUNT;
            const imageLocation = 'images';
            const bioLocation = './bio.txt';
            const domain = 'gmailya.com';
            console.log("");
            const isNumberSessionAvailable = myCache.get('numberSession');


            if (!isNumberSessionAvailable) {
                const balance = await sms.getBalance();
                if (balance > 1) {
                    const { id, number } = await sms.getNumber('ig', 6);
                    await sms.setStatus(id, 1)
                    const phoneNumber = number;
                    console.log("");
                    const indoName = await generateIndoName();
                    const { result } = indoName;
                    const name = result[0].firstname.toLowerCase() + result[0].lastname.toLowerCase();
                    const username = name;
                    console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgGreen, `mencoba buat akun dengan username ${username} dan password ${password}`, colors.Reset)

                    //directory
                    const folderYangMauDiUpload = imageLocation

                    //joining path of directory
                    const directoryPath = path.join(__dirname, './' + folderYangMauDiUpload);
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
                        await twoFac(headers);
                        if (sendOtp.sms_sent) {

                            let otpCode1;
                            console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgGreen,
                                `Mencoba mengambil otp dari nomer ${phoneNumber}`,
                                colors.Reset);

                            console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgYellow,
                                `Menunggu Kode OTP!`,
                                colors.Reset);



                            myCache.set('dateStartedOtpCode1', moment().format());
                            myCache.set('dateEndOtpCode1', moment(myCache.get('dateStartedOtpCode1')).add(parseInt(process.env.TIME_DEFAULT_SENDOTP), 'seconds').format());
                            let repeatCountGetOtp = 0;
                            do {
                                if (myCache.get('dateStartedOtpCode1') > myCache.get('dateEndOtpCode1')) {
                                    if (repeatCountGetOtp <= 4) {
                                        repeatCountGetOtp++;
                                        myCache.del('dateStartedOtpCode1');
                                        myCache.del('dateEndOtpCode1');
                                        console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgYellow,
                                            `Mencoba mengirim OTP kembali.`,
                                            colors.Reset);
                                        const sendOtp = await InstaClient.registerSendOtp(phoneNumber);
                                        if (sendOtp.sms_sent) {
                                            console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgGreen,
                                                `Otp Terkirim!`,
                                                colors.Reset);
                                            console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgYellow,
                                                `Menunggu Kode OTP!`,
                                                colors.Reset);
                                        } else {

                                            console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgYellow,
                                                `Gagal mengirim OTP`,
                                                colors.Reset);
                                            otpCode1 = 'failedSend';
                                        }

                                        myCache.set('dateStartedOtpCode1', moment().format());
                                        myCache.set('dateEndOtpCode1', moment(myCache.get('dateStartedOtpCode1')).add(parseInt(process.env.TIME_DEFAULT_SENDOTP), 'seconds').format());
                                    } else {
                                        myCache.del('dateStartedOtpCode1');
                                        myCache.del('dateEndOtpCode1');
                                        otpCode1 = 'repeatMax';
                                    }

                                } else {
                                    myCache.del('dateStartedOtpCode1');
                                    myCache.set('dateStartedOtpCode1', moment().format());
                                    try {
                                        otpCode1 = await sms.getCode(id);
                                        if (otpCode1) {
                                            myCache.del('dateStartedOtpCode1');
                                            myCache.del('dateEndOtpCode1');
                                        }
                                    } catch (e) {
                                        otpCode1 = 'failedSend';
                                    }
                                }
                            } while (!otpCode1);

                            if (otpCode1 == 'failedSend') {

                                console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgRed,
                                    `Cancel order number, mencoba daftar menggunakan nomer lain.`,
                                    colors.Reset);
                                try {
                                    await sms.setStatus(id, 8)
                                } catch (error) {
                                    continue;
                                }
                                continue;
                            }

                            if (otpCode1 == 'repeatMax') {
                                console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgRed,
                                    `Cancel order number, mencoba daftar menggunakan nomer lain.`,
                                    colors.Reset);
                                try {
                                    await sms.setStatus(id, 8)
                                } catch (error) {
                                    continue;
                                }
                                continue;
                            }


                            if (otpCode1) {
                                console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgGreen,
                                    `Berhasil mendapatkan OTP ${otpCode1}`,
                                    colors.Reset);

                                const otpCode = otpCode1;
                                await validatePhone(headers, phoneNumber, otpCode);
                                await signupName(headers);
                                await signupBirthday(headers);
                                await signupUsername(headers)
                                const resultRegister = await InstaClient.registerLastProcess(otpCode);
                                if (resultRegister.account_created) {
                                    console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgGreen,
                                        `Akun berhasil dibuat dengan username ${theRealUsername} dan password ${password}`,
                                        colors.Reset);

                                    fs.appendFileSync('./userpass.txt', `${theRealUsername}|${password}\n`, 'utf8')

                                    console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgGreen,
                                        `mencoba login dengan username ${theRealUsername} dan password ${password} untuk update bio`,
                                        colors.Reset);
                                    try {
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



                                        const photo = path.join(__dirname, `./${imageLocation}/${imageName}`);

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
                                                    `Gagal update profile pic`,
                                                    colors.Reset);
                                            }
                                        } catch (error) {
                                            console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgRed,
                                                `Gagal update profile pic`,
                                                colors.Reset);
                                        }


                                        const caption = bioArray[Math.floor(Math.random() * bioArray.length)];
                                        console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgGreen,
                                            `Mencoba add post....`,
                                            colors.Reset);

                                        try {
                                            const imageNamePost = listPath.filter(x => x.includes('jpeg'))[Math.floor(Math.random() * listPath.length)];
                                            const photoPost = path.join(__dirname, `./${imageLocation}/${imageNamePost}`);

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
                                        } catch (error) {
                                            console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgRed,
                                                `gagal add post, silahkan coba add post manual untuk user ${theRealUsername}`,
                                                colors.Reset);
                                            console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgYellow,
                                                `Lanjut ke proses selanjutnya...`,
                                                colors.Reset);
                                        }




                                        const listProsesOrders = targetFollowData.includes(',') ? targetFollowData.split(',') : [targetFollowData]
                                        for (let index = 0; index < listProsesOrders.length; index++) {
                                            const element = listProsesOrders[index];
                                            let targetFollow = element;
                                            const newI = index + 1;

                                            let doneFollowProcess = false;
                                            let breakStatus = false;
                                            let retryCount = 0;
                                            let retryCountNoCatch = 0;

                                            do {
                                                try {
                                                    const follow = await InstaClient.followByUsername(targetFollow);
                                                    if (follow.status && follow.status == 'ok') {

                                                        console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgGreen,
                                                            `${newI}. Sukses Follow IG ${targetFollow}`,
                                                            colors.Reset);

                                                        doneFollowProcess = true;
                                                    } else {
                                                        retryCountNoCatch++
                                                        if (retryCountNoCatch <= 2) {
                                                            console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgYellow,
                                                                `Gagal Follow IG ${targetFollow}, sedang kita coba kembali...`,
                                                                colors.Reset);
                                                            await delay(5000);
                                                        } else {
                                                            console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgRed,
                                                                `${newI}. Gagal Follow IG ${targetFollow}, Reason : ${follow.message}`,
                                                                colors.Reset);
                                                            doneFollowProcess = true;
                                                            breakStatus = true;
                                                        }
                                                    }
                                                } catch (error) {
                                                    console.log(error)
                                                    retryCount++
                                                    if (retryCount <= 2) {
                                                        console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgYellow,
                                                            `Gagal Follow IG ${targetFollow}, sedang kita coba kembali...`,
                                                            colors.Reset);
                                                        await delay(5000);
                                                    } else {
                                                        console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgYellow,
                                                            `Waktu retry follow habis, lanjut ke next proses...`,
                                                            colors.Reset);
                                                        doneFollowProcess = true;
                                                        breakStatus = true;
                                                    }

                                                }
                                            } while (!doneFollowProcess);

                                            if (breakStatus) {
                                                break;
                                            }


                                        }



                                        console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgGreen,
                                            `Semua proses selesai.`,
                                            colors.Reset);

                                        myCache.set('numberSession', {
                                            number,
                                            id,
                                            succesRegisterCount: 1
                                        });

                                        // }


                                    } catch (e) {
                                        console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgRed,
                                            `ada masalah : ${e}`,
                                            colors.Reset);

                                        console.log("");
                                        console.log("");
                                    }

                                } else {

                                    console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgRed,
                                        `Akun gagal dibuat.`,
                                        colors.Reset);
                                    console.log("");
                                    console.log("");
                                }
                            } else {

                                console.log('Tidak Mendapatkan OTP');
                                console.log("");
                                console.log("");
                            }
                        } else {
                            await sms.setStatus(id, 8);
                            console.log(
                                "[" +
                                " " +
                                moment().format("HH:mm:ss") +
                                " " +
                                "]" +
                                "  " +
                                colors.FgYellow,
                                "Message : Failed Send Otp!",
                                colors.Reset
                            );

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
                            colors.FgRed,
                            "Message : username include character not allowed for register",
                            colors.Reset
                        );
                        console.log("");
                        console.log("");
                    }
                } else {

                    console.log('You don\'t have enough money');
                    break;
                }
            } else {
                const balance = await sms.getBalance();
                if (balance > 1) {
                    const { id, number, succesRegisterCount } = await myCache.get('numberSession');
                    const phoneNumber = number;
                    console.log("");
                    const indoName = await generateIndoName();
                    const { result } = indoName;
                    const name = result[0].firstname.toLowerCase() + result[0].lastname.toLowerCase();
                    const username = name;
                    console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgGreen, `mencoba buat akun dengan username ${username} dan password ${password}`, colors.Reset)

                    //directory
                    const folderYangMauDiUpload = imageLocation

                    //joining path of directory
                    const directoryPath = path.join(__dirname, './' + folderYangMauDiUpload);
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

                        let doneRetry = false;
                        let retrySetStatusCount = 0;
                        let retrySetStatusBreak = false;

                        do {
                            try {
                                await sms.setStatus(id, 3);
                                doneRetry = true;
                            } catch (error) {
                                console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgMagenta, `Retry code failed, kita coba kembali...`, colors.Reset);
                                retrySetStatusCount++
                                if (retrySetStatusCount >= 3) {
                                    doneRetry = true;
                                    retrySetStatusBreak = true;
                                }

                            }
                        } while (!doneRetry);

                        if (retrySetStatusBreak) {
                            console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgRed, `Tidak bisa mendaftar menggunakan nomer ${number} lagi, dikarenakan ada masalah ketika set status ke retry di sms-activate`, colors.Reset);
                            console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgGreen, `Mengambil nomer baru....`, colors.Reset);
                            myCache.del('numberSession');

                            try {
                                await sms.setStatus(id, 6);
                            } catch (error) {
                                continue;
                            }
                            continue;
                        }

                        const theRealUsername = suggestionName.username;
                        await InstaClient.registerLastAttemp(phoneNumber, theRealUsername, password, name);
                        const sendOtp = await InstaClient.registerSendOtp(phoneNumber);
                        if (sendOtp.sms_sent) {

                            let otpCode1;
                            console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgGreen,
                                `Mencoba mengambil otp dari nomer ${phoneNumber}`,
                                colors.Reset);

                            console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgYellow,
                                `Menunggu Kode OTP!`,
                                colors.Reset);



                            myCache.set('dateStartedOtpCode1', moment().format());
                            myCache.set('dateEndOtpCode1', moment(myCache.get('dateStartedOtpCode1')).add(parseInt(process.env.TIME_DEFAULT_SENDOTP), 'seconds').format());
                            let repeatCountGetOtp = 0;
                            do {
                                if (myCache.get('dateStartedOtpCode1') > myCache.get('dateEndOtpCode1')) {
                                    if (repeatCountGetOtp <= 4) {
                                        repeatCountGetOtp++;
                                        myCache.del('dateStartedOtpCode1');
                                        myCache.del('dateEndOtpCode1');
                                        console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgYellow,
                                            `Mencoba mengirim OTP kembali.`,
                                            colors.Reset);
                                        const sendOtp = await InstaClient.registerSendOtp(phoneNumber);
                                        if (sendOtp.sms_sent) {
                                            console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgGreen,
                                                `Otp Terkirim!`,
                                                colors.Reset);
                                            console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgYellow,
                                                `Menunggu Kode OTP!`,
                                                colors.Reset);
                                        } else {

                                            console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgYellow,
                                                `Gagal mengirim OTP`,
                                                colors.Reset);
                                            otpCode1 = 'failedSend';
                                        }

                                        myCache.set('dateStartedOtpCode1', moment().format());
                                        myCache.set('dateEndOtpCode1', moment(myCache.get('dateStartedOtpCode1')).add(parseInt(process.env.TIME_DEFAULT_SENDOTP), 'seconds').format());
                                    } else {
                                        myCache.del('dateStartedOtpCode1');
                                        myCache.del('dateEndOtpCode1');
                                        otpCode1 = 'repeatMax';
                                    }

                                } else {
                                    myCache.del('dateStartedOtpCode1');
                                    myCache.set('dateStartedOtpCode1', moment().format());


                                    try {
                                        otpCode1 = await sms.getCode(id);
                                        if (otpCode1) {
                                            myCache.del('dateStartedOtpCode1');
                                            myCache.del('dateEndOtpCode1');
                                            if (succesRegisterCount >= 4) {
                                                await sms.setStatus(id, 6);
                                            }

                                        }
                                    } catch (e) {
                                        otpCode1 = 'failedSend';
                                    }
                                }
                            } while (!otpCode1);

                            if (otpCode1 == 'failedSend') {
                                console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgRed,
                                    `Failed send OTP, coba mengirim ulang kembali....`,
                                    colors.Reset);

                                continue;
                            }

                            if (otpCode1 == 'repeatMax') {
                                console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgRed,
                                    `Terlalu lama menunggu OTP, kita coba kembali...`,
                                    colors.Reset);

                                continue;
                            }


                            if (otpCode1) {
                                console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgGreen,
                                    `Berhasil mendapatkan OTP ${otpCode1}`,
                                    colors.Reset);

                                const otpCode = otpCode1;
                                const resultRegister = await InstaClient.registerLastProcess(otpCode);
                                if (resultRegister.account_created) {
                                    console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgGreen,
                                        `Akun berhasil dibuat dengan username ${theRealUsername} dan password ${password}`,
                                        colors.Reset);

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



                                        const photo = path.join(__dirname, `./${imageLocation}/${imageName}`);

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
                                                    `Gagal update profile pic`,
                                                    colors.Reset);
                                            }
                                        } catch (error) {
                                            console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgRed,
                                                `Gagal update profile pic`,
                                                colors.Reset);
                                        }

                                        const caption = bioArray[Math.floor(Math.random() * bioArray.length)];
                                        console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgGreen,
                                            `Mencoba add post....`,
                                            colors.Reset);

                                        try {
                                            const imageNamePost = listPath.filter(x => x.includes('jpeg'))[Math.floor(Math.random() * listPath.length)];
                                            const photoPost = path.join(__dirname, `./${imageLocation}/${imageNamePost}`);

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
                                        } catch (error) {
                                            console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgRed,
                                                `gagal add post, silahkan coba add post manual untuk user ${theRealUsername}`,
                                                colors.Reset);
                                            console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgYellow,
                                                `Lanjut ke proses selanjutnya...`,
                                                colors.Reset);
                                        }




                                        const listProsesOrders = targetFollowData.includes(',') ? targetFollowData.split(',') : [targetFollowData]
                                        for (let index = 0; index < listProsesOrders.length; index++) {
                                            const element = listProsesOrders[index];
                                            let targetFollow = element;
                                            const newI = index + 1;

                                            let doneFollowProcess = false;
                                            let breakStatus = false;
                                            let retryCount = 0;
                                            let retryCountNoCatch = 0;

                                            do {
                                                try {
                                                    const follow = await InstaClient.followByUsername(targetFollow);
                                                    if (follow.status && follow.status == 'ok') {
                                                        console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgGreen,
                                                            `${newI}. Sukses Follow IG ${targetFollow}`,
                                                            colors.Reset);

                                                        doneFollowProcess = true;
                                                    } else {
                                                        retryCountNoCatch++
                                                        if (retryCountNoCatch <= 2) {
                                                            console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgYellow,
                                                                `Gagal Follow IG ${targetFollow}, sedang kita coba kembali...`,
                                                                colors.Reset);
                                                            await delay(5000);
                                                        } else {
                                                            console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgRed,
                                                                `${newI}. Gagal Follow IG ${targetFollow}, Reason : ${follow.message}`,
                                                                colors.Reset);
                                                            doneFollowProcess = true;
                                                            breakStatus = true;
                                                        }
                                                    }
                                                } catch (error) {
                                                    retryCount++
                                                    if (retryCount <= 2) {
                                                        console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgYellow,
                                                            `Gagal Follow IG ${targetFollow}, sedang kita coba kembali...`,
                                                            colors.Reset);
                                                        await delay(5000);
                                                    } else {
                                                        console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgYellow,
                                                            `Waktu retry follow habis, lanjut ke next proses...`,
                                                            colors.Reset);
                                                        doneFollowProcess = true;
                                                        breakStatus = true;
                                                    }

                                                }
                                            } while (!doneFollowProcess);

                                            if (breakStatus) {
                                                break;
                                            }


                                        }





                                        console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgGreen,
                                            `Semua proses selesai.`,
                                            colors.Reset);


                                        if (succesRegisterCount <= 4) {
                                            myCache.set('numberSession', {
                                                number,
                                                id,
                                                succesRegisterCount: parseInt(succesRegisterCount) + 1
                                            });
                                        } else {
                                            myCache.del('numberSession');
                                        }


                                    } catch (e) {

                                        console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgRed,
                                            `ada masalah : ${e}`,
                                            colors.Reset);
                                        console.log("");
                                        console.log("");
                                    }

                                } else {

                                    console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgRed,
                                        `Akun gagal dibuat.`,
                                        colors.Reset);
                                    console.log("");
                                    console.log("");
                                }
                            } else {

                                console.log('Tidak Mendapatkan OTP');
                                console.log("");
                                console.log("");
                            }
                        } else {
                            await sms.setStatus(id, 8);
                            console.log(
                                "[" +
                                " " +
                                moment().format("HH:mm:ss") +
                                " " +
                                "]" +
                                "  " +
                                colors.FgYellow,
                                "Message : Failed Send Otp!",
                                colors.Reset
                            );

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
                } else {

                    console.log('You don\'t have enough money');
                    break;
                }
            }


        }




    } catch (e) {

        console.log(e)
    }
})();