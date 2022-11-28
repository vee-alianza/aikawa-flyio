from faker import Faker
from app.models import db, Product, User, Review

fake = Faker()

def seed_reviews():
  last_product_id = Product.query.order_by(Product.id.desc()).first().id
  last_user_id = User.query.order_by(User.id.desc()).first().id
  used_combinations = set()

  for _ in range(fake.random_int(min=200, max=last_product_id * last_user_id)):
    lucky_user = fake.random_int(min=1, max=last_user_id)
    lucky_product = fake.random_int(min=1, max=last_product_id)
    lucky_combination = f'{lucky_user}-{lucky_product}'

    while lucky_combination in used_combinations:
      lucky_user = fake.random_int(min=1, max=last_user_id)
      lucky_product = fake.random_int(min=1, max=last_product_id)
      lucky_combination = f'{lucky_user}-{lucky_product}'

    used_combinations.add(lucky_combination)

    db.session.add(Review(
      title = fake.sentence(nb_words=4),
      content = fake.paragraph(nb_sentences=3),
      rating = fake.random_int(min=1, max=5),
      user_id = lucky_user,
      product_id = lucky_product
    ))

  db.session.commit()


def undo_reviews():
    db.session.execute('TRUNCATE reviews RESTART IDENTITY CASCADE;')
    db.session.commit()
