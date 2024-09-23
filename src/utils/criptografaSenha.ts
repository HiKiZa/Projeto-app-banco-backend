import * as crypto from 'crypto'


function tokenHash(token: string) {
    return crypto.createHash('sha512').update(token).digest('hex')
}

module.exports = {tokenHash}