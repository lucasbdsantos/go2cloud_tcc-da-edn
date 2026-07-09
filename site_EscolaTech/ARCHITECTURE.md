# GO2Cloud - Arquitetura Técnica

## Visão Geral da Solução

GO2Cloud é uma plataforma educacional de 3 camadas:

1. **Frontend**: Next.js 14 (cliente web responsivo)
2. **Backend**: Express + TypeScript (API REST)
3. **Database**: PostgreSQL (dados persistentes)

## Decisões Arquiteturais

### 1. Next.js ao invés de React SPA puro

**Razão:**
- Built-in routing sem config adicional
- Server-side rendering opcional para SEO
- API routes (não usadas aqui, mas disponíveis)
- Melhor performance com bundle splitting automático

### 2. TypeScript em Frontend + Backend

**Razão:**
- Type safety previne bugs em tempo de desenvolvimento
- Melhor IDE support (IntelliSense, refactoring)
- Documentação viva através de types
- Essencial para manutenibilidade em projetos crescentes

### 3. Express ao invés de Next.js API Routes

**Razão:**
- Separação clara entre frontend e backend
- Backend pode ser deployado independentemente
- Escalabilidade: backend pode rodar em múltiplas instâncias
- Flexibilidade: pode servir múltiplos clientes (web, mobile, etc)

### 4. PostgreSQL ao invés de DynamoDB/MongoDB

**Razão:**
- Relações claras entre users e enrollments
- ACID compliance para transações críticas
- Melhor para dados estruturados
- Funciona bem com RDS (aws managed service)
- Mais barato em volume pequeno-médio

### 5. JWT Authentication ao invés de Sessions

**Razão:**
- Stateless (escalável para múltiplas instâncias)
- Funciona bem com SPA/frontend separado
- Seguro com HTTPS
- Expiração automática de tokens

### 6. Tailwind CSS ao invés de Styled-components/CSS Modules

**Razão:**
- Menor bundle size (utility-first)
- Construído no design system existente
- Fácil customização com tailwind.config
- Performance: no CSS-in-JS overhead

## Stack Justificado para Avaliação Acadêmica

### Demonstra Competência Em:

✅ **Full Stack Development**
- Frontend moderno com Next.js
- Backend escalável com Express
- Database design com PostgreSQL

✅ **Boas Práticas**
- TypeScript (type safety)
- Component-based architecture
- API RESTful design
- Authentication & Authorization
- Environment-based config

✅ **Cloud Concepts** (via AWS deployment)
- Auto Scaling Group (elasticidade)
- RDS (managed database)
- ALB (load balancing)
- Route 53 (DNS)
- CloudWatch (monitoring)

✅ **DevOps**
- Docker containerization
- docker-compose orchestration
- CI/CD ready (GitHub Actions, AWS CodePipeline)
- Infrastructure as Code ready

## Performance Considerations

### Frontend
- **Next.js Optimization:**
  - Automatic code splitting
  - Image optimization (server-side rendering ready)
  - Dynamic imports para lazy loading
  
- **Bundle Analysis:**
  ```bash
  npm run build
  # Production bundle ~100KB gzipped (sem imagens)
  ```

### Backend
- **Database:**
  - Connection pooling (pg Pool)
  - Indexed email (unique constraint)
  - Indexed user_id (enrollments foreign key)
  
- **Query Optimization:**
  - N+1 prevented with careful query design
  - Pagination ready (limit/offset implementation in enrollments list)

### Deployment
- **AWS Configuration:**
  - ALB distribui traffic
  - Auto Scaling baseado em CPU/Memory
  - RDS Multi-AZ ready
  - CloudWatch monitoring

## Security Implementation

### Password Security
```typescript
// Backend: bcryptjs com salt rounds 10
const hashedPassword = await bcrypt.hash(password, 10);
```

### Token Security
```typescript
// JWT com expiration
jwt.sign(data, secret, { expiresIn: '7d' })

// Token stored in localStorage (não é XSS-proof, mas é padrão)
// Em production, considerar httpOnly cookies
```

### API Security
```typescript
// CORS whitelist
cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
})

// Input validation com Zod
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})
```

### SQL Injection Prevention
```typescript
// Parameterized queries (pg library previne SQL injection)
await query(
  'INSERT INTO users (email, ...) VALUES ($1, ...)',
  [email, ...]  // Parâmetros são escapados automaticamente
)
```

## Escalabilidade

### Horizontal Scaling
- **Frontend**: Deployar múltiplas instâncias via ALB
- **Backend**: Auto Scaling Group cria/destrói instâncias baseado em metrics
- **Database**: RDS handles replication; considerar read replicas em produção

### Vertical Scaling
- Aumentar instance types (t3.small → t3.medium)
- Aumentar RDS instance class
- Frontend caching (CloudFront)

### Database Scaling
```sql
-- Índices importantes para performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_enrollments_user_id ON enrollments(user_id);

-- Em produção, considerar partitioning por date
-- ou read replicas para queries pesadas
```

## Monitoramento & Observability

### Logs
```typescript
// Backend logs estruturados (stdout para CloudWatch)
console.log(`Query executed in ${duration}ms`);
console.error('Database query error:', error);
```

### Métricas (AWS CloudWatch)
- CPU Utilization (trigger Auto Scaling)
- Memory Usage
- Database Connections
- API Response Times

### Health Checks
```typescript
// ALB health check endpoint
GET /health
```

## Desenvolvimento Local vs Production

### Local (docker-compose)
- PostgreSQL container com dados persistentes
- Backend com hot-reload (tsx watch)
- Frontend com fast refresh
- Todas as variáveis em .env files

### Production (AWS)
- RDS PostgreSQL gerenciado
- Backend em EC2 com Auto Scaling
- Frontend servido via CloudFront + S3
- Variáveis em AWS Systems Manager Parameter Store
- Logs em CloudWatch
- Monitoring em CloudWatch Dashboards

## Plano de Migração Futura

### Phase 1 (Current)
✅ Basic auth & enrollment
✅ Single EC2 instance
✅ RDS instance

### Phase 2 (Próximo)
- [ ] Payments integration (Stripe)
- [ ] User dashboard com histórico
- [ ] Email notifications (AWS SES)
- [ ] Certificados automáticos

### Phase 3
- [ ] Mobile app (React Native)
- [ ] Analytics (AWS QuickSight)
- [ ] Video streaming (AWS MediaConvert)

## Troubleshooting Common Issues

### Backend Connection Pooling
```typescript
// Problema: "too many connections"
// Solução: Pool configurado com max 20 connections (padrão)
const pool = new Pool({ max: 20 });
```

### Frontend API Timeout
```typescript
// Problema: requests timeout em produção
// Solução: Axios timeout config
axios.defaults.timeout = 30000; // 30s
```

### Database Migrations
```bash
# Executar migrations
npm run migrate

# Migrations idempotentes (CREATE IF NOT EXISTS)
# Seguro executar múltiplas vezes
```

---

**Documentação Completa**: Ver README.md para deployment e setup
**Última Atualização**: Junho 2024
