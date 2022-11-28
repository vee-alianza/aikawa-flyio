
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { IoPlanetSharp, IoPlanetOutline } from 'react-icons/io5';
import { getProductsThunk } from '../../store/products';
import Rating from 'react-rating';
import './index.css'

const ProductsPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const products = useSelector(state => state.products.allProducts);
  const [applyHideClass, setApplyHideClass] = useState('');

  useEffect(() => {
    if (!products) {
      dispatch(getProductsThunk(0));
    }
  }, [dispatch, products]);

  const navigateToProduct = (productId) => {
    history.push(`/products/${productId}`);
  };

  const loadMore = async () => {
    const productsQty = await dispatch(getProductsThunk(products[products.length - 1].id));

    if (!productsQty) {
      setApplyHideClass('hide');
    }
  };

  return (
    <div className='main-products__page'>
      <h1>Product Page</h1>
      <div className='products__container'>
        <div className='product-details__container'>
          {products && products.map((product) => (
            <div
              className='product__image__container'
              key={product.id}
              onClick={() => navigateToProduct(product.id)}
            >
              <img
                className='product__image'
                src={product.images[0].url}
                alt={product.title} />
              <div className='product__image__overlay'>
                <img
                  className='product__image'
                  src={product.images[1].url}
                  alt={product.title} />
              </div>
              <h3>{product.title}</h3>
              <Rating
                initialRating={product.rating}
                emptySymbol={<IoPlanetOutline />}
                fullSymbol={<IoPlanetSharp />}
                readonly
              />
              {product.numReviews >= 1 &&
                <p>{`${product.numReviews} ${product.numReviews === 1 ? 'review' : 'reviews'}`}</p>
              }
              <p>{`$${product.price}`}</p>
            </div>
          ))}
        </div>
        <button
          className={`load-more__button ${applyHideClass}`}
          onClick={loadMore}
        >
          Load More
        </button>
      </div>
    </div>
  );
};

export default ProductsPage;
