# Mycelium Gear JavaScript Client API
Because Mycelium Gear only has a Ruby implementation, it was clear a JavaScript implementation was in need.

# Usage
Very easy to use!

```
const MyceliumGear = require('mycelium-gear')
const gateway = new MyceliumGear.Gateway('gateway-id', 'gateway-secret')
const order   = new MyceliumGear.Order(gateway, 1000, 'callback-data')

order
.send()
.then((response) => {
    response.json().then((json) => {
        /* More computation with object returned from Mycelium Gear. */
    })
})
.catch((error) => {
    console.error(error)
})
```

There is no "listener" API for order status changes because it is already simple. Please look at [Mycelium Gear documentation](https://admin.gear.mycelium.com/docs) on how to get order status changes. There are 3 ways to check: a websocket, http request to a web server, and manual GET requests.
