# WaterlooEats (CS348 Project)

WaterlooEats is a database-driven web application designed to help users in the Kitchener-Waterloo area discover, rate, and track local restaurants. This project uses FastAPI for the backend, React for the frontend, and SQLite as the database.

---
## Sample test
- located in the sample directory
## Production test
- located in the production directory
## Fetching sample data
To fetch sample (and ultimately production) data, use the `fetch_clean_data.py` script, specify the range (radius) of the restaurant search to increase the number of tuples fetched.
## Fetching production data!
To fetch the production data we have migrated from `fetch_clean_data.py` script to the `fetch_grid.py` script that repeatedly makes places api calls at different co-ordinates, along the bounding box of kitchener waterloo. the bounding box was formed using [this site](http://bboxfinder.com/#43.396964,-80.596848,43.498617,-80.422440), calling the file with the radius parameter set, essentially sets how many calls you want to make (smaller radius, more calls, more accurate)

To get the api key, hit up Bk (😭 please don't query too much, money money)


## Hosting
The backend is hosted on railway so you do not need to setup the backend anymore!
The database is on a volume in railway and hence recreating the database locally is no longer required but included in the steps! All you now need to do is go to the frontend directory, make a .env file with the URL below, `npm i` and `npm start` and you're all set to join Waterlooeats!
## 📦 Installation & Setup

### Prerequisites

- Python 3.8+
- SQLite
- Node.js

### Setup (Backend)

1. **Clone the repo**:
   ```bash
   git clone https://github.com/ritaxiang/waterlooeats.git
   cd waterlooeats
   ```
2. **Create and activate a virtual environment**:
    ```bash
    python3 -m venv venv
    source venv/Scripts/activate  # On Mac/Linux: source venv/bin/activate
    ```
3. **Install dependencies**:
    ```bash
    pip install -r requirements.txt
    ```
#### Sample (Do this to setup the sample database)
4. **Create sample database**:
   ```bash
   cd sample
   sqlite3 waterlooeats.db < ../db/tables_up.sql
   ```
5. **Insert sample data**:
    ```bash
    python3 insert_sample.py
    ```
#### Production (Do this to setup the production database)
6. **Create production database**:
    ```bash
    cd production
    sqlite3 waterlooeats.db < ../db/tables_up.sql
    ```
7. **Insert production restaurant data**
   ```bash
   python3 insert_production.py
   ```
8. **Connect to backend server**:
   Add the line
   ```bash
   REACT_APP_API_URL=https://cs348-production.up.railway.app
   ```
   to your `.env` file in the frontend directory
9.  **Run frontend server**:
   In a new terminal, run:
    ```bash
    cd frontend
    npm i
    npm start
    ```
   
   
