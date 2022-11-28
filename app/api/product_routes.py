import uuid
from flask import Blueprint, request, render_template, session
from flask_login import login_required, current_user
from app.models import db, Product, Cart_Item, Order, Product_Order

product_routes = Blueprint('products', __name__)

@product_routes.route('/')
def get_products():
    """
    Gets all products
    """
    last_product_id = int(request.args.get('lastProductId'))
    if last_product_id <= 0:
        products = Product.query.filter(Product.id.between(1, 16)).order_by(Product.id.asc()).limit(16).all()
        return {'products':[product.to_dict() for product in products]}
    else:
        last_product_id += 1
        products = Product.query.filter(Product.id.between(last_product_id, last_product_id + 16)).order_by(Product.id.asc()).limit(16).all()
        return {'products':[product.to_dict() for product in products]}


@product_routes.route('/<int:product_id>')
def get_product_details(product_id):
    """
    Gets a product's details
    """
    product = Product.query.get(product_id)
    return {'product': product.to_dict_with_reviews()}


@product_routes.route('/cart')
def get_user_cart():
    """
    Gets a user's cart (an array of cart items)
    """
    cart_items_query = []

    try:
        # if user is logged in, just get cart items
        # from user's association
        cart_items_query = [item.to_dict() for item in current_user.cart]
    except AttributeError:
        # display cart items from logged-out
        # user's cart
        if 'user' in session and 'cart_items' in session['user']:
            cart_items_query = []
            for cart_item in session['user']['cart_items']:
                item = Product.query.get(cart_item['product_id'])
                cart_items_query.append(item.to_cart_item())

    cart_item_dict = {}
    cart_items = []

    for item in cart_items_query:
        if item['title'] not in cart_item_dict:
            cart_item_dict[item['title']] = item
            cart_item_dict[item['title']]['id'] = int(uuid.uuid4())
        else:
            cart_item_dict[item['title']]['quantity'] += item['quantity']
            cart_item_dict[item['title']]['price'] += item['price']
            cart_item_dict[item['title']]['basePrice'] = item['price']
            cart_item_dict[item['title']]['id'] = int(uuid.uuid4())

    for key in cart_item_dict:
        cart_items.append(cart_item_dict[key])

    return {'cartItems': cart_items}


@product_routes.route('/cart', methods=['PUT'])
@login_required
def place_user_order():
    """
    Creates order from user's submitted cart
    """
    cart_items = request.json['orderedItems']
    order_total = 0

    for item in cart_items:
        product = Product.query.get(item['productId'])
        order_total += product.price * float(item['quantity'])

    new_order = Order(
        status = 'Ordered',
        total_cost = order_total,
        user_id = current_user.id
    )
    db.session.add(new_order)
    db.session.commit()

    for item in cart_items:
        db.session.add(Product_Order(
            quantity = item['quantity'],
            product_id = item['productId'],
            order_id = new_order.id
        ))
        cart_items = Cart_Item.query.filter(
                Cart_Item.product_id == item['productId'],
                Cart_Item.user_id == current_user.id
            ).all()
        for item in cart_items:
            db.session.delete(item)
    db.session.commit()

    return {'success': True, 'orderId': new_order.id}


@product_routes.route('/cart', methods=['POST'])
@login_required
def checkout_user_cart():
    """
    Creates order preview from user's submitted cart
    """
    cart_items = request.json['orderedItems']

    if len(cart_items) < 1:
        return {'errors': ['No cart items to checkout.']}, 400

    order_total = 0

    for item in cart_items:
        product = Product.query.get(item['productId'])
        order_total += product.price * int(item['quantity'])

    new_order = Order(
        status = 'Pending',
        total_cost = order_total,
        user_id = current_user.id
    )
    db.session.add(new_order)
    db.session.commit()

    for item in cart_items:
        db.session.add(Product_Order(
            quantity = item['quantity'],
            product_id = item['productId'],
            order_id = new_order.id
        ))
        cart_items = Cart_Item.query.filter(
                Cart_Item.product_id == item['productId'],
                Cart_Item.user_id == current_user.id
            ).all()
        for item in cart_items:
            db.session.delete(item)
    db.session.commit()

    return {'success': True, 'orderId': new_order.id}

@product_routes.route('/cart/count')
def cart_item_count():
    """
    Gets the number of items in the cart
    """
    count = 0
    try:
        for item in current_user.cart:
            count += item.quantity
    except AttributeError:
        for item in session['user']['cart_items']:
            count += item['quantity']

    return {'cartItemCount': count}


@product_routes.route('/cart/<int:product_id>', methods=['PATCH'])
def update_cart_item_qty(product_id):
    """
    Updates item quantity in user's cart
    """
    items_list = []
    new_quantity = int(request.json['quantity'])

    try:
        for item in current_user.cart:
            if item.product_id == product_id:
                items_list.append(item)
        if len(items_list) > new_quantity:
            for i in range(len(items_list) - new_quantity):
                db.session.delete(items_list[i])
        elif len(items_list) < new_quantity:
            for i in range(new_quantity - len(items_list)):
                db.session.add(Cart_Item(
                    quantity = 1,
                    product_id = product_id,
                    user_id = current_user.id
                ))
        db.session.commit()
    except AttributeError:
        for item in session['user']['cart_items']:
            if item['product_id'] == product_id:
                items_list.append(item)
        if len(items_list) > new_quantity:
            new_list = []
            for item in session['user']['cart_items']:
                if item['product_id'] != product_id:
                    new_list.append(item)
            for i in range(new_quantity):
                new_list.append(items_list[i])
            session['user']['cart_items'] = new_list
        elif len(items_list) < new_quantity:
            for _ in range(new_quantity - len(items_list)):
                session['user']['cart_items'].append({
                    'id': int(uuid.uuid4()),
                    'quantity': 1,
                    'product_id': product_id
                })

    return {'success': True}


@product_routes.route('/cart/<int:product_id>', methods=['DELETE'])
def remove_item_from_cart(product_id):
    """
    Removes an item from a user's cart
    """
    try:
        cart_items = Cart_Item.query.filter(
                Cart_Item.product_id == product_id,
                Cart_Item.user_id == current_user.id
            ).all()
        for item in cart_items:
            db.session.delete(item)
        db.session.commit()
    except AttributeError:
        updated_cart = []
        for item in session['user']['cart_items']:
            if item['product_id'] != product_id:
                updated_cart.append(item)
        session['user']['cart_items'] = updated_cart
    return {'success': True}


@product_routes.route('/<int:product_id>', methods=['POST'])
def add_to_cart(product_id):
    """
    Adds a product to a user's cart
    """
    items_list = []

    try:
        # if user is logged in, simply add a
        # cart item with the associated user's id
        for item in current_user.cart:
            if item.product_id == product_id:
                items_list.append(item)
        if len(items_list) < 99:
            db.session.add(Cart_Item(
                quantity = 1,
                product_id = product_id,
                user_id = current_user.id
            ))
            db.session.commit()
    except AttributeError:
        # if a user is not logged in, create
        # server-side session for logged-out user
        if 'user' in session:
            for item in session['user']['cart_items']:
                if item['product_id'] == product_id:
                    items_list.append(item)
            if len(items_list) < 99:
                session['user']['cart_items'].append({
                    'id': int(uuid.uuid4()),
                    'quantity': 1,
                    'product_id': product_id
                })
        else:
            session['user'] = {
                'cart_items': [{
                    'quantity': 1,
                    'product_id': product_id
                }]
            }

    return {'success': True}
