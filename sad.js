
const colors = require("./lib/colors");
const readlineSync = require('readline-sync');

(async () => {
    console.log(colors.FgGreen, `
    
    ========= Instagram Tools =========
    
    `, colors.Reset)
    console.log('')
    const menu = [
        {
            name: 'Auto Create Instagram Account',
            disabled: 'Manual OTP',
            menu: 'index_manual.js'
        },
        {
            name: 'Auto Create Instagram Account',
            disabled: 'Auto OTP From sms-activate.ru',
            menu: 'index_smsactivate.js'
        },
        {
            name: 'Auto Create Instagram Account + proxy',
            disabled: 'Auto OTP From sms-activate.ru',
            menu: 'index_smsactivate_proxy.js'
        },
        {
            name: 'Auto Process Instagram Account',
            disabled: 'Auto update profile pic, update BIO ,add POST and etc.',
            menu: 'index_autoproses.js'
        },
        {
            name: 'Auto Follow Instagram Account',
            disabled: 'Auto Follow from akunlist.txt',
            menu: 'index_autofollow.js'
        },
        {
            name: 'Mass Auto Change Pass',
            disabled: 'Mass auto change pass',
            menu: 'auto_change_pass.js'
        }
    ];

    



    for (let index = 0; index < menu.length; index++) {
        console.log(`${index+1} ${menu[index].name}(${menu[index].disabled})`)
    }

    console.log('')


    const menuData = await readlineSync.question('Pilih Menu > ');

    const dataMenu = menu[parseInt(menuData)-1];

    console.log('')
    switch (dataMenu.menu) {
        case 'index_autoproses.js':
            console.log(colors.FgGreen, `
    
    
                    Auto Proses Instagram Account
    
    `, colors.Reset)
            require('child_process').fork(`./script/${dataMenu.menu}`);
            break;
        case 'index_smsactivate.js':
            console.log(colors.FgGreen, `
        
        
     Auto Create Instagram Account ( Auto OTP Sms Activate )
        
        `, colors.Reset)
            require('child_process').fork(`./script/${dataMenu.menu}`);
            break;
        case 'index_smsactivate_proxy.js':
            console.log(colors.FgGreen, `
            
            
         Auto Create Instagram Account ( Auto OTP Sms Activate + proxy )
            
            `, colors.Reset)
            require('child_process').fork(`./script/${dataMenu.menu}`);
            break;
        case 'index_manual.js':
            console.log(colors.FgGreen, `
            
            
            Auto Create Instagram Account ( Manual Otp )
            
            `, colors.Reset)
            require('child_process').fork(`./script/${dataMenu.menu}`);
            break;
        case 'index_autofollow.js':
            console.log(colors.FgGreen, `
                    
                    
            Auto Follow Instagram Account (̷ Auto Follow from akunlist.txt )̷
                    
                    `, colors.Reset)
            require('child_process').fork(`./script/${dataMenu.menu}`);
            break;
        case 'auto_change_pass.js':
            console.log(colors.FgGreen, `
                    
                    
            Mass Auto Change Password
                    
                    `, colors.Reset)
            require('child_process').fork(`./script/${dataMenu.menu}`);
            break;
        default:
            break;
    }
})();