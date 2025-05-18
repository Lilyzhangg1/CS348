# CS348

# Installation

## MySQL
### Windows
  `winget install Oracle.MySQL`
### MacOS
 `brew install mysql`

 ## Python
 verify python is installed by running `python --version`

 ## Setup
Run
`source venv/bin/activate`

Make a `.env` file with your `DB_USER` and `DB_PASS` set and run the command

`python setup_users_db.py` 

the users inserted into your database should be printed to the command line.