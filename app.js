class Repository {

    constructor(repo = []) {
        this.repo = repo
    }

    find(id) {
        if (!id) {
            return this.repo.slice(0, 20)
        } else {
            let report = this.repo.find(data => data.id === id)
            return report
        }
    }

    findByPage(pag) {
        let limit = 20
        if (pag === 0) return []
        let init = (pag - 1) * limit
        let finish = limit * pag
        let report = this.repo.slice(init, finish)
        return report
    }

    create(object) {
        this.repo.push(object)
    }

    update(object) {
        let newArr = this.repo.map(data => {
            if (data.id === object.id) {
                return object
            } else {
                return data
            }
        })
        this.repo = newArr
    }

    delete (id) {
        let newArr = this.repo.filter(data => data.id !== id)
        this.repo = newArr
    }
}

const utils = (function(){
    let part1Order = 'order-'
    let part1Product = 'product-'
    return {
        genetareID_Order : () => {
            let numberGenerated = Math.random()*10000;
            let completeId = part1Order+numberGenerated.toString();
            return completeId
        },
        generateID_Product : () => {
            let numberGenerated = Math.random()*10000;
            let completeId = part1Product+numberGenerated.toString()
            return completeId
        },
    }
})()


const Routes = {
    restaurantPage : null,
    orderPage : null,
    homePage : null,
    TracingPage : null
}

const productRepo = new Repository(products)
const restaurantRepo = new Repository(retaurants)
const bucketRepo = new Repository(buckets)
const orderRepo = new Repository(orders)
const userRepo = new Repository(users)
// const deliverersRepo = new Repository()
// const clientRepo = new Repository()
// const tracingOrdersRepo = new Repository()

const BUCKET_CONTEXT = 'BUCKET_CONTEXT'
const TRACING_VIEW_CONTEXT = 'TRACING_VIEW_CONTEXT'
const ORDERS_VIEW_CONTEXT = 'ORDERS_VIEW_CONTEXT'
const ALERTS_ORDER_VIEW_CONTEXT = 'ALERTS_ORDER_VIEW_CONTEXT'
const SHOWCASE_PRODUCT_CONTEXT = 'SHOWCASE_PRODUCT_CONTEXT'
const SHOWCASE_RESTAURANTS_CONTEXT = 'SHOWCASE_RESTAURANTS_CONTEXT'
const HINT_CONTEXT = 'HINT_CONTEXT'
const PAGE_CONTEXT = 'PAGE_CONTEXT'
const RESTAURANT_CONTEXT = 'RESTAURANT_CONTEXT'

const stateContext = (function (util,routes,product,restaurant,bucket,order){

    const StatePage = {
        rootContainer : () => document.getElementById('root'),
        containerContent : () => document.getElementById('content-container') ,
        changeContet(content){
            let container = this.containerContent()
            switch(content){
                case 'orderview' :
                    container.innerHTML = ''
                    routes.orderPage.render(container)
                    break;
                case 'restaurantview':
                    
                    container.innerHTML = ''
                    routes.restaurantPage.render(container)
            }
            
        },
        returnHomePage(){
            const container = this.rootContainer()
            container.innerHTML = ''
            routes.homePage.render(container)
        }
    }
    
    const State_Bucket = {
        bucketComponent : null,
        updateBucketComponent(data){
            this.bucketComponent.updateData(data)
        },
        itemsInBucket : [],
        getBucket(){
            let report = bucket.find('bucket-1')
            return report
        },
        saveBucket(){
            let report = bucket.find('bucket-1')
            report.products = this.itemsInBucket
            bucket.update(report)
        },
        pushItemInBucket_C(item){
            let isInArray = this.itemsInBucket.find(item_ => item_.idProduct === item.idProduct )
            if (isInArray){
                console.log('product already added');
                return
            }
            this.itemsInBucket.push(item)
            item.component.disableActions()
            this.updateBucketComponent({quantity : this.itemsInBucket.length})
        },
        removeItemBucket_C(id){
            let newArr = this.itemsInBucket.filter(data => data.idProduct !== id)
            this.itemsInBucket = newArr
            console.log(newArr);
        },
        verifyProductInComponent_C(id, component){
            let report = this.itemsInBucket.find(data => data.idProduct === id)
            if (!report) return 
            report.component = component
            this.updateBucketComponent(report)
            if (report){
                report.component.disableActions()
            }
        },
        resetBucket_C(){
            this.itemsInBucket = []
        },
        updateItemInBucket_C(object){
            let newArr = this.itemsInBucket.map(data => {
                if (data.id === object.id){
                    return object
                }else{
                    return data
                }
            })
            this.itemsInBucket = newArr
        },
        processOrder() {

            let products = this.itemsInBucket.map(data => {
                let report = product.find(data.id)
                if (!report) {
                    console.log('product removed for sell');
                }else{
                    return {
                        idProduct,
                        spec,
                        quantity
                    } = data
                }
            })

            order.create({
                id: util.genetareID_Order(),
                products: products
            })

            this.resetBucket_C()
            this.updateBucketComponent()
        }
    }

    const State_TracingView = {
        currentTracing : [],
        getUpdate(){
            
        }
    }

    const State_OrdersView = {
        getOrders(){
            let report = order.find()
            return report
        }
    }

    const State_AlertsOrdersView = {
        alerts : [],
        pushAlert_C(component){
            this.alerts.push(component)
        },
    }

    const State_ShowcaseProducts = {
        higntOrderComponent: null,
        products : [],
        pushProduct(product){
            this.products.push(product)
        },
        removeAllProducts_C(){
            this.products = []
            console.log('products : ',this.products,'bucket: ', State_Bucket.itemsInBucket);
        },
        filterProducts(){

        },
        getProductByPag(pag){
            let report = product.findByPage(pag)
            return report
        },
        getProduct(id){
            let report = product.find(id)
            return report
        },
        getProducts(){
            let report = product.find()
            return report
        }
    }

    const State_CurrentRestaurant = {
        component : null,
        currentData :  {

        },
        setComponentRestaurant(component){
            this.component = component
        },
        populateDataCurrentRestaurant(id){
            let report = restaurant.find(id)
            this.currentData = report
            this.component.setData(this.currentData)
        }
    }

    const State_ShowcaseRestaurants = {
        highOrderComponent : null,
        restaurants : [],
        setHighOrderComponent(component){
            this.highOrderComponent = component
        },
        pushRestaurant_C(restaurant){
            this.restaurants.push(restaurant)
        },
        removeAllRestaurants_C(){
            this.restaurants = []
        },
        getRestaurants(){
            let report = restaurant.find()
            return report
        },
        getRestaurant(id){
            
        }
    }

    const State_Hint = {
        higntOrderComponent : null,
        msgs : [],
        setHighOrderComponent(component){
            this.higntOrderComponent = component
        },
        pushMsgs(msg){

        },
        resetMsgs(){
            this.msgs = []
        },
        renderMsgs(){

        }
    }

    return (type) => {
        switch(type){
            case TRACING_VIEW_CONTEXT :
                return State_TracingView
            case ORDERS_VIEW_CONTEXT :
                return State_OrdersView
            case ALERTS_ORDER_VIEW_CONTEXT :
                return State_AlertsOrdersView
            case SHOWCASE_PRODUCT_CONTEXT :
                return State_ShowcaseProducts
            case SHOWCASE_RESTAURANTS_CONTEXT :
                return State_ShowcaseRestaurants
            case HINT_CONTEXT :
                return State_Hint
            case BUCKET_CONTEXT:
                return State_Bucket
            case PAGE_CONTEXT:
                return StatePage
            case RESTAURANT_CONTEXT:
                return State_CurrentRestaurant
        }
    }

})(utils,Routes, productRepo,restaurantRepo,bucketRepo,orderRepo)

/* Components */

class HintItem {
    constructor() {

    }
    listeners() {
        const component = this.currentComponent
        const btnRemove = component.querySelector('.btn-hint-item-remove')
        btnRemove.addEventListener('click',()=>{

        })
    }
    getTemplate() {
        let div = document.createElement('div')
        let template = `
            <button class = "btn-hint-item-remove" >
                remove
            </button>
        `
        div.innerHTML = template
        this.currentComponent = div
        return div
    }
    render(container) {
        let component = this.getTemplate()
        container.append(component)
        this.listeners()
    }
    setData(data){
        this.data = data
    }
}

class Hint {
    constructor() {

    }
    listeners() {

    }
    updateComponent(){

    }
    getTemplate() {
        let div = document.createElement('div')
        div.id = 'hint-container'
        let template = ``
        div.innerHTML = template
        return div
    }
    render(container) {
        let component = this.getTemplate()
        container.append(component)
        this.listeners()
    }
}

// for the deliverers
class AlertOrderItem {
    constructor() {

    }
    listeners() {
        const component = this.currentComponent
        const btnTakeIt = component.querySelector('.btn-alert-order-item-take-it')
        btnTakeIt.addEventListener('click',()=>{
            console.log('in process for tacking');
        })
    }
    getTemplate() {
        let div = document.createElement('div')
        let template = `
            <div class = "alter-order-item-footer">
                <div class = "alert-order-item-actions">
                    <button class = "btn-alert-order-item-take-it" >
                        take it
                    </button>
                </div>
            </div>
        `
        div.innerHTML = template
        this.currentComponent = div
        return div
    }
    render(container) {
        let component = this.getTemplate()
        container.append(component)
        this.listeners()
    }
}

// for the deliverers
class AlertOrdersView {
    constructor() {

    }
    listeners() {

    }
    getTemplate() {
        let div = document.createElement('div')
        let template = `
            <div id = "alert-order-items"></div>
        `
        div.innerHTML = template
        return div
    }
    render(container) {
        let component = this.getTemplate()
        container.append(component)
        this.listeners()
        const alertOrdersItemsContainer = document.getElementById('alert-order-items')
        let component_ = new AlertOrderItem()
        component_.render(alertOrdersItemsContainer)
    }
}

class OptionsItemCurrentOrder {

    constructor(){

    }

    listeners(){

    }

    getTemplate(){
        let div = document.createElement('div')
        let template = ``
        div.innerHTML = template
        this.currentComponent = div
        return div
    }

    render(container){
        let component = this.getTemplate()
        container.append(component)
        this.listeners()
    }

}

const CATEGORY_DELIVERY_ONLY_THIS = 'CATEGORY_DELIVERY_ONLY_THIS'
const CATEGORY_DELIVERY_ACCEPT_MORE = 'CATEGORY_DELIVERY_ACCEPT_MORE'

const FactoryCurrentOrder = (type) => {
    const strong = document.createElement('strong')
    switch(type){
        case CATEGORY_DELIVERY_ONLY_THIS:
            strong.innerText = 'producto individual'
            return strong
        case CATEGORY_DELIVERY_ACCEPT_MORE:
            strong.innerText = 'elige mas'
            return strong
    }
}

const UtilsCurrentOrder = {
    getCurrentCategoryDelivery(type){
        switch(type){
            case 'only-this':
                return CATEGORY_DELIVERY_ONLY_THIS
            case 'accept-more':
                return CATEGORY_DELIVERY_ACCEPT_MORE
        }
    },
    renderConsideringCategoryDelivery(type, container){
        container.append(FactoryCurrentOrder(type))
    }
}
class ItemCurrentOrder {

    constructor(){

    }

    listeners(){
        const bucketContext = stateContext(BUCKET_CONTEXT)
        const component = this.currentComponent
        const btnRemove = component.querySelector('.btn-item-current-order-remove')
        btnRemove.addEventListener('click',() => {
            bucketContext.removeItemBucket_C(this.data.id)
            component.remove()
            delete this
        })
    }

    getTemplate(){
        let div = document.createElement('div')
        const { name, categoryDelivery} = this.data
        let template = `
            <h3>${name}</h3>
            <small>${categoryDelivery}</small>
            <div class = "current-order-spec" ></di>
            <button class = "btn-item-current-order-remove" >remove</button>
        `
        div.innerHTML = template
        this.currentComponent = div
        return div
    }

    render(container){
        
        let component = this.getTemplate()
        container.append(component)
        this.listeners()

        //this secrion render a component for category delivery
        let categoryConst = UtilsCurrentOrder.getCurrentCategoryDelivery(this.data.categoryDelivery)
        const containerSpec = this.currentComponent.querySelector('.current-order-spec')
        UtilsCurrentOrder.renderConsideringCategoryDelivery(categoryConst,containerSpec)

    }

    setData(data){
        this.data = data
    }

}

class CurrentOrderView {
    constructor(){

    }
    listeners(){
        const component = this.currentComponent
        const btnProcess = document.getElementById('btn-curret-order-process-order')
        btnProcess.addEventListener('click',()=>{
            console.log('for process');
        })
    }
    getTemplate(){
        let div = document.createElement('div')
        let template = `
            <form>
                <div id = "items-in-order" >

                </div>
                <button id = "btn-curret-order-process-order" type = "button"> 
                    finalizar compra
                </button>
            </form>
        `
        div.innerHTML = template
        this.currentComponent = div
        return div
    }
    render(container){
        let component = this.getTemplate()
        container.append(component)
        this.listeners()

        const itemsInOrderContainer = document.getElementById('items-in-order')

        const productContext = stateContext(SHOWCASE_PRODUCT_CONTEXT)

        const itemsInOrder = document.getElementById('items-in-order')
        const bucketContext = stateContext(BUCKET_CONTEXT)
        let report = bucketContext.itemsInBucket
        report.forEach(data => {
            let report = productContext.getProduct(data.idProduct)
            let component = new ItemCurrentOrder()
            component.setData({...report,...data})
            component.render(itemsInOrderContainer)
        })
    }
}

class OrderItem {
    constructor() {

    }
    listeners() {

    }
    getTemplate() {
        let div = document.createElement('div')
        const {id,state} = this.data
        let template = `
            <h4>${id}</h4>
            <span>${state}</span>
        `
        div.innerHTML = template
        return div
    }
    render(container) {
        let component = this.getTemplate()
        container.append(component)
        this.listeners()
    }
    setData(data){
        this.data = data
    }
}

const currentOrderView = new CurrentOrderView()
class OrdersView {
    constructor() {

    }
    listeners() {

        const pageState = stateContext(PAGE_CONTEXT)

        const skiptView = document.getElementById('btn-skipt-order-view')
        skiptView.addEventListener('click',()=>{
            pageState.returnHomePage()
        })

    }
    getTemplate() {
        let div = document.createElement('div')
        let template = `
            <button id = "btn-skipt-order-view" >skipt</button>
            <div id = "past-order-container" ></div>
            <div id = "current-order-container" ></div>
        `
        div.innerHTML = template
        return div
    }
    render(container) {
        let component = this.getTemplate()
        container.append(component)
        this.listeners()

        const pastOrdersContainer = document.getElementById('past-order-container')
        const currentOrderContainer = document.getElementById('current-order-container')

        const orderContext = stateContext(ORDERS_VIEW_CONTEXT)
        let report = orderContext.getOrders()
        console.log(report);
        report.forEach(data => {
            let component = new OrderItem()
            component.setData(data)
            component.render(pastOrdersContainer)
        })

        currentOrderView.render(currentOrderContainer)
    
    }
}

class TracingItem {
    constructor() {

    }
    listeners() {

    }
    getTemplate() {
        let div = document.createElement('div')
        let template = ``
        div.innerHTML = template
        return div
    }
    render(container) {
        let component = this.getTemplate()
        container.append(component)
        this.listeners()
    }
}

class TracingView {
    constructor() {

    }
    listeners() {

    }
    getTemplate() {
        let div = document.createElement('div')
        let template = ``
        div.innerHTML = template
        return div
    }
    render(container) {
        let component = this.getTemplate()
        container.append(component)
        this.listeners()
    }
}

class RestaurantCard {
    constructor() {

    }
    listeners() {
        const component = this.currentComponent
        
        const restaurantContext = stateContext(RESTAURANT_CONTEXT)
        const pageContext = stateContext(PAGE_CONTEXT)
        
        const VisitRestaurantArea = component.querySelector('.restaurant-card-btn-visit')
        VisitRestaurantArea.addEventListener('click',()=>{
            // before render call the data of the restaurant
            restaurantContext.populateDataCurrentRestaurant(this.data.id)
            pageContext.changeContet('restaurantview')
        })
    }
    getTemplate() {
        let div = document.createElement('div')
        const {id} = this.data
        let template = `
            <button class = "restaurant-card-btn-visit">
                <div class ="restaurant-card-main-info">
                    <div class = "restaurand-card-avatar" >
                        ${id}
                    </div>
                    <div>
                        <h3>name of restauran</h3>
                        <span>type restaurant</span>
                    </div>
                </div>
            </button>
        `
        div.innerHTML = template
        this.currentComponent = div
        return div
    }
    render(container) {
        let component = this.getTemplate()
        container.append(component)
        this.listeners()
    }
    setData(data){
        this.data = data
    }
}

class ShowCaseRestaurant {
    constructor() {

    }
    listeners() {

    }
    getTemplate() {
        let div = document.createElement('div')
        let template = `

            <div id = "restaurant-cards-container" ></div>
        
        `
        div.innerHTML = template
        return div
    }
    render(container) {
        let component = this.getTemplate()
        container.append(component)
        this.listeners()

        const restaurantCardsContainer = document.getElementById('restaurant-cards-container')
        const showcaseContext = stateContext(SHOWCASE_RESTAURANTS_CONTEXT)
        let report = showcaseContext.getRestaurants()
        report.forEach(data => {
            let component = new RestaurantCard()
            component.setData(data)
            component.render(restaurantCardsContainer)
        })
    }
}

class ProductCard {

    constructor() {

    }

    disableActions(){
        const btnAddToBucket = this.currentComponent.querySelector('.product-card-btn-add-to-bucket')
        btnAddToBucket.disabled = true
    }

    listeners() {

        const component= this.currentComponent
        const contextOrder = stateContext(BUCKET_CONTEXT)

        const btnAddToBucket = component.querySelector('.product-card-btn-add-to-bucket')
        btnAddToBucket.addEventListener('click',()=>{
            const {id} = this.data
            contextOrder.pushItemInBucket_C({
                idProduct : id,
                spec : {},
                quantity : 1 ,
                component : this
            })
        })

    }
    getTemplate() {
        let div = document.createElement('div')
        const {name} = this.data 
        let template = `
            <div class = "product-card-main-info">
                <div class = "product-card-avatar" >
                    
                </div>
                <div class = "product-card-info">
                    <h3>${name}</h3>
                    <span>name restaurant</span>
                    <span>time deliver</span>
                </div>
            </div>
            <div></div>
            <div class = "product-card-footer">
                <div class = "productv-card-actions" >
                    <button class = "product-card-btn-add-to-bucket" >
                        add to bucket
                    </button>
                </div>
            </div>
        `
        div.innerHTML = template
        this.currentComponent = div
        return div
    }
    render(container) {
        let component = this.getTemplate()
        container.append(component)
        this.listeners()
    }
    setData(data){
        this.data = data
    }
}

class FilterProduct {
    constructor() {

    }
    listeners() {

    }
    getTemplate() {
        let div = document.createElement('div')
        let template = `filter product`
        div.innerHTML = template
        return div
    }
    render(container) {
        let component = this.getTemplate()
        container.append(component)
        this.listeners()
    }
}

class SearchProduct {
    constructor() {

    }
    listeners() {

    }
    getTemplate() {
        let div = document.createElement('div')
        let template = `
            <input type = "text" placeholder = "buscar" />
        `
        div.innerHTML = template
        return div
    }
    render(container) {
        let component = this.getTemplate()
        container.append(component)
        this.listeners()
    }
}

const searchProduct = new SearchProduct()
const filterProduct = new FilterProduct()

class ShowCaseProducts {
    constructor() {

    }
    listeners() {

    }
    getTemplate() {
        let div = document.createElement('div')
        let template = `
        
            <div id = "products-showcase-actions">
            
            </div>

            <div id = "product-cards-container">

            </div>
        
        `
        div.innerHTML = template
        return div
    }
    render(container) {

        let component = this.getTemplate()
        container.append(component)
        this.listeners()

        const containerProductCards = document.getElementById('product-cards-container')
        const showcaseContext = stateContext(SHOWCASE_PRODUCT_CONTEXT)
        const bucketContext = stateContext(BUCKET_CONTEXT)
        let report = showcaseContext.getProducts(productRepo)
        report.forEach( data => {
            let component_ = new ProductCard()
            component_.setData(data)
            component_.render(containerProductCards)
            //control of this component
            bucketContext.verifyProductInComponent_C(data.id,component_)
            showcaseContext.pushProduct({...data,componet: component_})
        })
        
        const containerActionst = document.getElementById('products-showcase-actions')
        searchProduct.render(containerActionst)
        filterProduct.render(containerActionst)
    }
}

class BucketProducts {

    constructor() {

    }
    
    updateData(data){
        const component = this.currentComponent
        const quantity = component.querySelector('.bucket-quantity')
        quantity.innerText = data.quantity
    }

    listeners() {
        const component = this.currentComponent
        const btnActiontoOrder = component.querySelector('.bucket-view-action-to-orders')
        const PageContext = stateContext(PAGE_CONTEXT)
        btnActiontoOrder.addEventListener('click',()=>{
            PageContext.changeContet('orderview')
        })
    }
    getTemplate() {
        let div = document.createElement('div')
        let template = `
        <button class = "bucket-view-action-to-orders">
            bucket
            <span class = "bucket-quantity" >0</span>
        </button>
        `
        div.innerHTML = template
        this.currentComponent = div
        return div
    }
    render(container) {
        let component = this.getTemplate()
        container.append(component)
        this.listeners()
    }
}

class SwitchModeApp {
    constructor() {

    }
    setPageComponent(Page){
        this.Page = Page
    }
    listeners() {
        const switchModeApp = document.getElementById('switch-mode-app')
        switchModeApp.addEventListener('click',()=>{
            let mode = switchModeApp.checked ? 'consumer' : 'worker'
            this.Page.switchMode(mode)
        })
    }
    getTemplate() {
        let div = document.createElement('div')
        let template = `
            <label for = "switch-mode-app" >Switch Modes</label>
            <input id = "switch-mode-app" type = "checkbox" />
        `
        div.innerHTML = template
        return div
    }
    render(container) {
        let component = this.getTemplate()
        container.append(component)
        this.listeners()
    }
}

class ProfileUser {
    constructor() {

    }
    listeners() {
        const btnLogout = document.getElementById('btn-profile-logout')
        btnLogout.addEventListener('click',()=>{

            console.log('log out');
        })
    }
    getTemplate() {
        let div = document.createElement('div')
        let template = `
            <button id = "btn-profile-logout" >logout</button>
        `
        div.innerHTML = template
        return div
    }
    render(container) {
        let component = this.getTemplate()
        container.append(component)
        this.listeners()
    }
}

class LoginForm {
    constructor() {

    }
    listeners() {
        const btnLogin = document.getElementById('button-login')
        btnLogin.addEventListener('click',()=>{
            console.log('login user');
        })
    }
    getTemplate() {
        let div = document.createElement('div')
        let template = `
            <form>
                <input type = "text" placeholder = "username" />
                <input type = "password" placeholder = "password" />
                <button id = "button-login" type = "button" >login</button>
            </form>
        `
        div.innerHTML = template
        return div
    }
    render(container) {
        let component = this.getTemplate()
        container.append(component)
        this.listeners()
    }
}

const profileCard = new ProfileUser()
const switchModeApp = new SwitchModeApp()
const bucket = new BucketProducts()

const contextBucket = stateContext(BUCKET_CONTEXT)
contextBucket.bucketComponent = bucket

class Nav {
    constructor() {

    }
    listeners() {

    }
    getTemplate() {
        let div = document.createElement('div')
        div.id = "nav"
        let template = ``
        div.innerHTML = template
        return div
    }
    render(container) {
        let component = this.getTemplate()
        container.append(component)
        this.listeners()
        const navContainer = document.getElementById('nav')
        bucket.render(navContainer)
        profileCard.render(navContainer)
        switchModeApp.render(navContainer)
    }
}

const alertOrdersView = new AlertOrdersView() 
class DeliveresInterface {
    constructor() {

    }
    listeners() {

    }
    getTemplate() {
        let div = document.createElement('div')
        div.id = "deliverers-interface"
        let template = ``
        div.innerHTML = template
        return div
    }
    render(container) {
        let component = this.getTemplate()
        container.append(component)
        this.listeners()
        const deliverersIterfaceContainer = document.getElementById('deliverers-interface')
        alertOrdersView.render(deliverersIterfaceContainer)
    }
} 

class RestaurantView {
    
    constructor(){

    }

    listeners(){
        const btnSkip = document.getElementById('btn-restaurant-view-skip')
        const pageContext = stateContext(PAGE_CONTEXT)
        btnSkip.addEventListener('click', () => {
            pageContext.returnHomePage()
        })
    }

    getTemplate(){
        let div = document.createElement('div')
        const {name} = this.data
        let template = `
            <h3 class = "view-restaurant-name-restaurant" >${name}</h3>
            <button id = "btn-restaurant-view-skip" >skipt</button>
            <div id = "products-of-restaurant"></div>
        `
        div.innerHTML = template
        this.currentComponent=div
        return div
    }

    render(container){

        let component = this.getTemplate()
        container.append(component)
        this.listeners()

        const showcaseContext = stateContext(SHOWCASE_PRODUCT_CONTEXT)
        const bucketContext = stateContext(BUCKET_CONTEXT)
        const productContext = stateContext(SHOWCASE_PRODUCT_CONTEXT)
        const containerProducts = document.getElementById('products-of-restaurant')
        const {products} = this.data
        products.forEach(id => {
            let component_ = new ProductCard()
            let report = productContext.getProduct(id)
            component_.setData(report)
            component_.render(containerProducts)
            //control of this component
            bucketContext.verifyProductInComponent_C(report.id, component_)
            showcaseContext.pushProduct({ ...report, componet: component_ })
        })

    }

    setData(data){
        this.data = data
    }
}

const hint = new Hint()
const nav = new Nav()
// consumers
const showCaseProducts = new ShowCaseProducts()
const showCaseRestaurant = new ShowCaseRestaurant()
// workers
const deliverersInterface = new DeliveresInterface()
class Page {
    constructor(){

    }
    listeners(){

    }

    switchMode(mode){
        const contentContainer = document.getElementById('content-container')
        const showcaseProductContext = stateContext(SHOWCASE_PRODUCT_CONTEXT)
        showcaseProductContext.removeAllProducts_C()
        // (still) delete the components renderer
        contentContainer.innerHTML = ''
        switch(mode){
            case 'consumer' : 
                deliverersInterface.render(contentContainer)
                break;
            case 'worker' : 
                showCaseRestaurant.render(contentContainer)
                showCaseProducts.render(contentContainer)
                break;
        }
    }

    getTemplate(){
        let div = document.createElement('div')
        let template = `
            <div id  ="hint-container" >
            
            </div>
            <div id = "nav-container">
                
            </div>
            <div id = "content-container">
                
            </div>
            <div id = "modals-container">
                modals
            </div>
        `
        div.innerHTML = template
        return div
    }
    render(container){
        let component = this.getTemplate()
        container.append(component)
        this.listeners()
        const hintContainer = document.getElementById('hint-container')
        hint.render(hintContainer)
        const navContainer = document.getElementById('nav-container')
        nav.render(navContainer)
        const contentContainer = document.getElementById('content-container')
        // the default render opening the app
        showCaseRestaurant.render(contentContainer)
        showCaseProducts.render(contentContainer)
    }
}

const ordersView = new OrdersView()
Routes.orderPage = ordersView

const restaurantContext = stateContext(RESTAURANT_CONTEXT)
const restaurantPage = new RestaurantView()
Routes.restaurantPage = restaurantPage
restaurantContext.setComponentRestaurant(restaurantPage)

const app = () => {
    const rootContainer = document.getElementById('root')
    const page = new Page()
    Routes.homePage = page
    // binding to switch mode app to page
    switchModeApp.setPageComponent(page)
    page.render(rootContainer)
}

app()