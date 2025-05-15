FROM ubuntu:20.04

# System-Updates und essentielle Pakete installieren
RUN apt update && apt upgrade -y
RUN DEBIAN_FRONTEND="noninteractive" apt install -y git nodejs npm python3 python3-pip

# Pipenv installieren
RUN pip3 install pipenv

# Repository klonen und Branch wechseln
RUN git clone https://github.com/BenediktWi/DIMOP_KARE.git
WORKDIR /DIMOP_KARE
RUN git checkout Development_V2

# Frontend-Abhängigkeiten installieren und builden
WORKDIR /DIMOP_KARE/DiMOP/backend/frontend
RUN rm -rf node_modules
RUN npm install
RUN npm run build

# Backend-Abhängigkeiten installieren
WORKDIR /DIMOP_KARE/DiMOP/backend
RUN pipenv install

# Container-Startbefehl
CMD ["pipenv", "run", "python", "main.py"]

# Port für Flask oder ähnliche Server
EXPOSE 5000
