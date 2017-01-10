const MyceliumGear = require('./index')
const gatewayId = ''
const gatewaySecret = ''

/* Setup the Gateway. */
const gateway = new MyceliumGear.Gateway(gatewayId, gatewaySecret)

/* Prepare an order. */
const order   = new MyceliumGear.Order(gateway, 1000, 'test')

/* Send the order to Mycelium Gear. */
order
.send()
.then((response) => {
    response.json().then((json) => {
        console.log(json)
        console.log('Test succeeded')
    })
})
.catch((error) => {
    console.error(error)
    console.log('Test failed')
})