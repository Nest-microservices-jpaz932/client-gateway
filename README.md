# Client Gateway

## Development
1. Clone the repository
2. Install dependencies
3. Create a `.env` file based on `.env.template`
4. Run necessary microservices
5. Run `npm run start:dev`

## Nats 
```
docker run -d --name nats-server -p 4222:4222 -p 8222:8222 nats
```