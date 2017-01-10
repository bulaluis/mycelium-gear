/*
    Easy way to use Mycelium Gear's API.
*/
const fetch      = require('node-fetch')
const XSignature = require('./x-signature')

/*
    A Mycelium Gear Gateway class to handle creating gateways to use with orders.
*/
let Gateway = function(id, secret) {
    this.id     = id
    this.secret = secret
}

/*
    A Mycelium Gear Order class that prepares an order to be sent to a gateway.
    Prepare an order, but don't send it to Mycelium Gear yet.
*/
let Order = function (gateway, amountInSatoshi, callbackData) {
    this.gateway = gateway
    this.domain  = 'https://gateway.gear.mycelium.com'
    this.uri     = `/gateways/${this.gateway.id}/orders?`
    + `amount=${amountInSatoshi}`
    + `&keychain_id=${this.keychainId}`
    + `&callback_data=${callbackData}`

    this.url    = this.domain + this.uri
    this.method = 'POST'

    this.prepared = true
}

/*
    Send a prepared order to Mycelium Gear to be processed.
*/
Order.prototype.send = function() {
    const _this = this
    if(! this.prepared) { return Promise.reject('Order is not prepared!'); }

    let headers = {}
    Object.assign(headers, XSignature.sign(_this.gateway.secret, _this.method, _this.uri, '').toHeaders())

    const orderFulfillmentRequest = fetch(this.url, {
        method: _this.method,
        headers
    })

    /* The order has been successfully sent, the configuration is no longer valid. */
    orderFulfillmentRequest.then((response) => {
        _this.prepared = false
    })

    console.log(headers)

    return orderFulfillmentRequest;
}

Order.prototype.getNextKeychainId = function() {
    const _this = this
    const url   = `https://gateway.gear.mycelium.com/gateways/${this.gatewayId}/last_keychain_id`

    return fetch(url)
    .then((response) => response.json().then((json) => {
        _this.keychainId = json.last_keychain_id + 1
        return Promise.resolve(_this)
    }))
}

module.exports = {
    Gateway,
    Order
}