# CS348

# Installation

## MySQL
### Windows
  `winget install Oracle.MySQL`
### MacOS
 `brew install mysql`

 ## Python
 verify python is installed by running `python3 --version`

 ## Setup
Make a virtual environment using the command
`python3 -m venv venv`
Run
`source venv/bin/activate`
Install required packages using
`python3 -m pip install -r requirements.txt`

Make a `.env` file with your `DB_USER` and `DB_PASS` set and run the command

`python3 setup_users_db.py` 

the users inserted into your database should be printed to the command line.