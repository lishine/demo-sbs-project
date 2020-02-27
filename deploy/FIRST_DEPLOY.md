- install docker
- install docker-compose
- https://docs.docker.com/compose/install/
```
docker network create web-production
docker network create web-staging
docker network create local-production
docker network create local-staging
ufw enable
ufw allow ssh http https
ufw status numbered
```