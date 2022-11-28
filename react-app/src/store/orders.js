import { getUserShippingDetails } from "./session";

const GET_ORDER_DETAILS = 'order/GET_ORDER_DETAILS';
const GET_ORDER_HISTORY = 'order/GET_ORDER_HISTORY';
const CREATE_ORDER = "order/CREATE_ORDER";
const REMOVE_ORDER = 'order/REMOVE_ORDER';

const getOrderDetails = (order) => {
    return {
        type: GET_ORDER_DETAILS,
        payload: order
    }
};

const getOrderHistory = (orders) => {
    return {
        type: GET_ORDER_HISTORY,
        payload: orders
    }
};

const createOrder = (order) => {
    return {
        type: CREATE_ORDER,
        payload: order
    };
};


export const getOrderDetailsThunk = (id) => async (dispatch) => {
    const response = await fetch(`/api/orders/${id}`);
    if (response.ok) {
        const data = await response.json();
        dispatch(getOrderDetails(data.order));
        dispatch(getUserShippingDetails(data.shippingDetails));
    } else {
        console.error('Error fetching order details...');
    }
};

export const getOrderHistoryThunk = () => async (dispatch) => {
    const response = await fetch('/api/orders/');
    if (response.ok) {
        const data = await response.json();
        dispatch(getOrderHistory(data.orders));
    } else {
        console.error('Error fetching order history...');
    }
};

export const updateShippingAddress = (shippingAddress) => async (dispatch) => {
    const response = await fetch('/api/orders/address', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ shippingAddress })
    });
    const data = await response.json();
    return data;
};

export const submitUserOrder = (orderId) => async (dispatch) => {
    const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT'
    });
    const data = await response.json();
    return data.success;
};

export const cancelUserOrder = (orderId) => async (dispatch) => {
    const response = await fetch(`/api/orders/cancel/${orderId}`, {
        method: 'DELETE'
    });
    const data = await response.json();
    return data.success;
};

export const updateOrderItemQty = (orderItemId, quantity) => async (dispatch) => {
    const response = await fetch(`/api/orders/${orderItemId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity })
    });
    const data = await response.json();
    return data.success;
};

export const removeOrderItem = (orderItemId) => async (dispatch) => {
    const response = await fetch(`/api/orders/${orderItemId}`, {
        method: 'DELETE'
    });
    const data = await response.json();
    return data.success;
};

export const postOrder = (order) => async (dispatch) => {
    const response = await fetch(`/api/orders`, {
        method: 'POST',
        body: JSON.stringify(order)
    })
    const data = await response.json();
    dispatch(createOrder(data.order));
    return (response);
};


const initialState = {
    currentOrder: null,
    allOrders: null
}

const orderReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case CREATE_ORDER: {
            newState = { ...state };
            newState = Object.assign(action.order, newState);
            return newState
        }
        case GET_ORDER_DETAILS:
            newState = Object.assign({}, state);
            newState.currentOrder = action.payload
            return newState;
        case GET_ORDER_HISTORY:
            newState = Object.assign({}, state);
            newState.allOrders = action.payload;
            return newState;
        case REMOVE_ORDER:
            newState = Object.assign({}, state);
            newState.allOrders = state.allOrders.filter(order => {
                return order.id !== action.payload;
            });
            newState.currentOrder = null;
            return newState;
        default:
            return state;
    }
};

export default orderReducer;
