from faker import Faker
from app.models import db, User

fake = Faker()

# Adds a demo user, you can add other users here if you want
def seed_users():

    fake_profile_1 = fake.simple_profile()
    demo = User(
            username='Demo',
            email='demo@aa.io',
            password='password',
            first_name=fake_profile_1['name'].split(' ')[0],
            last_name=fake_profile_1['name'].split(' ')[1],
            address=fake_profile_1['address'].split('\n')[0],
            city=fake_profile_1['address'].split('\n')[1].split(',')[0],
            state=fake_profile_1['address'].split(' ')[-2],
            zip_code=fake_profile_1['address'].split(' ')[-1],
            country='US'
        )

    fake_profile_2 = fake.simple_profile()
    marnie = User(
            username='marnie',
            email='marnie@aa.io',
            password='password',
            first_name=fake_profile_2['name'].split(' ')[0],
            last_name=fake_profile_2['name'].split(' ')[1],
            address=fake_profile_2['address'].split('\n')[0],
            city=fake_profile_2['address'].split('\n')[1].split(',')[0],
            state=fake_profile_2['address'].split(' ')[-2],
            zip_code=fake_profile_2['address'].split(' ')[-1],
            country='US'
        )

    fake_profile_3 = fake.simple_profile()
    bobbie = User(
            username='bobbie',
            email='bobbie@aa.io',
            password='password',
            first_name=fake_profile_3['name'].split(' ')[0],
            last_name=fake_profile_3['name'].split(' ')[1],
            address=fake_profile_3['address'].split('\n')[0],
            city=fake_profile_3['address'].split('\n')[1].split(',')[0],
            state=fake_profile_3['address'].split(' ')[-2],
            zip_code=fake_profile_3['address'].split(' ')[-1],
            country='US'
        )

    db.session.add(demo)
    db.session.add(marnie)
    db.session.add(bobbie)

    for _ in range(fake.random_int(min=5, max=20)):
        fake_profile = fake.simple_profile()
        db.session.add(User(
            username=fake_profile['username'],
            email=fake_profile['mail'],
            password='password',
            first_name=fake_profile['name'].split(' ')[0],
            last_name=fake_profile['name'].split(' ')[1],
            address=fake_profile['address'].split('\n')[0],
            city=fake_profile['address'].split('\n')[1].split(',')[0],
            state=fake_profile['address'].split(' ')[-2],
            zip_code=fake_profile['address'].split(' ')[-1],
            country='US'
        ))

    db.session.commit()


# Uses a raw SQL query to TRUNCATE the users table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and RESET IDENTITY
# resets the auto incrementing primary key, CASCADE deletes any
# dependent entities
def undo_users():
    db.session.execute('TRUNCATE users RESTART IDENTITY CASCADE;')
    db.session.commit()
