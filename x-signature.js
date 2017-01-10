/*
    Generate X-Signatures to verify requests.
*/

const Crypto = require('crypto-js')

/*
Most requests to API require a signature which protects gateway from unauthorized access. The signature is a X-Signature HTTP header with a string of about 88 chars:

Base64StrictEncode(
  HMAC-SHA512(
    REQUEST_METHOD + REQUEST_URI + SHA512(X-Nonce + REQUEST_BODY),
    GATEWAY_SECRET
  )
)
Where:

REQUEST_METHOD: “GET”, “POST”, etc.
REQUEST_URI: “/full/path/with?arguments&and#fragment”, without hostname
REQUEST_BODY: final request body string with JSON or blank string
X-Nonce: HTTP header with an integer which must be incremented with each request (protects from replay attack), for example (Time.now.to_f * 1000).to_i
SHA512: binary SHA-2, 512 bits
HMAC-SHA512: binary HMAC with SHA512
GATEWAY_SECRET: key for HMAC
Base64StrictEncode: Base64 encoding according to RFC 4648
*/

function sign(secret, method, uri, body) {
    const nonce = getNonce()
    const signature = signRequest(nonce, secret, method, uri, '').toString()
    return {
        nonce,
        signature,
        toHeaders() {
            return {
                'X-Nonce': this.nonce,
                'X-Signature': this.signature
            }
        }
    }
}

function signRequest(nonce, secret, method, uri, json) {
    const sha512NonceJson  = Crypto.SHA512(nonce + json).toString()
    const message          = method + uri + sha512NonceJson
    return Crypto.HmacSHA512(message, secret)
}

function getNonce() {
    return (new Date()).getTime().toString()
}

module.exports = {
    sign,
    signRequest,
    getNonce
}