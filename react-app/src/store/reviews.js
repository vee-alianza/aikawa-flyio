import { getUserProductReview } from "./products";

export const updateUserReview = (review) => async (dispatch) => {
    const response = await fetch(`/api/reviews/${review.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ review })
    });
    const data = await response.json();
    return data;
};

export const deleteUserReview = (reviewId) => async (dispatch) => {
    const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE'
    });
    return response.ok;
};

export const getUserProductReviewThunk = (productId) => async (dispatch) => {
    const response = await fetch(`/api/reviews/products/${productId}`);
    if (response.ok) {
        const data = await response.json();
        dispatch(getUserProductReview(data.hasReviewed));
    }
    return response.ok;
};

export const addUserReview = (review) => async (dispatch) => {
    const response = await fetch('/api/reviews/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ review })
    });
    const data = await response.json();
    if (data.success) {
        dispatch(getUserProductReview(true));
    }
    return data;
};
