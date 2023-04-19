const Insta = require('../lib/index.js');
const InstaClient = new Insta();
const readlineSync = require('readline-sync');
const moment = require('moment');
const colors = require("../lib/colors");
const fs = require('fs');
const path = require('path');


(async () => {
    try {
        const accountListLocation = './akunlist.txt';
        let targetFollow = readlineSync.question('taget follow (amin_udin69,amin1,amin2) : ')
        console.log("");

        if (targetFollow.includes(',')) {
            targetFollow = targetFollow.split(',');
        } else {
            targetFollow = [targetFollow];
        }

        if (targetFollow.length === 0) {
            console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgRed,
                `silahkan isi`,
                colors.Reset);
        }


        const akunList = await fs.readFileSync(accountListLocation, 'utf-8');
        const akunListArray = akunList.toString().split("\n");

        for (let index = 0; index < akunListArray.length; index++) {
            const akun = akunListArray[index];
            const theRealUsername = akun.split('|')[0];
            const password = akun.split('|')[1];

            console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgGreen,
                `mencoba login dengan username ${theRealUsername} dan password ${password}.`,
                colors.Reset);
            await InstaClient.login(theRealUsername, password);

            for (let j = 0; j < targetFollow.length; j++) {
                const usernameForFollow = targetFollow[j];

                console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgGreen,
                    `Mencoba follow username ${usernameForFollow}`,
                    colors.Reset);

                const follow = await InstaClient.followByUsername(usernameForFollow);
                if (follow.status && follow.status == 'ok') {
                    console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgGreen,
                        `Sukses follow username ${usernameForFollow}`,
                        colors.Reset)

                } else {
                    console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgRed,
                        `gagal follow username ${usernameForFollow}`,
                        colors.Reset);

                }

            }
            console.log('')


        }


    } catch (e) {
        console.log(e)
    }
})();