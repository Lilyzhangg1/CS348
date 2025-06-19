# WaterlooEats (CS348 Project)

WaterlooEats is a database-driven web application designed to help users in the Kitchener-Waterloo area discover, rate, and track local restaurants. This project uses FastAPI for the backend, React for the frontend, and SQLite as the database.

---
## Sample test
- located in the sample directory

## Fetching data
To fetch sample (and ultimately production) data, use the `fetch_clean_data.py` script, specify the range (radius) of the restaurant search to increase the number of tuples fetched.

To get the api key, hit up Bk (😭 please don't query too much, money money)

## 📦 Installation & Setup

### Prerequisites

- Python 3.8+
- SQLite
- Node.js

### Setup (Backend)

1. **Clone the repo**:
   ```bash
   git clone https://github.com/your-username/waterlooeats.git
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
4. **Create sample database**:
   ```bash
   cd sample
   sqlite3 waterlooeats.db < tables_up.sql
   ```
5. **Insert sample data**:
    ```bash
    python3 insert_sample.py
    ```
6. **Run backend server**:
   ```bash
    uvicorn main:app --reload
    ```
    

   