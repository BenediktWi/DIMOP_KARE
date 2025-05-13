FROM ubuntu:20.04

# System aktualisieren und benötigte Pakete installieren
RUN apt update && apt upgrade -y
RUN DEBIAN_FRONTEND="noninteractive" apt install git python3 python3-pip -y

# Pipenv installieren
RUN pip3 install pipenv

# Lokalen Projektcode ins Image kopieren
COPY . /app

# Wechsel ins Backend-Verzeichnis
WORKDIR /app/backend

# Python-Abhängigkeiten installieren
RUN pipenv install

# Port freigeben
EXPOSE 5000

# Startkommando
CMD ["pipenv", "run", "python", "main.py"]