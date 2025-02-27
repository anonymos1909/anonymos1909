const fs = require('fs');
const path = require('path');

const directoryPath = './temp';
const exceptionFile = '.file';
const deletionInterval = 30000; // 30 dtk

function deleteFiles() {
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            console.log('Unable to scan directory: ' + err);
            return;
        }

        files.forEach((file) => {
            if (file !== exceptionFile) {
                fs.unlink(path.join(directoryPath, file), (err) => {
                    if (err) {
                        console.log(`Unable to delete file: ${file}. Error: ${err}`);
                    } else {
                        console.log(`Deleted file: ${file}`);
                    }
                });
            }
        });
    });
}

module.exports = async () => {
    try {
        setInterval(deleteFiles, deletionInterval);
    } catch (e) {
        console.error('Error:', e);
    }
};
