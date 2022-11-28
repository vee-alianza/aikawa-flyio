from faker import Faker
from app.models import db, User, Order, Product_Order, Product

fake = Faker()

def seed_orders():
  last_product_id = Product.query.order_by(Product.id.desc()).first().id

  for _ in range(fake.random_int(min=8, max=16)):
    total_cost = 0
    lucky_products = []
    for __ in range(fake.random_int(min=3, max=4)):
      lucky_product = Product.query.get(fake.random_int(min=1, max=last_product_id))
      lucky_products.append(lucky_product)
      total_cost += lucky_product.price
    new_order = Order(
      status = fake.random_element(elements=('Pending', 'Delivered')),
      total_cost = total_cost,
      user_id = 1
    )
    db.session.add(new_order)
    db.session.commit()
    for item in lucky_products:
      db.session.add(Product_Order(
        quantity = 1,
        product_id = item.id,
        order_id = new_order.id
      ))
      db.session.commit()


def undo_orders():
  db.session.execute('TRUNCATE orders RESTART IDENTITY CASCADE;')
  db.session.commit()
