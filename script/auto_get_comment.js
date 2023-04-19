const Insta = require('../lib/index.js');
const InstaClient = new Insta();
const fs = require('fs');
const colors = require('../lib/colors');
const fetch = require('node-fetch');
const readlineSync = require('readline-sync');
const moment = require('moment');
const chalk = require('chalk');
const delay = require('delay');



(async () => {
    const commentLinkFile = fs.readFileSync('./linkcomment.txt', 'utf-8');
    const commentLinkArray = commentLinkFile.split('\n');

    try {
        await InstaClient.login('makiratest1', 'Coegsekali1');
        // await InstaClient.useExistingCookie();
        // await InstaClient.getCookie();
        console.log('')
        for (let index = 0; index < commentLinkArray.length; index++) {
            const linkComment = commentLinkArray[index];

            console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgGreen,
                        `Get comment from url => ${linkComment}`,
                        colors.Reset);
            const shortCode = linkComment.split('/')[4];
            console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgGreen,
            `Shortcode => ${shortCode}`,
            colors.Reset);
            
            
            const commentSharedData = await InstaClient.getFirstComment(shortCode);

            console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgGreen,
            `Waiting, getting comment process...`,
            colors.Reset);

            if (commentSharedData.edges.length >=1) {
                for (let index = 0; index < commentSharedData.edges.length; index++) {
                    const element = commentSharedData.edges[index];
                    fs.appendFileSync('username_result.txt', element.node.owner.username+'\n');

                }
            }
            let allComent;
            let hasNextPage = commentSharedData.page_info.has_next_page;
            let endCursor = commentSharedData.page_info.end_cursor;
            firstCount = 12;
            tryCount = 0;
            do {
                if (hasNextPage) {
                    try{
                        allComent = await InstaClient.getAllComment(linkComment.split('/')[4], 12, endCursor);
                        if (allComent) {
                            hasNextPage = allComent.page_info.has_next_page;
                            endCursor = allComent.page_info.end_cursor;
                            for (let index = 0; index < allComent.edges.length; index++) {
                                const element = allComent.edges[index];
                                fs.appendFileSync('username_result.txt', element.node.owner.username+'\n');
    
                            }
                        }else{
                            hasNextPage=false
                        }
                    }catch(e){
                        hasNextPage=true
                        tryCount = tryCount+1;
                        await delay(5000)
                        console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgYellow,
                `Whoops error, delayed 5 second before try again...`,
                colors.Reset);
                    }
    
                    if (tryCount >= 3) {
                        hasNextPage=false;
                        console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgYellow,
                `Error, scrap new url.`,
                colors.Reset);
                    }
                }

                
            } while (hasNextPage);

            console.log(`[ ${moment().format("HH:mm:ss")} ] `, colors.FgGreen,
            `Get username complete for url => ${linkComment}`,
            colors.Reset);
            console.log('')

        }



    } catch (error) {
        console.log(error)
        console.log(`[ ${moment().format("HH:mm:ss")} ] `, chalk.red(`Ada masalah ${error}`));
        console.log('');
    }
})();