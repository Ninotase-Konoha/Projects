# Backend

## Steps to set up the backend

Open the terminal, and enter the *backend* folder by
```
cd backend
```

In the terminal, check if *pip3* is installed by
```
pip3 --version
```

If it is not installed, then install pip3 by
```
sudo apt install python3-pip
```

Now check the *pip3* by entering
```
pip3 --version
```

As long as it shows version >= 20, it should be fine.

Now install all package requirements by
```
pip3 install -r requirements.txt
```

Download the *database.db* file using the link: [https://drive.google.com/drive/folders/16QWsutHT3C4qmFbBJ0Ymja4dFjhNFTPJ?usp=share_link](https://drive.google.com/drive/folders/16QWsutHT3C4qmFbBJ0Ymja4dFjhNFTPJ?usp=share_link)

And put it into *backend/db* folder.

Now you can start the program by
```
python3 app.py
```

The default port is 5000. If the terminal shows that the port is being used, close the terminal and restart a new one.
`cd  backend` to enter the backend again, and `python3 app.py` to start the program again.
