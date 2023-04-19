const path = require('path');
const fs = require('fs');
const jpeg = require('jpeg-js');

(async () => {
    //directory
    const folderYangMauDiUpload = 'images'

    //joining path of directory
    const directoryPath = path.join(__dirname, '../'+folderYangMauDiUpload);
    const getPath = await fs.readdirSync(directoryPath);
    const listPath = [];
    getPath.map(file => {
        listPath.push(file);

    });

    for (let index = 0; index < listPath.length; index++) {
        const element = listPath[index];

        if (element.includes('jpg')) {
            // First load Image
            var jpegData = fs.readFileSync(`../${folderYangMauDiUpload}/${element}`);

            // Decode Image
            var rawImageData = jpeg.decode(jpegData);

            // Encode Image
            jpegData = jpeg.encode(rawImageData, 50);
            fs.writeFileSync(`../images/${element.split('.')[0]}.jpeg`, jpegData.data, 'binary');
            fs.unlinkSync(`../${folderYangMauDiUpload}/${element}`);
            console.log(`Coverting file ../${folderYangMauDiUpload}/${element} => ` + `../images/${element.split('.')[0]}.jpeg`);
        } else {
            console.log('No Jpg!')
        }

    }
})();