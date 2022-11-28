from datetime import datetime
from .product_order import Product_Order
from .db import db

class Order(db.Model):
    __tablename__ = 'orders'

    id = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.String(50))
    total_cost = db.Column(
        db.Float(precision=2, asdecimal=False), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now())
    updated_at = db.Column(db.DateTime, default=datetime.now())

    # implicit associations
    # => user

    ordered_items = db.relationship('Product_Order', backref='order', cascade='all, delete', lazy='dynamic')



    def to_dict(self):
        return{
            'id': self.id,
            'status': self.status,
            'total_cost': self.total_cost,
            'user_id': self.user_id,
            'user': self.user.to_dict(),
            'ordered_items': [item.to_dict() for item in self.ordered_items.order_by(Product_Order.id.asc())],
            'createdAt': self.created_at,
            'updatedAt': self.updated_at
        }
