import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getOrderHistoryThunk } from '../../store/orders';
import './index.css';

const OrderHistory = () => {
    const toUSD = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
    const history = useHistory();
    const dispatch = useDispatch();
    const orders = useSelector(state => state.orders.allOrders);

    useEffect(() => {
        dispatch(getOrderHistoryThunk());
    }, [dispatch]);

    return (
        <div className='order-history__container'>
            {orders &&
                orders.map((order) => (
                    <div
                        key={order.id}
                        className='order-history__subcontainer'
                    >
                        <div
                            className='order-history__details'
                            onClick={() => history.push(`/ordersummary/${order.id}`)}
                        >
                            <div>{`Order #: ${order.id}`}</div>
                            <div>{`Status: ${order.status}`}</div>
                            <div>{`Ordered: ${new Date(order.createdAt).toDateString()}`}</div>
                            <div>{`Total: ${toUSD.format(order.total_cost)}`}</div>
                        </div>
                        <div className='order-history__items'>
                            {order.ordered_items.map((item) => (
                                <div
                                    key={item.id}
                                    className='order-history__ordered-items-container'
                                    onClick={() => history.push(`/products/${item.productId}`)}
                                >
                                    <div>
                                        {item.title}
                                    </div>
                                    <div className='ordered-items__qty-price'>
                                        <div>
                                            {`${item.quantity}x`}
                                        </div>
                                        <div>
                                            {toUSD.format(item.totalPrice)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            }
            {orders && !orders.length &&
                <h1>You do not have any order history</h1>
            }
        </div>
    );
};

export default OrderHistory;
