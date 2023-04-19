const inquirer = require('inquirer');
const colors = require("./lib/colors");


(async () => {
    console.log(colors.FgGreen, `
    
    ========= Instagram Tools =========
    
    `, colors.Reset)
    console.log('')
    inquirer.prompt(
        [
            {
                type: "list",
                name: "index",
                message: 'Pilih script yang akan di jalankan',
                choices: [
                    'index_manual.js',
                    {
                        name: 'Auto Create Instagram Account',
                        disabled: 'Manual OTP',
                    },
                    'index_set_gender_proxy.js',
                    {
                        name: 'Auto Create Instagram Account',
                        disabled: 'Auto OTP + Set Gender + Proxy',
                    },
                    'index_smsactivate.js',
                    {
                        name: 'Auto Create Instagram Account',
                        disabled: 'Auto OTP From sms-activate.ru',
                    },
                    'index_smsactivate_proxy.js',
                    {
                        name: 'Auto Create Instagram Account + proxy',
                        disabled: 'Auto OTP From sms-activate.ru',
                    },
                    'index_smshub_proxy.js',
                    {
                        name: 'Auto Create Instagram Account + proxy',
                        disabled: 'Auto OTP From smshub.org',
                    },
                    'index_autoproses.js',
                    {
                        name: 'Auto Process Instagram Account',
                        disabled: 'Auto update profile pic, update BIO ,add POST and etc.',
                    },
                    'index_autofollow.js',
                    {
                        name: 'Auto Follow Instagram Account',
                        disabled: 'Auto Follow from akunlist.txt',
                    },
                    'auto_change_pass.js',
                    {
                        name: 'Mass Auto Change Pass',
                        disabled: 'Mass auto change pass',
                    }
                ]
            }
        ])
        .then(answers => {
            console.log('')

            switch (answers['index']) {
                case 'index_autoproses.js':
                    console.log(colors.FgGreen, `
    
    
                    Auto Proses Instagram Account
    
    `, colors.Reset)
                    require('child_process').fork(`./script/${answers['index']}`);
                    break;
                case 'index_set_gender_proxy.js':
                    console.log(colors.FgGreen, `
        
        
     Auto Create Instagram Account ( Auto OTP + Set Gender + Proxy )
        
        `, colors.Reset)
                    require('child_process').fork(`./script/${answers['index']}`);
                    break;
                case 'index_smsactivate.js':
                    console.log(colors.FgGreen, `
        
        
     Auto Create Instagram Account ( Auto OTP Sms Activate )
        
        `, colors.Reset)
                    require('child_process').fork(`./script/${answers['index']}`);
                    break;
                case 'index_smsactivate_proxy.js':
                    console.log(colors.FgGreen, `
            
            
         Auto Create Instagram Account 
            
            `, colors.Reset)
                    require('child_process').fork(`./script/${answers['index']}`);
                    break;
                case 'index_smshub_proxy.js':
                    console.log(colors.FgGreen, `
                
                
             Auto Create Instagram Account ( Auto OTP Smshub + proxy )
                
                `, colors.Reset)
                    require('child_process').fork(`./script/${answers['index']}`);
                    break;
                case 'index_manual.js':
                    console.log(colors.FgGreen, `
            
            
            Auto Create Instagram Account ( Manual Otp )
            
            `, colors.Reset)
                    require('child_process').fork(`./script/${answers['index']}`);
                    break;
                case 'index_autofollow.js':
                    console.log(colors.FgGreen, `
                    
                    
            Auto Follow Instagram Account (̷ Auto Follow from akunlist.txt )̷
                    
                    `, colors.Reset)
                    require('child_process').fork(`./script/${answers['index']}`);
                    break;
                case 'auto_change_pass.js':
                    console.log(colors.FgGreen, `
                    
                    
            Mass Auto Change Password
                    
                    `, colors.Reset)
                    require('child_process').fork(`./script/${answers['index']}`);
                    break;
                default:
                    break;
            }

        })
        .catch((e) => {
            console.log(e, "err")
        })
})();