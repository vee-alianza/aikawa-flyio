import { useState } from 'react';
import { CgTrash } from 'react-icons/cg';
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from '../../context/Modal';
import { deleteUserReview } from '../../store/reviews';
import { getUserProductReview } from '../../store/products';

const DeleteReviewModal = ({ review, setReviews, setIsReviewed }) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user);
  const [showModal, setShowModal] = useState(false);

  const handleDelete = async (reviewId) => {
    const success = await dispatch(deleteUserReview(reviewId));

    if (success) {
      dispatch(getUserProductReview(false));
      setShowModal(false);
      setReviews((prev) => prev.filter((review) => review.id !== reviewId));
      setIsReviewed(false);
    }
  };

  return (
    <>
      {user && user.id === review.user.id &&
        <div>
          <button
            className='delete-review__delete-btn'
            onClick={() => setShowModal(true)}
          >
            <CgTrash />
          </button>
          {showModal &&
            <Modal onClose={() => setShowModal(false)}>
              <div className='delete-review__header'>
                Are you sure you want to delete this review?
              </div>
              <div className='delete-review-buttons__container'>
                <button
                  onClick={() => handleDelete(review.id)}
                >
                  Yes
                </button>
                <button
                  onClick={() => setShowModal(false)}
                >
                  No
                </button>
              </div>
            </Modal>
          }
        </div>
      }
    </>
  );
};

export default DeleteReviewModal;
