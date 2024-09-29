[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/bzPrOe11)

# CS3219 Project (PeerPrep) - AY2425S1

## Group: G33

### Note:

- You can choose to develop individual microservices within separate folders within this repository **OR** use individual repositories (all public) for each microservice.
- In the latter scenario, you should enable sub-modules on this GitHub classroom repository to manage the development/deployment **AND** add your mentor to the individual repositories as a collaborator.
- The teaching team should be given access to the repositories as we may require viewing the history of the repository in case of any disputes or disagreements.

## For Testing & Demo Locally (D2):

To launch the development environment for Milestone 2

### Prerequisite:

1. Clone the repo and make sure to be in `ms2-submission` branch

```
git clone --branch ms2-submission https://github.com/CS3219-AY2425S1/cs3219-ay2425s1-project-g33.git
```

2. In a new shell/terminal session, navigate to the root directory of the project

### Backend:

1. Enter question-service in the backend directory

```
cd backend/question-service/
```

2. Create a copy of the `.env.example` file and name it `.env`.

```
cp .env.example .env
```

3. Setup MongoDb Shared Cluster using this [guide](https://github.com/CS3219-AY2425S1/PeerPrep-UserService/blob/main/user-service/MongoDBSetup.md) and obtain the `MONGO_CONNECTION_STRING` using the [guide](https://github.com/CS3219-AY2425S1/PeerPrep-UserService/blob/main/user-service/README.md)
   - Replace the `MONGO_CONNECTION_STRING` in the `.env` file

```
MONGO_CONNECTION_STRING=MONGODB_CONNECTION_STRING
```

4. In question service, install relevant packages and dependencies

```
npm install
```

5. Start the question service

   - This will expose the question service via localhost:4001

```
npm run start
```

6. In a new terminal/shell session, enter gateway-service in the backend directory

```
cd backend/gateway-service
```

7. Install relevant packages and dependencies

```
npm install
```

8. Start the gateway service

   - This will expose the gateway service via localhost:4000

```
npm run start
```

### Frontend:

1. In a new terminal/shell session, enter the frontend directory

```
cd frontend/
```

2. Create a copy of the `.env.example` file and name it `.env`.

```
cp .env.example .env
```

3. Install relevant packages and dependencies

```
npm install
```

4. Start the application in dev mode

```
npm run dev
```

5. Navigate to http://localhost:3000 to view the project
