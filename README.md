# VS Attendance Client (User)

> Refer to [API documentation](https://github.com/bbgrabbag/vs-attendance-api.git) for system architecture diagram.

### Overview
Web app for allowing students to clock in/out of campus using QR code. User submits form data and entry type to log their attendance start/end time. Information is cached for future visits

### Getting Started
```bash
# install dependencies
npm i

# create .env files (see .env.template file for variable values)
cat .env.template >> .env #dev 
cat .env.template >> .env.ci #prod

#run dev server
npm run dev

#run tests
npm t

#run linter
npm run lint
```

### Deployment
GitHub action workflows can be found [here](./.github/workflows). Currently using [Surge.sh](https://surge.sh/) for deployment to QA and Production environments. Please see repository owner for credentials.
