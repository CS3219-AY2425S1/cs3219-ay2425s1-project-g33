[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/bzPrOe11)

# CS3219 Project (PeerPrep) - AY2425S1

## Group: Gxx

### Note:

- You can choose to develop individual microservices within separate folders within this repository **OR** use individual repositories (all public) for each microservice.
- In the latter scenario, you should enable sub-modules on this GitHub classroom repository to manage the development/deployment **AND** add your mentor to the individual repositories as a collaborator.
- The teaching team should be given access to the repositories as we may require viewing the history of the repository in case of any disputes or disagreements.

## For Development:

### Backend:

To launch the development environment using Docker Compose, follow these steps:

1. Enter backend directory

```
cd backend
```

2. Run docker-compose using `-f` flag to specify the file to build from and `-d` flag to run the containers in detached mode (in the background)

```
docker-compose -f docker-compose.yml up -d
```

3. To stop the running services

```
docker-compose down
```
