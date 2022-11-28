import { updateUserRating } from "./session";

const GET_PRODUCTS = 'products/GET_PRODUCTS';
const GET_PRODUCT_DETAILS = 'products/GET_PRODUCT_DETAILS';
const GET_USER_CART = 'products/GET_USER_CART';
const REMOVE_CART_PRODUCT = 'products/REMOVE_CART_PRODUCT';
const USER_ORDER_PLACED = 'products/USER_ORDER_PLACED';
const ADD_REVIEW_RATING = 'products/ADD_REVIEW_RATING';
const GET_USER_PRODUCT_REVIEW = 'products/GET_USER_PRODUCT_REVIEW';
const GET_CART_ITEM_COUNT = 'products/GET_CART_ITEM_COUNT';
const ADD_CART_ITEM_COUNT = 'products/ADD_CART_ITEM_COUNT';
const SET_CART_ITEM_COUNT = 'products/SET_CART_ITEM_COUNT';


const getProducts = (products) => {
    return {
        type: GET_PRODUCTS,
        payload: products
    }
};

const getProductDetails = (product) => {
    return {
        type: GET_PRODUCT_DETAILS,
        payload: product
    }
};

const getUserCart = (cartItems) => {
    return {
        type: GET_USER_CART,
        payload: cartItems
    }
};

const getCartItemCount = (cartItems) => {
    return {
        type: GET_CART_ITEM_COUNT,
        payload: cartItems
    }
};


const removeCartProduct = (productId) => {
    return {
        type: REMOVE_CART_PRODUCT,
        payload: productId
    }
};

const userOrderPlaced = () => {
    return {
        type: USER_ORDER_PLACED
    }
};

const addReviewRating = (rating) => {
    return {
        type: ADD_REVIEW_RATING,
        payload: rating
    };
};

export const getUserProductReview = (hasReviewed) => {
    return {
        type: GET_USER_PRODUCT_REVIEW,
        payload: hasReviewed
    };
};

export const addCartItemCount = (quantity) => {
    return {
        type: ADD_CART_ITEM_COUNT,
        payload: quantity
    }
};

export const setCartItemCount = (quantity) => {
    return {
        type: SET_CART_ITEM_COUNT,
        payload: quantity
    }
};

export const getProductsThunk = (lastProductId) => async (dispatch) => {
    const response = await fetch(`/api/products/?lastProductId=${lastProductId}`);
    if (response.ok) {
        const data = await response.json();
        dispatch(getProducts(data.products));
        return data.products.length;
    } else {
        console.error('Error fetching products data...');
        return;
    }
};

export const getProductDetailsThunk = (productId) => async (dispatch) => {
    const response = await fetch(`/api/products/${productId}`);
    if (response.ok) {
        const data = await response.json();
        dispatch(getProductDetails(data.product));
    } else {
        console.error('Error fetching product details...');
    }
};

export const getUserCartThunk = () => async (dispatch) => {
    const response = await fetch('/api/products/cart');
    if (response.ok) {
        const data = await response.json();
        dispatch(getUserCart(data.cartItems));
    } else {
        console.error('Error fetching user cart');
    }
};

export const getCartItemCountThunk = () => async (dispatch) => {
    const response = await fetch('/api/products/cart/count');
    if (response.ok) {
        const data = await response.json();
        dispatch(getCartItemCount(data.cartItemCount));
    } else {
        console.error('Error fetching total of items in cart');
    }
};

export const removeCartProductThunk = (productId) => async (dispatch) => {
    const response = await fetch(`/api/products/cart/${productId}`, {
        method: 'DELETE'
    });
    const data = await response.json();
    if (data.success) {
        dispatch(removeCartProduct(productId));
        await dispatch(getCartItemCountThunk());
        return true;
    } else {
        console.error('Error removing product from cart...');
        return;
    }
};

export const placeUserOrderThunk = (orderedItems) => async (dispatch) => {
    try {
        const response = await fetch('/api/products/cart', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ orderedItems })
        });
        const data = await response.json();
        if (data.success) {
            dispatch(userOrderPlaced());
            return { orderId: data.orderId, success: true };
        } else {
            console.error('Error checking out cart...');
            return { success: false };
        }
    } catch (err) {
        if (err instanceof SyntaxError) {
            return { success: false, status: 405 }
        }
    }
};

export const checkoutCart = (orderedItems) => async (dispatch) => {
    try {
        const response = await fetch('/api/products/cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ orderedItems })
        });
        const data = await response.json();
        if (data.success) {
            dispatch(userOrderPlaced());
            return { orderId: data.orderId, success: true };
        } else {
            console.error('Error checking out cart...');
            return { success: false, status: response.status };
        }
    } catch (err) {
        if (err instanceof SyntaxError) {
            return { success: false, status: 405 }
        }
    }
};

export const addToCart = (productId) => async (dispatch) => {
    const response = await fetch(`/api/products/${productId}`, {
        method: 'POST'
    });
    if (response.ok) {
        const data = await response.json();
        return data.success;
    } else {
        console.error('Error adding product to cart...');
        return;
    }
};

export const updateCartItemQty = (productId, quantity) => async (dispatch) => {
    const response = await fetch(`/api/products/cart/${productId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity })
    });
    const data = await response.json();
    if (data.success) {
        return true;
    } else {
        console.error('Error updating quantity of item in cart...');
        return false;
    }
};

export const rateProduct = (productId, rating) => async dispatch => {
    const response = await fetch(`/api/products/${productId}/rate/`, {
        method: 'PUT',
        body: JSON.stringify({ rating })
    });
    if (response.ok) {
        const data = await response.json();
        dispatch(addReviewRating(data.rating));
        dispatch(updateUserRating(rating));
    }
};

const initialState = {
    allProducts: null,
    currentProduct: null,
    userCart: null,
    hasUserReview: null,
    cartItemCount: 0,
};

const productReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case GET_PRODUCTS:
            newState = { ...state };
            if (state.allProducts) {
                newState.allProducts = [...state.allProducts, ...action.payload];
            } else {
                newState.allProducts = [...action.payload];
            }
            return newState;
        case GET_PRODUCT_DETAILS:
            newState = { ...state };
            newState.currentProduct = action.payload;
            return newState;
        case GET_USER_CART:
            newState = { ...state };
            newState.userCart = action.payload;
            return newState;
        case GET_CART_ITEM_COUNT:
            newState = { ...state };
            newState.cartItemCount = action.payload;
            return newState;
        case ADD_CART_ITEM_COUNT:
            newState = { ...state };
            newState.cartItemCount += action.payload;
            return newState;
        case SET_CART_ITEM_COUNT:
            newState = { ...state };
            newState.cartItemCount = action.payload;
            return newState;
        case GET_USER_PRODUCT_REVIEW:
            newState = { ...state };
            newState.hasUserReview = action.payload;
            return newState;
        case REMOVE_CART_PRODUCT:
            newState = { ...state };
            newState.userCart = state.userCart.filter((item) => item.productId !== action.payload);
            return newState;
        case USER_ORDER_PLACED:
            newState = { ...state };
            newState.userCart = null;
            return newState;
        case ADD_REVIEW_RATING:
            newState = Object.assign({}, state);
            newState.currentProduct.rating = action.payload;
            return newState;
        default:
            return state;
    }
};

export default productReducer;
