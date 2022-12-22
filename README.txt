Unutar powershella u folderu od projekta:

docker run --name mysql-server -p 3306:3306 -e MYSQL_ROOT_PASSWORD=password -d mysql:latest
docker build -t flask-smorest-api .
docker run --net=bridge --name api-container -dp 5000:5000 -w /app -v ${PWD}:/app flask-smorest-api 

Unutar Dockera:

kontejner za flask api -> 