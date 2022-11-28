<h1 align= "center" dir="auto"><a href="https://the-aikawa.herokuapp.com/">🪐🌠Aikawa🌠🪐</a></h1> <a name="top"> </a>
<h5 align= "center" dir="auto">
  Created by:
      <a href="https://github.com/vee-alianza">Vee Alianza</a>
      </br>
   <a href="https://the-aikawa.herokuapp.com/">» Live Link «</a>
</h5>
<h4 align= "center" dir="auto">
  <a href="https://github.com/vee-alianza/aikawa/wiki">» Explore the Wiki «</a>
  </br>
  <a href="https://github.com/vee-alianza/aikawa#-welcome-to-esena-">» Table of Contents «</a>
  <h4 align= "center" dir="auto">
      |
      <a href="https://github.com/vee-alianza/aikawa#---explore-the-wiki-">About</a>
      |
      <a href="https://github.com/vee-alianza/aikawa#technologies-used">Technologies Used</a>
      |
      <a href="https://github.com/vee-alianza/aikawa#getting-started">Getting Started</a>
      |
      <a href="https://github.com/vee-alianza/aikawa#features">Features</a>
      |
</h4>

Aikawa is an e-commerce app inspired by [Ikea](https://www.ikea.com/), where users can explore the latest trends with affordable prices that's out of this world!

## Technologies Used
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white)
</br>

![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![Flask](https://img.shields.io/badge/flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Heroku](https://img.shields.io/badge/heroku-%23430098.svg?style=for-the-badge&logo=heroku&logoColor=white)
## Getting started
1. Clone this repository (only this branch)

   ```bash
   git clone https://github.com/vee-alianza/aikawa.git
   ```

2. Install dependencies

      ```bash
      pipenv install --dev -r dev-requirements.txt && pipenv install -r requirements.txt
      ```

3. Create a **.env** file based on the example with proper settings for your
   development environment
4. Setup your PostgreSQL user, password and database and make sure it matches your **.env** file

5. Get into your pipenv, migrate your database, seed your database, and run your flask app

   ```bash
   pipenv shell
   ```

   ```bash
   flask db upgrade
   ```

   ```bash
   flask seed all
   ```

   ```bash
   flask run
   ```

6. To run the React App in development, checkout the [README](./react-app/README.md) inside the `react-app` directory.

***


*IMPORTANT!*
   psycopg2-binary MUST remain a dev dependency because you can't install it on alpine-linux.
   There is a layer in the Dockerfile that will install psycopg2 (not binary) for us.
***
## Helpful commands
| Command                        | Purpose                                                                                                                                      |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `pipenv shell`                 | Open your terminal in the virtual environment and be able to run flask commands without a prefix                                             |
| `pipenv run`                   | Run a command from the context of the virtual environment without actually entering into it. You can use this as a prefix for flask commands |
| `flask db upgrade`             | Check in with the database and run any needed migrations                                                                                     |
| `flask db downgrade`           | Check in with the database and revert any needed migrations                                                                                  |
| `flask seed all`               | Just a helpful syntax to run queries against the db to seed data. See the **app/seeds** folder for reference and more details                |
| `heroku login -i`              | Authenticate your heroku-cli using the command line. Drop the -i to authenticate via the browser                                             |
| `heroku authorizations:create` | Once authenticated, use this to generate an Oauth token                                                                                      |
| `heroku run -a <app name>`     | Run a command from within the deployed container on Heroku                                                                                   |

## Features
With this application, you can:

* create orders and add items to your cart
* post reviews on products
* rate products
* view previous orders

### Authentication
![Log-In](https://user-images.githubusercontent.com/92604480/174603146-21d9ac06-44c8-4905-8ff6-1db3c955bb83.png)
![Sign-Up](https://user-images.githubusercontent.com/92604480/174603222-38ab2e4e-987c-4950-bc1e-096815384ba7.png)
### Homepage
![Hompage](https://user-images.githubusercontent.com/92604480/174603461-d3e92bf9-cc7a-4368-865c-08a6a2c20ad0.png)
### Products
![Products](https://user-images.githubusercontent.com/92604480/174603546-cf971690-3729-49b3-8da0-2589c90f1359.png)

### Add to Cart
![Shopping Cart](https://user-images.githubusercontent.com/92604480/174603701-01e44d1d-1b97-40b8-acb8-af3d02929531.png)
### Reviews
![Reviews](https://user-images.githubusercontent.com/92604480/174603635-5105467d-c0b7-4003-ad16-4e1c22d3fc67.png).
### Order History
![Order History](https://user-images.githubusercontent.com/92604480/174621931-aa12af4c-10e9-4855-b00a-f5a9f2186072.png)

[Back to top](#top)
