var products = [
    {
        id : 'product-1',
        urlImage : 'this is an url',
        categoryDelivery : 'only-this',
        categoryProduct: 'dinner',
        name : 'name product1',
        seller : {
            id : 'seller-1',
            name : 'seller name 1'
        },
        information : {
            currentPosition : '65465464',
            currentState : 'open',
            openRestaurantOur : null,
            closeRestaurantOur : null
        },
        unitaryPrice : 45.1,
        offertInfo : {
            offertPercentage : 4.5
        },
        options : {
            products : [
                {
                    idProduct : 'product-3',
                    size : ['small','medium','large'],
                    quantity : 0
                },
                {
                    idProduct : 'product-4',
                    size : ['small','medium','large']
                }
            ],
            compliment :[
                {
                    idProduct : ['product-5'],
                    size : ['small','medium','large'],
                    quantity : 0
                }
            ]
        }
    },
    {
        id: 'product-2',
        name: 'name product2',
        urlImage : 'this is an URL',
        categoryDelivery: 'accept-more',
        categoryProduct : 'individual',
        seller: {
            id: 'seller-1',
            name: 'seller name 1'
        },
        options : {
            size : ['small','medium','large']
        },
        information: {
            currentPosition: '65465464',
            currentState: 'open',
            openRestaurantOur: null,
            closeRestaurantOur: null
        },
        unitaryPrice: 45.1,
        offertInfo: {
            offertPercentage: 4.5
        }
    }
]

var retaurants = [
    {
        id : 'seller-1',
        name : 'restaurant name1',
        information: {
            currentPosition: '65465464',
            currentState: 'open',
            openRestaurantOur: null,
            closeRestaurantOur: null
        },
        products : ['product-1','product-2']
    }
]

var buckets = [
    {
        id : 'bucket-1',
        userId : 'user-1',
        products : [

        ]
    }
]

var orders = [
    {
        id : 'order-1',
        state : 'in progress',
        idUser : 'user-1',
        restaurantId : 'seller-1',
        delivererId : 'user-2',
    }
]

var users = [
    {
        id : 'user-1',
        fullname : 'name of user',
        email : 'username@gmail.com',
        username : 'username',
        password : 'password',
        salt : 'onfasd',
        deliverer : {

        },
        ubications : []
    }
]