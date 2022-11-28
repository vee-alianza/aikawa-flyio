import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "../../context/Modal";
import { addUserReview } from "../../store/reviews";
import ReviewForm from "./ReviewForm";

const AddReviewModal = (props) => {
  const {
    productId,
    isReviewed,
    setIsReviewed,
    setReviews
  } = props;
  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user);
  const hasUserReview = useSelector(state => state.products.hasUserReview);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(1);
  const [errors, setErrors] = useState({ title: '', content: '', rating: '' });

  useEffect(() => {
    if (hasUserReview !== null) {
      setIsReviewed(hasUserReview);
    }
  }, [setIsReviewed, hasUserReview]);

  useEffect(() => {
    if (!showModal) {
      setTitle('');
      setContent('');
      setRating(1);
    }
  }, [showModal]);

  const handleSubmit = async () => {
    const data = await dispatch(addUserReview({ productId, title, content, rating }));
    if (data.review) {
      setReviews((prev) => {
        return [data.review, ...prev];
      });
      setShowModal(false);
      setTitle('');
      setContent('');
      setRating(1);
      setIsReviewed(true);
    } else if (data.errors) {
      data.errors.forEach((error) => {
        const errMsg = error.split(':')[1].trim();
        if (error.includes('title')) {
          setErrors((prev) => ({ ...prev, title: errMsg }));
        }
        if (error.includes('content')) {
          setErrors((prev) => ({ ...prev, content: errMsg }));
        }
        if (error.includes('rating')) {
          setErrors((prev) => ({ ...prev, rating: errMsg }));
        }
      });
    }
  };

  return (
    <>
      {user && !isReviewed &&
        <div>
          <button
            className='add-review__btn'
            onClick={() => setShowModal(true)}
          >
            Add your review
          </button>
          {showModal &&
            <Modal onClose={() => setShowModal(false)}>
              <ReviewForm
                title={title}
                setTitle={setTitle}
                content={content}
                setContent={setContent}
                rating={rating}
                setRating={setRating}
                handleSubmit={handleSubmit}
                setShowModal={setShowModal}
                errors={errors}
                setErrors={setErrors}
              />
            </Modal>
          }
        </div>
      }
    </>
  );
};

export default AddReviewModal;
