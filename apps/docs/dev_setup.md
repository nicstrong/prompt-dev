# Clerk Setup



# Database

The simplest way to get an instance of postgres running with docker. To start the instance in the home directory:

`docker-compose up -d`

Then setup the initial schema first setup the connection string in `apps/api/.env`:

`DATABASE_URL='postgres://postgres:P@ssw0rd123@localhost:5432/prompt_dev_db'`

```bash
cd apps/api
pnpm run db:migrate
```

# Models
There are no models defined by default. There is a a file `apps/api/sql/models.sql` that contains all the standard Open AI models. To insert these:

**Bash**
```bash
docker-compose exec -T db psql -U postgres -d prompt_dev_db < data.sql
```

**Windows (powershell)**
```powershell
Get-Content .\models.sql | docker-compose exec -T db psql -U postgres -d prompt_dev_db
```
