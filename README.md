[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/bzPrOe11)

# CS3219 Project (PeerPrep) - AY2425S1

## Group: G33

### Note:

- You can choose to develop individual microservices within separate folders within this repository **OR** use individual repositories (all public) for each microservice.
- In the latter scenario, you should enable sub-modules on this GitHub classroom repository to manage the development/deployment **AND** add your mentor to the individual repositories as a collaborator.
- The teaching team should be given access to the repositories as we may require viewing the history of the repository in case of any disputes or disagreements.

## For Testing & Demo Locally:

### Backend:

To launch the development environment for Milestone 2:

1. Enter question-service in the backend directory

```
cd backend/question-service/
```

2. Install relevant packages and dependencies

```
npm install
```

3. Start the question service

   - This will expose the question service via localhost:4001

```
npm run start
```

4. Open up another shell/terminal, enter gateway-service in the backend directory

```
cd backend/gateway-service
```

5. Install relevant packages and dependencies

```
npm install
```

6. Start the gateway service

   - This will expose the gateway service via localhost:4000

```
npm run start
```

### Frontend:

1. In the frontend directory, create a copy of the `.env.example` file and name it `.env`.
2. Ensure you are in the ./frontend directory, then install the project dependencies with:

```bash
npm install

npm run dev

ready - navigate to http://localhost:3000 to view the project
```
