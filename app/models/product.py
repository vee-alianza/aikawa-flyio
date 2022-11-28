from .db import db

class Product(db.Model):
    __tablename__ = 'products'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False, unique=True)
    price = db.Column(db.Float(precision=2, asdecimal=False), nullable=False)
    description = db.Column(db.Text, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)

    ordered_items = db.relationship('Product_Order', backref='product', cascade='all, delete')
    all_reviews = db.relationship('Review', backref='product', cascade='all, delete')
    cart_items = db.relationship('Cart_Item', backref='product', cascade='all, delete')
    images = db.relationship('Product_Image', backref='product', cascade='all, delete')

    @property
    def rating(self):
        try:
            ratings = self.all_reviews
            total = 0

            for user_review in ratings:
                total += user_review.rating

            return total / len(ratings)
        except ZeroDivisionError:
            return 0

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'price': self.price,
            'description': self.description,
            'quantity': self.quantity,
            'images': [image.to_dict() for image in self.images],
            'rating': self.rating,
            'numReviews': len(self.all_reviews)
        }

    def to_dict_with_reviews(self):
        return {
            'id': self.id,
            'title': self.title,
            'price': self.price,
            'description': self.description,
            'quantity': self.quantity,
            'images': [image.to_dict() for image in self.images],
            'rating': self.rating,
            'numReviews': len(self.all_reviews),
            'reviews': [review.to_dict() for review in reversed(self.all_reviews)]
        }

    def to_cart_item(self):
        return {
            'productId': self.id,
            'title': self.title,
            'price': self.price,
            'basePrice': self.price,
            'description': self.description,
            'image': self.images[0].to_dict()['url'],
            'quantity': 1
        }
