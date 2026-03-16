let cart = [];

export const CartManager = {
    getCart: () => cart,
    
    add: (product) => {
        cart.push(product);
        return cart;
    },
    
    remove: (index) => {
        cart.splice(index, 1);
        return cart;
    },
    
    getTotal: () => {
        return cart.reduce((sum, item) => sum + item.price, 0);
    },

    clear: () => {
        cart = [];
    }
};