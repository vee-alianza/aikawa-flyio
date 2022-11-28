import re
from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Email, ValidationError
from app.models import User


email_regex_validator = r"(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)"


def validate_email(form, field):
    # Checking if email is valid
    email = field.data
    if not re.match(email_regex_validator, email):
        raise ValidationError('Invalid email.')

    # Checking if length of email is valid
    if len(email) > 255:
        raise ValidationError('Email must be less than 255 characters.')

    # Checking if user exists
    user = User.query.filter(User.email == email).first()
    if user:
        raise ValidationError('Email address is already in use.')


def validate_username(form, field):
    # Checking if length of username is valid
    username = field.data
    if len(username) > 40:
        raise ValidationError('Username must be less than 41 characters.')
    if len(username) < 5:
        raise ValidationError('Username must be at least 5 characters.')

    # Checking if username is already in use
    user = User.query.filter(User.username == username).first()
    if user:
        raise ValidationError('Username is already in use.')


def validate_password(form, field):
    # Checking if length of password is valid
    password = field.data
    if len(password) < 5:
        raise ValidationError('Password must be at least 5 characters.')

class SignUpForm(FlaskForm):
    username = StringField(
        'username', validators=[DataRequired(), validate_username])
    email = StringField('email', validators=[DataRequired(), validate_email])
    password = StringField('password', validators=[DataRequired(), validate_password])
