# DiMOP
Hauptrepository für alle Entwicklungsarbeiten am DiMOP Projekt


Verbindung mit Datenbank herstellen:

1. Mit VPN Verbinden
2. Einloggen:
  - Server: ```132.187.102.201```
  - Benutzername: euer Benutzername
  - Passwort: euer Passwort
3. Fertig :)


# Python Code ausführen

1. pipenv installieren mit ```pip3 install pipenv``` #pip install pipenv
2. in Backend ordner wechslen mit ```cd backend```
3. Abhängigkeiten installieren mit ```pipenv install```
4. in pipenv wechseln mit ```pipenv shell```
5. (optional bei veränderung des Frontends) ```cd frontend && yarn build && cd ..```
6. Backend starten mit ```python main.py```

#Working with git
#(git status)
#first git pull
#git add file.py or git add -A
#git commit -m "Kommentar einfügen was im commit eingfügt wurde"
#git push

-n, --dry-run         dry run
    -v, --verbose         be verbose

    -i, --interactive     interactive picking
    -p, --patch           select hunks interactively
    -e, --edit            edit current diff and apply
    -f, --force           allow adding otherwise ignored files
    -u, --update          update tracked files
    --renormalize         renormalize EOL of tracked files (implies -u)
    -N, --intent-to-add   record only the fact that the path will be added later
    -A, --all             add changes from all tracked and untracked files
    --ignore-removal      ignore paths removed in the working tree (same as --no-all)
    --refresh             don't add, only refresh the index
    --ignore-errors       just skip files which cannot be added because of errors
    --ignore-missing      check if - even missing - files are ignored in dry run
    --chmod (+|-)x        override the executable bit of the listed files

## API Dokumentaion

#User (einzelne User anhand der Email)
/User/<id><firstename><surname><e_mail><orga_name><function><del_kz>
get, post, put
Get: Filter nach Email
{
  "id": "int",
  "firstname": "string",
  "surname": "string", 
  "e_mail": "string", #obligatorisch  UI bitte Email einfügen
  "orga_name ": "string",
  "function": "string",
  "del_kz": "boolean",
}
