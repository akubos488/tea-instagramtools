const Insta = require('../lib/index.js');
const InstaClient = new Insta();
const readlineSync = require('readline-sync');
const moment = require('moment');
const colors = require("../lib/colors");
const fs = require('fs');

(async () => {
    // try {
        console.log('');
        const newPassword = readlineSync.question('Masukan password baru : ');
        const choice = readlineSync.question('Pilih mode (masal/single) : ');

        if (!newPassword || !choice) {
            console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgRed,
            `Pastikan semua pertanyaan diisi.`,
            colors.Reset);
            process.exit(0);
        }

        console.log('')
        let akunListArray = [];

        if (choice == 'masal') {
            const fileNameAccount = readlineSync.question('Masukan nama file lokasi akun (ex. akunlist.txt) : ');

            let accountListLocation = fileNameAccount;
            let akunList = await fs.readFileSync('./'+accountListLocation, 'utf-8');
            akunListArray = akunList.toString().split("\n");
        }else if(choice == 'single'){
            const username = readlineSync.question('Masukan username : ');
            const password = readlineSync.question('Masukan password : ');
            akunListArray.push(`${username}|${password}`)

        }else{
            console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgRed,
            `Tidak ada mode tersebut.`,
            colors.Reset);
            process.exit(0);
        }


        

        for (let index = 0; index < akunListArray.length; index++) {
            const akun = akunListArray[index];
            const theRealUsername = akun.split('|')[0];
            const password = akun.split('|')[1];
            try{
                
    
                console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgGreen,
                    `mencoba login dengan username ${theRealUsername} dan password ${password}.`,
                    colors.Reset);
                const loginResult = await InstaClient.login(theRealUsername, password);
                if (loginResult.status && loginResult.status == 'fail') {
                    console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgRed,
            `Ada masalah saat login dengan username ${theRealUsername} : ${loginResult.message}`,
            colors.Reset);
            console.log('')
                }else{
                    console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgGreen,
                    `mencoba merubah password user dengan username ${theRealUsername}`,
                    colors.Reset);
                const resultChangePassword = await InstaClient.changePassword(password, newPassword);
                if (resultChangePassword.status && resultChangePassword.status == 'ok') {
                    console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgGreen,
                        `Sukses merubah password user dengan username ${theRealUsername}`,
                        colors.Reset);

                    const indexArrayAkun = akunListArray.indexOf(akun);
                    if (indexArrayAkun > -1) {
                        akunListArray.splice(indexArrayAkun, 1);
                    }
                        
                    await fs.writeFileSync(accountListLocation, akunListArray.join('\n'), 'utf-8');
                    await fs.appendFileSync(accountListLocation.split('.')[0]+'_changed.txt', theRealUsername+'|'+newPassword+'\n', 'utf-8');
                    console.log('')
                } else {
                    console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgRed,
                        `Gagal merubah password user dengan username ${theRealUsername}`,
                        colors.Reset);
                    console.log('')
                }
                }
                
            }catch(e){
                console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgRed,
            `Ada masalah lain`,
            colors.Reset);
            console.log('')
            }
            
        }



    // } catch (e) {
    //     console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgRed,
    //         `ada masalah lain.`,
    //         colors.Reset);
    // }
})();