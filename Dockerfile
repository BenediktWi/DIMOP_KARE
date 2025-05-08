FROM ubuntu:20.04

# System aktualisieren
RUN apt update && apt upgrade -y

# Tools installieren
RUN DEBIAN_FRONTEND="noninteractive" apt install -y curl git python3 python3-pip

# Node.js 14 (kompatibel mit react-scripts 3.4.1)
RUN curl -fsSL https://deb.nodesource.com/setup_14.x | bash - && \
    apt install -y nodejs && \
    node -v && npm -v

# Pipenv installieren
RUN pip3 install pipenv

# Projektdateien kopieren
COPY . /app

# Frontend installieren & bauen
WORKDIR /app/backend/frontend
RUN rm -rf node_modules package-lock.json || true && \
    npm install && \
    npm run build

# Backend installieren
WORKDIR /app/backend
RUN pipenv install

# Port und Start
EXPOSE 5000
CMD ["pipenv", "run", "python", "main.py"]
