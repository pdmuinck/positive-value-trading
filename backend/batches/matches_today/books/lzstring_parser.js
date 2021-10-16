const LZString = require('lz-string')

lz_string=process.argv.slice(2)[0].slice(12)

console.log(lz_string)

console.log(LZString.decompressFromUTF16(lz_string))