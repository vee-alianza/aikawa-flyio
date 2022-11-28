import { useEffect, useState } from 'react';
import { HiPencilAlt } from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from '../../context/Modal';
import { updateUserReview } from '../../store/reviews';
import ReviewForm from './ReviewForm';

const EditReviewModal = ({ review, setReviews }) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState(review.title);
  const [content, setContent] = useState(review.content);
  const [rating, setRating] = useState(review.rating);
  const [errors, setErrors] = useState({ title: '', content: '', rating: '' });

  useEffect(() => {
    if (!showModal) {
      setTitle(review.title);
      setContent(review.content);
      setRating(review.rating);
    }
  }, [showModal, review.title, review.content, review.rating]);

  const handleEdit = async (reviewId) => {
    const data = await dispatch(updateUserReview({
      id: reviewId,
      title,
      content,
      rating
    }));

    if (!data.errors) {
      setReviews((prev) => {
        return prev.map((review) => {
          if (review.id === reviewId) {
            const reviewCopy = { ...review };
            reviewCopy.title = title;
            reviewCopy.content = content;
            reviewCopy.rating = rating;
            return reviewCopy;
          } else {
            return review;
          }
        });
      });
      setShowModal(false);
    } else {
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
      {user && user.id === review.user.id &&
        <div>
          <button
            className='edit-review__edit-btn'
            onClick={() => setShowModal(true)}
          >
            <HiPencilAlt />
          </button>
          {showModal &&
            <Modal onClose={() => setShowModal(false)}>
              <ReviewForm
                reviewId={review.id}
                title={title}
                setTitle={setTitle}
                content={content}
                setContent={setContent}
                rating={rating}
                setRating={setRating}
                handleEdit={handleEdit}
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

export default EditReviewModal;
