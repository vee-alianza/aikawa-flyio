import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { logout } from '../../store/session';
import { BsCart2, BsFillPersonFill } from 'react-icons/bs';
import { getCartItemCountThunk } from '../../store/products';
import './index.css'

const NavBar = () => {
  const currentLocation = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const dropdownContainer = useRef();
  const user = useSelector(state => state.session.user);
  const cartItemCount = useSelector(state => state.products.cartItemCount);
  const [activeClass, setActiveClass] = useState({ home: 'active', products: '', orders: '' });
  const [dropdown, setDropdown] = useState(false);
  const [dispNavbar, setDispNavbar] = useState(true);
  const [isLoginSignup, setIsLoginSignup] = useState(false);
  const [logoClass, setLogoClass] = useState('');
  const [hasItemCount, setHasItemCount] = useState(false);

  useEffect(() => {
    if (!hasItemCount) {
      dispatch(getCartItemCountThunk());
      setHasItemCount(true);
    }
  }, [hasItemCount, dispatch]);

  useEffect(() => {
    if (currentLocation.pathname === '/') {
      setDispNavbar(false);
      setIsLoginSignup(false);
      setLogoClass('lift');
    } else if (currentLocation.pathname === '/login' || currentLocation.pathname === '/sign-up') {
      setDispNavbar(false);
      setIsLoginSignup(true);
    } else {
      setIsLoginSignup(false);
      if (currentLocation.pathname.includes('home')) {
        setActiveClass({ home: 'active', products: '' });
      } else if (currentLocation.pathname.includes('products')) {
        const productId = currentLocation.pathname.split('/');
        if (!productId[2]) {
          setActiveClass({ home: '', products: 'active', orders: '' });
        } else {
          setActiveClass({ home: '', products: '', orders: '' });
        }
      } else if (currentLocation.pathname === '/orderhistory') {
        setActiveClass({ home: '', products: '', orders: 'active' });
      } else {
        setActiveClass({ home: '', products: '', orders: '' });
      }
      setDispNavbar(true);
      setLogoClass('');
    }

  }, [currentLocation.pathname]);

  const onLogout = async (e) => {
    history.push('/');
    await dispatch(logout());
    setDropdown(false);
  };

  const handleNavigate = (e) => {
    const containerId = e.currentTarget.id;
    if (containerId.includes('home') && !currentLocation.pathname.includes('home')) {
      history.push('/home');
    } else if (containerId.includes('products')) {
      const productId = currentLocation.pathname.split('/');
      if (!currentLocation.pathname.includes('products') || parseInt(productId[2], 10)) {
        history.push('/products');
      }
    } else if (containerId.includes('shopping-cart') && !currentLocation.pathname.includes('shoppingcart')) {
      history.push('/shoppingcart');
    } else if (containerId.includes('orders') && currentLocation.pathname !== '/orderhistory') {
      history.push('/orderhistory');
    }
  };




  return (
    <>
      {!isLoginSignup &&
        <nav className={`navbar__container ${logoClass}`}>
          {!dispNavbar &&
            <div className='navbar__logo splash__page'>
              <img src='https://user-images.githubusercontent.com/92604480/176759065-3a3c62d0-c240-4721-ae19-9da798df7e60.png' alt='' />
            </div>
          }
          {dispNavbar &&
            <>
              <div className='navbar__logo main__logo'>
                <img src='https://user-images.githubusercontent.com/92604480/176781030-e3dad972-28db-4cd0-87ac-1fef591d5906.png' alt='' />
              </div>
              <ul className='navbar__navigation'>
                <li>
                  <button
                    id='navbar-home'
                    className={activeClass.home}
                    onClick={handleNavigate}
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    id='navbar-products'
                    className={activeClass.products}
                    onClick={handleNavigate}
                  >
                    Products
                  </button>
                </li>
                {user &&
                  <li>
                    <button
                      id='navbar-orders'
                      className={activeClass.orders}
                      onClick={handleNavigate}
                    >
                      Orders
                    </button>
                  </li>
                }
                <li style={{ float: 'right' }}>
                  <button
                    ref={dropdownContainer}
                    onFocus={() => setDropdown(true)}
                    onBlur={() => setDropdown(false)}
                  >
                    <BsFillPersonFill />
                    {dropdown &&
                      <div className='profile-dropdown__container'>
                        <div
                          onClick={() => {
                            history.push('/shoppingcart');
                            dropdownContainer.current.blur();
                          }}
                        >
                          Cart
                        </div>
                        {user &&
                          <div onClick={onLogout}>
                            Log out
                          </div>
                        }
                      </div>
                    }
                  </button>
                </li>
                <li style={{ float: 'right' }}>
                  <button
                    id='navbar-shopping-cart'
                    onClick={handleNavigate}
                  >
                    <div className={`number-of-items ${cartItemCount >= 100 ? 'over-100' : cartItemCount < 10 ? 'below-10' : ''}`}>
                      <span>{cartItemCount}</span>
                    </div>
                    <BsCart2 />
                  </button>
                </li>
              </ul>
            </>
          }
        </nav >
      }
    </>
  );
}

export default NavBar;
