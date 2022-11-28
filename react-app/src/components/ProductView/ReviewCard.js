import Rating from "react-rating";
import { IoPlanetSharp, IoPlanetOutline } from 'react-icons/io5';
import EditReviewModal from './EditReviewModal';
import DeleteReviewModal from './DeleteReviewModal';

const ReviewCard = ({ review, setReviews, setIsReviewed }) => {
  return (
    <div className='user-review__container'>
      <div className='user-review__username'>
        {review.user.username}
      </div>
      <div className='user-rating__header-btns'>
        <div className='user-rating__header'>
          <Rating
            initialRating={review.rating}
            emptySymbol={<IoPlanetOutline />}
            fullSymbol={<IoPlanetSharp />}
            readonly
          />
          <div className='user-review__title'>
            {review.title}
          </div>
        </div>
        <div className='user-rating__edit-delete-btns'>
          <div>
            <EditReviewModal
              review={review}
              setReviews={setReviews}
            />
          </div>
          <div>
            <DeleteReviewModal
              review={review}
              setReviews={setReviews}
              setIsReviewed={setIsReviewed}
            />
          </div>
        </div>
      </div>
      <div className='user-review__created-at'>
        Reviewed on {new Date(review.createdAt).toLocaleDateString()}
      </div>
      <div>{review.content}</div>
    </div>
  );
};

export default ReviewCard;
