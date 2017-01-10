/*
    Easy way to use Mycelium Gear's API.
*/
const fetch      = require('node-fetch')
const XSignature = require('./x-signature')

/*
    A Mycelium Gear order class to handle creating orders.
*/
let Order = function(gatewayId, secret) {
    this.gatewayId = gatewayId
    this.secret    = secret
}

/*
    Send a prepared order to Mycelium Gear to be processed.
*/
Order.prototype.send = function() {
    const _this = this
    if(! this.prepared) { return Promise.reject('Order is not prepared!'); }

    let headers = {}
    Object.assign(headers, XSignature.sign(_this.secret, _this.method, _this.uri, '').toHeaders())

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

/*
    Prepare an order, but don't send it to Mycelium Gear yet.
*/
Order.prototype.prepare = function (amountInSatoshi, callbackData) {

    this.domain = 'https://gateway.gear.mycelium.com'
    this.uri    = `/gateways/${this.gatewayId}/orders?`
    + `amount=${amountInSatoshi}`
    + `&keychain_id=${this.keychainId}`
    + `&callback_data=${callbackData}`

    this.url    = this.domain + this.uri
    this.method = 'POST'

    this.prepared = true

    return this;
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
    Order
}