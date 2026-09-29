build "api" {
  base    = "node"
  root    = "backend"
  command = "npx prisma generate --config prisma7.config.ts && npm run build"
}

service "api" {
  build   = build.api
  command = "node dist/server.js"

  endpoint {
    public = true

    health_check {
      path = "/api/health"
    }
  }

  env = {
    PORT                = port
    NODE_ENV            = "production"
    DATABASE_URL        = postgres.main.url
    PRISMA_DATABASE_URL = postgres.main.direct_url
  }

  pre_deploy {
    command = "npx prisma migrate deploy --config prisma7.config.ts"
  }

  dev {
    command = "npm run dev"
  }
}

build "web" {
  base    = "node"
  root    = "frontend"
  command = "npm run build"

  env = {
    VITE_API_URL = "https://${service.api.public_url}"
  }
}

service "web" {
  build   = build.web
  command = "npx serve -s dist -l $PORT"

  endpoint {
    public = true

    health_check {
      path = "/"
    }
  }

  env = {
    PORT = port
  }

  dev {
    command = "npm run dev -- --host 0.0.0.0 --port $PORT"

    env = {
      VITE_API_URL = "http://${service.api.public_url}"
    }
  }
}

postgres "main" {}