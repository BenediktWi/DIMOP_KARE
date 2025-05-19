# ---------- Basis-Image ----------
FROM ubuntu:20.04

# ---------- System-Updates & Grund-Pakete ----------
RUN apt-get update && apt-get upgrade -y && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y \
        git curl nodejs npm python3 python3-pip && \
    pip3 install --no-cache-dir pipenv

# ---------- Quellcode holen ----------
ARG DIMOP_REPO_URL=https://github.com/BenediktWi/DIMOP_KARE.git
ARG DIMOP_BRANCH=Development_V2
RUN git clone --depth=1 --branch ${DIMOP_BRANCH} ${DIMOP_REPO_URL} /app

# ---------- Frontend bauen ----------
WORKDIR /app/DiMOP/backend/frontend
RUN rm -rf node_modules \
 && npm ci \
 && npm run build

# ---------- Backend-Abhängigkeiten ----------
WORKDIR /app/DiMOP/backend
RUN pipenv install --deploy --ignore-pipfile

# ---------- Start-Kommando & Port ----------
EXPOSE 5000
CMD ["pipenv", "run", "python", "main.py"]

