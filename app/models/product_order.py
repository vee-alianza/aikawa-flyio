from sqlalchemy import ForeignKey
from .db import db

class Product_Order(db.Model):
    __tablename__ = 'product_orders'

    id = db.Column(db.Integer, primary_key=True)
    quantity = db.Column(db.Integer, nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id', ondelete='CASCADE'), nullable=False)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id', ondelete='CASCADE'), nullable=False)

    # implicit associations
    # => product
    # => order

    def to_dict(self):
        return{
            'id': self.id,
            'quantity': self.quantity,
            'productId': self.product_id,
            'orderId': self.order_id,
            'title': self.product.to_dict()['title'],
            'description': self.product.to_dict()['description'],
            'image': self.product.to_dict()['images'][0]['url'],
            'basePrice': self.product.to_dict()['price'],
            'totalPrice': float(self.quantity) * float(self.product.to_dict()['price'])
        }
