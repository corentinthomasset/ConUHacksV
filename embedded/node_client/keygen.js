const crypto = require('asymmetric-crypto');
const fs = require('fs');

const keyPair = crypto.keyPair()

fs.writeFile('2keys.js', "export default "+JSON.stringify(keyPair), (err) => {
    if (err) throw err;
    console.log('Key Pair Generated!');
});