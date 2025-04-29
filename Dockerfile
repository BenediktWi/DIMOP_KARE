FROM ubuntu:20.04

# System aktualisieren und benötigte Pakete installieren
RUN apt update
RUN apt upgrade -y
RUN DEBIAN_FRONTEND="noninteractive" apt install git nodejs npm python3 python3-pip -y

# Pipenv installieren
RUN pip3 install pipenv

# Dein neues Repository klonen
RUN git clone https://github.com/BenediktWi/DIMOP_KARE.git

# Ins Frontend-Verzeichnis wechseln
WORKDIR /DIMOP_KARE/backend/frontend

# Node-Module neu installieren
RUN rm -r node_modules
RUN npm install
RUN npm run build

# Wechsel ins Backend-Verzeichnis
WORKDIR /DIMOP_KARE/backend

# Python-Abhängigkeiten installieren
RUN pipenv install

# Port freigeben
EXPOSE 5000

# Startkommando
CMD ["pipenv", "run", "python", "main.py"]
