from .db import db

class Cart_Item(db.Model):
    __tablename__ = 'cart_items'

    id = db.Column(db.Integer, primary_key=True)
    quantity = db.Column(db.Integer, nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    # implicit associtation
    # => user
    # => product

    def to_dict(self):
        return{
            'id': self.id,
            'productId': self.product.to_dict()['id'],
            'quantity': self.quantity,
            'title': self.product.to_dict()['title'],
            'price': self.product.to_dict()['price'],
            'basePrice': self.product.to_dict()['price'],
            'description': self.product.to_dict()['description'],
            'image': self.product.to_dict()['images'][0]['url']
        }
