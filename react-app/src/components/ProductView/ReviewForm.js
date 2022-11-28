import { IoPlanetSharp, IoPlanetOutline } from 'react-icons/io5';
import Rating from "react-rating";

const ReviewForm = (props) => {
  const {
    reviewId,
    title,
    setTitle,
    content,
    setContent,
    rating,
    setRating,
    handleEdit,
    handleSubmit,
    setShowModal,
    errors,
    setErrors
  } = props;

  return (
    <div className='review-form__container'>
      <div className='review-title__container'>
        <div>
          Title:
        </div>
        <input
          className='review-form-title__input'
          value={title}
          onChange={(e) => {
            if (errors.title) {
              setErrors((prev) => ({ ...prev, title: '' }));
            }
            setTitle(e.target.value);
          }}
        />
        {errors.title !== '' &&
          <div className='review-form__error-msg'>
            {errors.title}
          </div>
        }
      </div>
      <div>
        <div>
          Review:
        </div>
        <textarea
          className='review-form-content__input'
          value={content}
          onChange={(e) => {
            if (errors.content) {
              setErrors((prev) => ({ ...prev, content: '' }));
            }
            setContent(e.target.value);
          }}
        />
        {errors.content !== '' &&
          <div className='review-form__error-msg'>
            {errors.content}
          </div>
        }
      </div>
      <div className='review-form__rating-container'>
        <div className='review-form__rating-subcontainer'>
          <div>
            Rating:
          </div>
          <Rating
            initialRating={rating}
            emptySymbol={<IoPlanetOutline />}
            fullSymbol={<IoPlanetSharp />}
            onChange={(value) => setRating(value)}
          />
        </div>
        {errors.rating !== '' &&
          <div className='review-form__error-msg'>
            {errors.rating}
          </div>
        }
      </div>
      <div className='review-buttons__container'>
        <button
          onClick={() => reviewId ? handleEdit(reviewId) : handleSubmit()}
        >
          Submit
        </button>
        <button
          onClick={() => setShowModal(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ReviewForm;
