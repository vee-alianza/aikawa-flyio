from .db import db

class Product_Image(db.Model):
    __tablename__ = 'product_images'

    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.Text)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)

# implicit association
# => product

    def to_dict(self):
        return{
            'id': self.id,
            'url': self.url,
            'product_id': self.product_id
        }
