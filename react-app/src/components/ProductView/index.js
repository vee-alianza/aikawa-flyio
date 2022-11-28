import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getUserProductReviewThunk } from '../../store/reviews';
import { getProductDetailsThunk } from '../../store/products';
import AddToCart from '../ProductsPage/AddToCart';
import AddReviewModal from './AddReviewModal';
import ReviewCard from './ReviewCard';
import './index.css';

const ProductView = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const product = useSelector(state => state.products.currentProduct);
  const [displayImg, setDisplayImg] = useState('');
  const [prevImg, setPrevImg] = useState('');
  const [previewImgClicked, setPreviewImgClicked] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [isReviewed, setIsReviewed] = useState(true);

  useEffect(() => {
    dispatch(getProductDetailsThunk(productId));
  }, [dispatch, productId]);

  useEffect(() => {
    if (product) {
      setDisplayImg(product.images[0].url);
      setReviews(product.reviews);
      dispatch(getUserProductReviewThunk(product.id));
    }
  }, [dispatch, product]);

  return (
    <>
      <div className='single-product-view__container'>
        {product &&
          <div>
            <div className='single-product-details__container'>
              <div className='product-details__left'>
                <img
                  className='single-product__image'
                  alt={product.title}
                  src={displayImg}
                />
                <div className='selector__container'>
                  {product.images.map((image) => (
                    <div
                      className='image__selector'
                      key={image.id}
                      onClick={() => {
                        setDisplayImg(image.url);
                        setPreviewImgClicked(true);
                      }}
                      onMouseEnter={() => {
                        setPrevImg(displayImg);
                        setDisplayImg(image.url);
                      }}
                      onMouseLeave={() => {
                        if (!previewImgClicked) {
                          setPrevImg('');
                          setDisplayImg(prevImg);
                        } else {
                          setPreviewImgClicked(false);
                        }
                      }}
                    />
                  ))}
                </div>
                <div className='single-product__description'>
                  {product.description}
                </div>
              </div>
              <div className='product-details__right'>
                <AddToCart product={product} />
              </div>
            </div>
            <AddReviewModal
              productId={product.id}
              isReviewed={isReviewed}
              setIsReviewed={setIsReviewed}
              setReviews={setReviews}
            />
            <div className='single-product__reviews'>
              {reviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  setReviews={setReviews}
                  setIsReviewed={setIsReviewed}
                />
              ))}
            </div>
          </div>
        }
      </div>
    </>
  );
};

export default ProductView;
