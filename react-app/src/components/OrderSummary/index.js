import { useEffect, useState } from 'react';
import { QuantityPicker } from 'react-qty-picker';
import { FaRegTrashAlt } from 'react-icons/fa';
import { BsPencilSquare } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { getOrderDetailsThunk, updateOrderItemQty, removeOrderItem, submitUserOrder, cancelUserOrder } from '../../store/orders';
import EditAddressModal from './EditAddressModal';
import './index.css';

let delayedUpdate = {};
const initShippingAddress = {
  firstName: '',
  lastName: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  country: ''
};

const OrderSummary = () => {
  const { orderId } = useParams();
  const toUSD = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
  const dispatch = useDispatch();
  const history = useHistory();
  const order = useSelector(state => state.orders.currentOrder);
  const user = useSelector(state => state.session.user);
  const shippingDetails = useSelector(state => state.session.shippingDetails);
  const [orderItems, setOrderItems] = useState([]);
  const [orderTotal, setOrderTotal] = useState(0);
  const [shippingAddress, setShippingAddress] = useState({ ...initShippingAddress });
  const [missingShipInfo, setMissingShipInfo] = useState(true);

  useEffect(() => {
    dispatch(getOrderDetailsThunk(orderId));
    return () => delayedUpdate = {};
  }, [dispatch, orderId]);

  useEffect(() => {
    if (order) {
      let totalPrice = 0;

      for (let i = 0; i < order.ordered_items.length; i++) {
        totalPrice += order.ordered_items[i].totalPrice;
      }

      setOrderItems(order.ordered_items);
      setOrderTotal(totalPrice);
    }
  }, [order]);

  useEffect(() => {
    if (shippingDetails) {
      let validFieldCount = 0;
      if (shippingDetails.firstName) {
        setShippingAddress((prev) => ({ ...prev, firstName: shippingDetails.firstName }));
        validFieldCount++;
      } else {
        setShippingAddress((prev) => ({ ...prev, firstName: '' }));
      }
      if (shippingDetails.lastName) {
        setShippingAddress((prev) => ({ ...prev, lastName: shippingDetails.lastName }));
        validFieldCount++;
      } else {
        setShippingAddress((prev) => ({ ...prev, lastName: '' }));
      }
      if (shippingDetails.address) {
        setShippingAddress((prev) => ({ ...prev, address: shippingDetails.address }));
        validFieldCount++;
      } else {
        setShippingAddress((prev) => ({ ...prev, address: '' }));
      }
      if (shippingDetails.city) {
        setShippingAddress((prev) => ({ ...prev, city: shippingDetails.city }));
        validFieldCount++;
      } else {
        setShippingAddress((prev) => ({ ...prev, city: '' }));
      }
      if (shippingDetails.state) {
        setShippingAddress((prev) => ({ ...prev, state: shippingDetails.state }));
        validFieldCount++;
      } else {
        setShippingAddress((prev) => ({ ...prev, state: '' }));
      }
      if (shippingDetails.zip) {
        setShippingAddress((prev) => ({ ...prev, zip: shippingDetails.zip }));
        validFieldCount++;
      } else {
        setShippingAddress((prev) => ({ ...prev, zip: '' }));
      }
      if (shippingDetails.country) {
        setShippingAddress((prev) => ({ ...prev, country: shippingDetails.country }));
        validFieldCount++;
      } else {
        setShippingAddress((prev) => ({ ...prev, country: '' }));
      }
      if (validFieldCount === 0) {
        setMissingShipInfo(true);
      } else {
        setMissingShipInfo(false);
      }
    } else {
      setShippingAddress({ ...initShippingAddress });
    }
  }, [shippingDetails]);

  const handleQtyChange = (value, itemTitle, orderItemId) => {
    setOrderItems(prev => {
      return prev.map((item) => {
        if (item.title === itemTitle) {
          const itemCopy = { ...item };
          itemCopy.quantity = value;
          itemCopy.totalPrice = itemCopy.basePrice * value;
          total += itemCopy.totalPrice;
          return itemCopy;
        } else {
          total += item.totalPrice;
          return item;
        }
      });
    });

    let total = 0;

    for (let i = 0; i < orderItems.length; i++) {
      if (orderItems[i].title === itemTitle) {
        total += orderItems[i].basePrice * value;
      } else {
        total += orderItems[i].basePrice * orderItems[i].quantity;
      }
    }

    setOrderTotal(total);
    clearTimeout(delayedUpdate[orderItemId]);
    delayedUpdate[orderItemId] = setTimeout(() => {
      dispatch(updateOrderItemQty(orderItemId, value));
    }, 500);
  };

  const handleRemoveOrderItem = async (orderItemId) => {
    clearTimeout(delayedUpdate[orderItemId]);
    const success = await dispatch(removeOrderItem(orderItemId));
    if (success) {
      if (orderItems.length === 1) {
        const success = await dispatch(cancelUserOrder(order.id));
        if (success) {
          history.push('/orderhistory');
        }
      }

      let total = 0;
      setOrderItems(prev => prev.filter((item) => item.id !== orderItemId));
      for (let i = 0; i < orderItems.length; i++) {
        if (orderItems[i].id !== orderItemId) {
          total += orderItems[i].totalPrice;
        }
      }
      setOrderTotal(total);
    }
  };

  if (!user) return history.push('/products');

  return (
    <div className='order-details__container'>
      <h1>Order details:</h1>
      {order &&
        <div>
          <div className='order-details__left'>
            <div>
              <h2>{`Order number: ${order.id}`}</h2>
              <h2>{`Status: ${order.status}`}</h2>
            </div>
            <h3>Items:</h3>
            {orderItems.map((item) => (
              <div
                key={item.id}
                className='order-item__container'
                onClick={(e) => {
                  if (e.target.className === 'order-item__container' || !e.target.className) {
                    history.push(`/products/${item.productId}`);
                  }
                }}
              >
                <div>
                  <img
                    src={item.image}
                    alt={item.title}
                    onClick={() => history.push(`/products/${item.productId}`)}
                  />
                  <div>
                    <div>{`${toUSD.format(item.totalPrice)}`}</div>
                    {order.status === 'Pending' &&
                      <div>
                        <QuantityPicker
                          className='order-item__qty-picker'
                          min={1}
                          max={99}
                          value={item.quantity}
                          onChange={(value) => handleQtyChange(value, item.title, item.id)}
                        />
                        <button
                          className='order-item__delete-btn'
                          onClick={() => handleRemoveOrderItem(item.id)}
                        >
                          <FaRegTrashAlt />
                        </button>
                      </div>
                    }
                    {order.status === 'Delivered' &&
                      <div className='delivered-item__qty'>
                        {`Quantity: ${item.quantity}x`}
                      </div>
                    }
                  </div>
                </div>
                <div
                  className='order-item__item-title'
                  onClick={() => history.push(`/products/${item.productId}`)}
                >
                  {item.title}
                </div>
                <div
                  className='order-item__item-description'
                  onClick={() => history.push(`/products/${item.productId}`)}
                >
                  {item.description}
                </div>
              </div>
            ))}
          </div>
          <div className='order-details__right'>
            <h2>{`Total: ${toUSD.format(orderTotal)}`}</h2>
            <div className='order-details__shipping-info'>
              <div className='edit-shipping-details'>
                {order.status === 'Pending' ? <h3>Ship to:</h3> : <h3>Shipped to:</h3>}
                {order.status === 'Pending' &&
                  <div>
                    <EditAddressModal
                      shippingAddress={shippingAddress}
                      setShippingAddress={setShippingAddress}
                      setMissingShipInfo={setMissingShipInfo}
                    />
                  </div>
                }
              </div>
              <div>
                <div className='shipping-address__details-container'>
                  <div>
                    <div>{`${shippingAddress.firstName} ${shippingAddress.lastName}`}</div>
                    {shippingAddress.address && shippingAddress.city &&
                      <div>{`${shippingAddress.address}, ${shippingAddress.city}`}</div>
                    }
                    {shippingAddress.address && !shippingAddress.city &&
                      <div>{`${shippingAddress.address}`}</div>
                    }
                    {!shippingAddress.address && shippingAddress.city &&
                      <div>{`${shippingAddress.address}`}</div>
                    }
                    <div>{`${shippingAddress.state} ${shippingAddress.zip}`}</div>
                    <div>{shippingAddress.country}</div>
                  </div>
                  {missingShipInfo &&
                    <h3 className='missing-shipping-info'
                    >
                      Please click on the <BsPencilSquare /> to add a shipping address!
                    </h3>
                  }
                  {order.status === 'Pending' && !missingShipInfo &&
                    <div>
                      <button
                        className='order-details__submit-btn'
                        onClick={async () => {
                          const success = await dispatch(submitUserOrder(order.id));
                          if (success) {
                            history.push('/orderhistory');
                          }
                        }}
                      >
                        Submit order
                      </button>
                      <button
                        className='order-details__cancel-btn'
                        onClick={async () => {
                          const success = await dispatch(cancelUserOrder(order.id));
                          if (success) {
                            history.push('/orderhistory');
                          }
                        }}
                      >
                        Cancel order
                      </button>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  );
};

export default OrderSummary;
