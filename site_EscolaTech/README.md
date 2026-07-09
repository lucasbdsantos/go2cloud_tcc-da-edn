# Site da Escola tech

Plataforma educacional premium para Computação em Nuvem, AWS, DevOps e tecnologias modernas.

## 📋 Visão Geral

GO2Cloud é uma aplicação full-stack moderna que demonstra conceitos reais de cloud computing, incluindo elasticidade, escalabilidade e alta disponibilidade na prática.

**Tecnologias:**
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, React Hook Form
- **Backend**: Node.js + Express, TypeScript
- **Database**: PostgreSQL
- **Infrastructure**: Docker, AWS (EC2, RDS, ALB, Auto Scaling, Route 53, CloudWatch)

## 🚀 Quick Start (Local Development)

### Pré-requisitos
- Docker e Docker Compose
- Node.js 20+ (para desenvolvimento sem Docker)

### Com Docker Compose (Recomendado)

```bash
# Clone o repositório
git clone <repo-url>
cd go2cloud

# Inicie todos os serviços
docker-compose up --build

# Em outro terminal, execute as migrações do banco
docker-compose exec backend npm run migrate
```

Acesse:
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000/api
- PostgreSQL: localhost:5432

### Manualmente (sem Docker)

**Backend:**
```bash
cd backend
cp .env.example .env
# Edite .env com suas variáveis
npm install
npm run migrate
npm run dev
```

**Frontend:**
```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

## 📁 Estrutura do Projeto

```
go2cloud/
├── backend/                  # Express API
│   ├── src/
│   │   ├── controllers/     # Business logic
│   │   ├── middleware/      # Auth, validation
│   │   ├── routes/          # API routes
│   │   ├── database/        # DB config, migrations
│   │   ├── schemas/         # Zod validation
│   │   └── index.ts         # Server entry
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                 # Next.js app
│   ├── src/
│   │   ├── app/            # Pages (layout, landing, enrollment)
│   │   ├── components/     # Reusable UI components
│   │   ├── lib/            # API client, helpers
│   │   ├── styles/         # Global CSS
│   │   └── types/          # TypeScript types
│   ├── Dockerfile
│   ├── tailwind.config.ts
│   ├── next.config.js
│   └── package.json
│
├── docker-compose.yml        # Development orchestration
└── README.md
```

## 🔐 Autenticação

Utilizamos JWT (JSON Web Tokens) para autenticação segura:

1. Usuário se registra na página de matrícula
2. Senha é hasheada com bcryptjs
3. JWT é gerado e armazenado no localStorage
4. Cada request inclui o token no header `Authorization: Bearer <token>`
5. Token expira em 7 dias

## 📡 API Endpoints

### Auth
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Fazer login
- `GET /api/auth/me` - Obter dados do usuário autenticado

### Enrollments
- `POST /api/enrollments` - Criar nova matrícula
- `GET /api/enrollments/user` - Obter matrículas do usuário
- `GET /api/enrollments` - Listar todas as matrículas (admin)

### Health
- `GET /api/health` - Status do servidor

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  state VARCHAR(50),
  city VARCHAR(100),
  course VARCHAR(100),
  experience_level VARCHAR(50),
  objective TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Enrollments Table
```sql
CREATE TABLE enrollments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_name VARCHAR(255) NOT NULL,
  enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'active',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🎨 Design System

A plataforma segue um design system "Cloud Native Dark" com:
- **Paleta**: Midnight blues, cyans, azures
- **Tipografia**: Playfair Display (headings) + Inter (body) + JetBrains Mono (code)
- **Componentes**: Glassmorphism, glow effects, smooth animations
- **Acessibilidade**: WCAG AA compliant

## 🌐 Deployment AWS

### Arquitetura
```
Users
  ↓ Route 53 (DNS)
  ↓ CloudFront (CDN)
  ↓ Application Load Balancer
  ↓ Auto Scaling Group (EC2 instances)
  ↓ RDS (PostgreSQL)
  
Monitoring: CloudWatch
```

### Passos para Deploy

#### 1. Preparar ECR (Elastic Container Registry)

```bash
# Crie repositórios no ECR
aws ecr create-repository --repository-name go2cloud-backend --region us-east-1
aws ecr create-repository --repository-name go2cloud-frontend --region us-east-1

# Faça login no ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com

# Build e push do backend
docker build -t go2cloud-backend:latest ./backend
docker tag go2cloud-backend:latest <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/go2cloud-backend:latest
docker push <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/go2cloud-backend:latest

# Build e push do frontend
# IMPORTANTE: NEXT_PUBLIC_API_URL é embutido no bundle JS durante o build,
# não é lido em runtime. Use a URL pública real do seu backend (ALB/domínio),
# não localhost — senão o site deployado vai tentar falar com localhost do
# navegador de quem acessar.
docker build \
  --build-arg NEXT_PUBLIC_API_URL=https://api.go2cloud.com/api \
  -t go2cloud-frontend:latest ./frontend
docker tag go2cloud-frontend:latest <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/go2cloud-frontend:latest
docker push <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/go2cloud-frontend:latest
```

#### 2. RDS Database

```bash
# Crie RDS PostgreSQL instance
aws rds create-db-instance \
  --db-instance-identifier go2cloud-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username postgres \
  --master-user-password <PASSWORD> \
  --allocated-storage 20 \
  --vpc-security-group-ids sg-xxxxxxxx
```

**Rodando migrations em produção:**

A imagem de produção remove `devDependencies` (`npm prune --production`), então `tsx` não está disponível ali. Use a versão compilada:

```bash
# Dentro do container/task em produção (ex: ECS exec, SSH na EC2, etc):
npm run migrate:prod   # roda dist/database/migrate.js, não precisa de tsx
```

#### 3. EC2 Auto Scaling

```bash
# Create launch template
aws ec2 create-launch-template \
  --launch-template-name go2cloud-template \
  --launch-template-data '{"ImageId":"ami-xxxxxxxx","InstanceType":"t3.small",...}'

# Create auto scaling group
aws autoscaling create-auto-scaling-group \
  --auto-scaling-group-name go2cloud-asg \
  --launch-template LaunchTemplateName=go2cloud-template,Version=$Latest \
  --min-size 1 \
  --max-size 3 \
  --desired-capacity 2
```

#### 4. Application Load Balancer

```bash
aws elbv2 create-load-balancer \
  --name go2cloud-alb \
  --subnets subnet-xxxxxxxx subnet-yyyyyyyy \
  --security-groups sg-xxxxxxxx
```

### Variáveis de Ambiente (Production)

Backend:
```env
NODE_ENV=production
PORT=3000
DB_HOST=go2cloud-db.xxxxx.rds.amazonaws.com
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=<strong-password>
DB_NAME=go2cloud
JWT_SECRET=<random-secret-key>
FRONTEND_URL=https://go2cloud.com
```

Frontend:
```env
NEXT_PUBLIC_API_URL=https://api.go2cloud.com/api
```

## 📊 Monitoramento (CloudWatch)

Configure CloudWatch logs e métricas:

```bash
# Ver logs do backend
aws logs tail /aws/ecs/go2cloud-backend --follow

# Ver métricas de CPU/Memory
aws cloudwatch get-metric-statistics \
  --namespace AWS/EC2 \
  --metric-name CPUUtilization \
  --start-time 2024-01-01T00:00:00Z \
  --end-time 2024-01-02T00:00:00Z \
  --period 300 \
  --statistics Average
```

## 🧪 Testing & Quality

### Backend
```bash
# Lint
npm run lint

# Type check
npm run type-check

# Tests (quando implementados)
npm run test
```

### Frontend
```bash
# Build
npm run build

# Lint
npm run lint

# Type check
npx tsc --noEmit
```

## 📈 Performance Checklist

- [x] Code splitting (Next.js automatic)
- [x] Image optimization (Tailwind, no external images)
- [x] Database indexing (indexed email, user_id)
- [x] API response caching headers
- [x] CORS configured
- [x] HTTPS ready (CloudFront)
- [x] Database connection pooling

## 🔒 Security

- ✅ Password hashing (bcryptjs)
- ✅ JWT authentication
- ✅ CORS enabled with origin validation
- ✅ Environment variables for secrets
- ✅ SQL injection prevention (parameterized queries)
- ✅ Rate limiting ready (implement at ALB level)

## 📝 Desenvolvimento

### Adicionar nova rota

**Backend** (`src/controllers/` e `src/routes/`)
```typescript
// controllers/example.ts
export async function getExample(req: AuthRequest, res: Response) {
  try {
    // logic
    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: 'Error message' });
  }
}

// routes/index.ts
router.get('/examples', authMiddleware, getExample);
```

**Frontend** (`src/app/` ou `src/components/`)
```typescript
// Components follow TypeScript + Tailwind patterns
// Use reusable Button, Input, Select components
```

## 🚨 Troubleshooting

**Porta já em uso:**
```bash
# Kill processo na porta
lsof -i :3000
kill -9 <PID>
```

**Banco de dados não conecta:**
```bash
# Verificar status do PostgreSQL
docker-compose ps
docker-compose logs postgres

# Resetar dados
docker-compose down -v
docker-compose up --build
```

**CORS errors:**
Verifique `FRONTEND_URL` no backend `.env`