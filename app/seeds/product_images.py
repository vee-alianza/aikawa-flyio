from faker import Faker
from app.models import db, Product_Image, Product
import json

fake = Faker()

def seed_product_images():
    with open('./app/seeds/products/random-furniture-img-data.json') as file:
        images = json.load(file)

    products = Product.query.all()

    for i in range(len(products)):
        lucky_images = []
        used_combinations = set()

        for _ in range(fake.random_int(min=2, max=5)):
            lucky_furniture_img_idx = fake.random_int(min=0, max=(len(images) - 1))

            while lucky_furniture_img_idx in used_combinations or images[lucky_furniture_img_idx]['attributes']['height'] >= images[lucky_furniture_img_idx]['attributes']['width']:
                lucky_furniture_img_idx = fake.random_int(min=0, max=(len(images) - 1))

            used_combinations.add(lucky_furniture_img_idx)
            lucky_images.append(images[lucky_furniture_img_idx]['attributes']['image']['medium'])

        for img in lucky_images:
            db.session.add(Product_Image(
                url = img,
                product_id = products[i].id
            ))

    db.session.commit()

def undo_product_images():
    db.session.execute('TRUNCATE product_images RESTART IDENTITY CASCADE;')
    db.session.commit()
