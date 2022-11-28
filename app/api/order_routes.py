import re
from flask import Blueprint, request, session
from app.models import db, Order, Product_Order, User
from flask_login import current_user, login_required, user_logged_in
# from app.forms.order_form import OrderForm

order_routes = Blueprint('orders', __name__)

zip_code_validator = r"^[0-9]{5}?$"
state_validator = r"^[a-zA-Z]+$"

@order_routes.route('/')
@login_required
def all_orders():
    user_orders = current_user.orders.all()
    return {'orders': [order.to_dict() for order in reversed(user_orders)]}


@order_routes.route('/cancel/<int:order_id>', methods=['DELETE'])
@login_required
def cancel_user_order(order_id):
    """
    Cancels a user's pending order
    """
    user_orders = current_user.orders.all()
    for order in user_orders:
        if (order_id == order.id):
            db.session.delete(order)
            db.session.commit()
            return {'success': True}
    return {'success': False}


@order_routes.route('/<int:order_id>', methods=['PUT'])
@login_required
def submit_user_order(order_id):
    """
    Updates a user's pending order to delivered
    """
    user_orders = current_user.orders.all()
    for order in user_orders:
        if (order_id == order.id):
            order.status = 'Delivered'
            db.session.commit()
            return {'success': True}
    return {'success': False}


@order_routes.route('/address', methods=['PATCH'])
@login_required
def update_shipping_address():
    """
    Update user's shipping address
    """
    errors = []
    new_shipping_address = request.json['shippingAddress']
    user = User.query.get(current_user.id)

    if len(new_shipping_address['firstName'].strip()) < 3:
        errors.append('firstName : First name must be 3 characters or more.')
    if len(new_shipping_address['firstName'].strip()) > 50:
        errors.append('firstName : First name must be 50 characters or less.')
    if len(new_shipping_address['lastName'].strip()) < 3:
        errors.append('lastName : Last name must be 3 characters or more.')
    if (len(new_shipping_address['lastName'].strip())) > 50:
        errors.append('lastName : Last name must be 50 characters or less.')
    if len(new_shipping_address['address'].strip()) < 3:
        errors.append('address : Address must be 3 characters or more.')
    if (len(new_shipping_address['address'].strip())) > 255:
        errors.append('address : Address must be 255 characters or less.')
    if len(new_shipping_address['city'].strip()) < 3:
        errors.append('city : City must be 3 characters or more.')
    if (len(new_shipping_address['city'].strip())) > 255:
        errors.append('city : City must be 255 characters or less.')
    if len(new_shipping_address['state'].strip()) != 2:
        errors.append('state : State must be 2 characters.')
    elif not re.match(state_validator, new_shipping_address['state'].strip()):
        errors.append('state : Invalid state.')
    if (len(new_shipping_address['zip'].strip())) != 5:
        errors.append('zip : Zip code must be 5 characters.')
    elif not re.match(zip_code_validator, new_shipping_address['zip'].strip()):
        errors.append('zip : Invalid zip code.')
    if len(new_shipping_address['country'].strip()) < 2:
        errors.append('country : Country must be 2 characters or more.')
    if (len(new_shipping_address['country'].strip())) > 50:
        errors.append('country : Country must be 50 characters or less.')
    if len(errors) > 0:
        return {'errorMsgs': errors}, 400

    user.first_name = new_shipping_address['firstName'].strip()
    user.last_name = new_shipping_address['lastName'].strip()
    user.address = new_shipping_address['address'].strip()
    user.city = new_shipping_address['city'].strip()
    user.state = new_shipping_address['state'].strip()
    user.zip_code = new_shipping_address['zip'].strip()
    user.country = new_shipping_address['country'].strip()
    db.session.commit()

    return {'success': True}


@order_routes.route('/<int:order_id>')
@login_required
def get_order_details(order_id):
    """
    Get single order details
    """
    order = Order.query.get(order_id)
    return {'order': order.to_dict(), 'shippingDetails': current_user.shipping_details()}


@order_routes.route('/<int:order_item_id>', methods=['PATCH'])
@login_required
def update_order_item_qty(order_item_id):
    """
    Updates the quantity for an order item
    """
    quantity = int(request.json['quantity'])
    order_items = current_user.pending.ordered_items.all()
    new_total = 0
    for item in order_items:
        if item.id == order_item_id:
            item.quantity = quantity
        new_total += item.quantity * item.to_dict()['basePrice']
    current_user.pending.total_cost = new_total
    db.session.commit()
    return {'success': True}


@order_routes.route('/<int:order_item_id>', methods=['DELETE'])
@login_required
def remove_order_item(order_item_id):
    """
    Removes an order item
    """
    for item in current_user.orders.all():
        for ordered_item in item.ordered_items.all():
            if ordered_item.id == order_item_id:
                order_item = ordered_item
    db.session.delete(order_item)
    db.session.commit()

    if len(current_user.pending.ordered_items.all()) == 0:
        db.session.delete(current_user.pending)
        db.session.commit()
    return {'success': True}
