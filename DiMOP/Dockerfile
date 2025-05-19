# -----------------------------------------------------------
# 1. Basis-Image + System-Pakete
# -----------------------------------------------------------
FROM ubuntu:20.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update \
 && apt-get upgrade -y \
 && apt-get install -y \
        git curl nodejs npm python3 python3-pip \
 && pip3 install --no-cache-dir pipenv

# -----------------------------------------------------------
# 2. Quellcode klonen
# -----------------------------------------------------------
ARG DIMOP_REPO_URL=https://github.com/BenediktWi/DIMOP_KARE.git
ARG DIMOP_BRANCH=Development_V2
RUN git clone --depth=1 --branch ${DIMOP_BRANCH} ${DIMOP_REPO_URL} /app

# -----------------------------------------------------------
# 3. Frontend bauen
#    (package.json + **public/index.html** liegen im Repo)
# -----------------------------------------------------------
WORKDIR /app/DiMOP/backend/frontend
RUN rm -rf node_modules \
 && npm install --no-audit --no-fund \
 && npm run build

# -----------------------------------------------------------
# 4. Backend-Abhängigkeiten installieren
# -----------------------------------------------------------
WORKDIR /app/DiMOP/backend
RUN pipenv install --deploy --ignore-pipfile

# -----------------------------------------------------------
# 5. Container-Start
# -----------------------------------------------------------
EXPOSE 5000
CMD ["pipenv", "run", "python", "main.py"]
