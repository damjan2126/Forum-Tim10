Unutar cmd u folderu od projekta:

docker compose up

Unutar Dockera:

Containers -> levi klik na api-container -> terminal

ukucati sledece komande:

bash

flask db init
flask db migrate
flask db upgrade

povezati se na swagger preko:

localhost:5000/swagger-ui (http)