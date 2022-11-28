# from tokenize import String
from flask_wtf import Flaskform
from sqlalchemy import Integer
from wtforms import StringField, TextAreaField, IntegerField, SubmitField
from wtforms.validators import DataRequired, ValidationError, Length
from app.models import Review

class ProductReview(Flaskform):
    title = StringField('title', validators=[DataRequired()])
    content = TextAreaField('content', validators=[DataRequired(), Length(max=200, message='Comment is more than 200 characters.')])
    rating = IntegerField('rating', validators=[DataRequired()])
    user_id = IntegerField('user_id')
    product_id = IntegerField('product_id')
