import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { FaRegTrashAlt } from 'react-icons/fa';
import { QuantityPicker } from 'react-qty-picker';
import {
  getUserCartThunk,
  removeCartProductThunk,
  checkoutCart,
  updateCartItemQty,
  setCartItemCount
} from '../../store/products';
import './index.css';


let delayedUpdate = {};

const ShoppingCart = () => {
  const toUSD = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
  const dispatch = useDispatch();
  const history = useHistory();
  const userCart = useSelector(state => state.products.userCart);
  const user = useSelector(state => state.session.user);
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    dispatch(getUserCartThunk());
  }, [dispatch]);

  useEffect(() => {
    if (userCart) {
      const itemMap = {};
      let totalPrice = 0;

      for (let i = 0; i < userCart.length; i++) {
        itemMap[userCart[i].title] = userCart[i].quantity;
        totalPrice += userCart[i].price;
      }

      setCartItems(userCart);
      setCartTotal(totalPrice);
    }

    return () => delayedUpdate = {};
  }, [dispatch, userCart]);

  const handleQtyChange = (value, productTitle, productId) => {
    value = Number(value);
    setCartItems(prev => {
      let quantity = 0;
      const newCartItems = prev.map((item) => {
        if (item.title === productTitle) {
          const itemCopy = { ...item };
          itemCopy.price = itemCopy.basePrice * value;
          itemCopy.quantity = value;
          quantity += itemCopy.quantity;
          return itemCopy;
        } else {
          quantity += item.quantity;
          return item;
        }
      });
      dispatch(setCartItemCount(quantity));
      return newCartItems;
    });


    let totalPrice = 0;

    cartItems.forEach((item) => {
      if (item.title === productTitle) {
        totalPrice += item.basePrice * value;
      } else {
        totalPrice += item.basePrice * item.quantity;
      }
    });

    setCartTotal(totalPrice);
    clearTimeout(delayedUpdate[productId]);
    delayedUpdate[productId] = setTimeout(() => {
      dispatch(updateCartItemQty(productId, value));
    }, 500);
  };

  const removeItemInCart = async (productId) => {
    clearTimeout(delayedUpdate[productId]);
    const success = await dispatch(removeCartProductThunk(productId));
    if (success) {
      setCartItems(prev => {
        return prev.filter((item) => item.productId !== productId);
      });
    }
  };

  const placeOrder = async () => {
    const orderedItems = [];

    for (let i = 0; i < cartItems.length; i++) {
      orderedItems.push({
        productId: cartItems[i].productId,
        quantity: cartItems[i].quantity
      });
    }

    const { success, orderId, status } = await dispatch(checkoutCart(orderedItems));

    if (success) {
      history.push(`/ordersummary/${orderId}`);
    } else if (status === 405 || status === 401) {
      window.alert('please log in');
    }
  };

  return (
    <div className='shopping-cart__container'>
      {userCart &&
        <>
          <div className='cart-items__container'>
            <h1>Shopping Cart</h1>
            {cartItems.map((item, idx) => (
              <div
                key={item.id}
                className='full-item__container'
              >
                <div
                  className='item__container'
                  onClick={() => history.push(`/products/${item.productId}`)}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                  />
                  <div className='item-details__container'>
                    <div>
                      <h3>
                        {item.title}
                      </h3>
                      <div>
                        {item.description}
                      </div>
                    </div>
                    <div className='item-price__div'>
                      {`$${item.price.toFixed(2)}`}
                    </div>
                  </div>
                </div>
                <div className='item-quantity__container'>
                  <div>
                    <QuantityPicker
                      min={1}
                      max={99}
                      value={item.quantity}
                      onChange={(value) => handleQtyChange(value, item.title, item.productId)}
                    />
                    <button
                      onClick={() => removeItemInCart(item.productId)}
                    >
                      <FaRegTrashAlt />
                    </button>
                  </div>
                  <div>** Limit quantity: 99 per customer.</div>
                </div>
              </div>
            ))}
            {cartItems.length === 0 &&
              <h1>YOUR CART IS EMPTY</h1>
            }
          </div>
          <div className='checkout-details__container'>
            <h2>Order Summary:</h2>
            <div className='order-total__container'>
              <div>Total:</div>
              <h2>{`${toUSD.format(cartTotal)}`}</h2>
            </div>
            {cartItems.length > 0 &&
              <div>
                <button
                  onClick={placeOrder}
                  disabled={user === null}
                >
                  Proceed to checkout
                </button>
                {user === null &&
                  <div>** Please <span onClick={() => history.push('/login')}>log in</span> or <span onClick={() => history.push('/sign-up')}>sign up</span> to check out items!</div>
                }
              </div>
            }
          </div>
        </>
      }
    </div >
  );
};

export default ShoppingCart;
