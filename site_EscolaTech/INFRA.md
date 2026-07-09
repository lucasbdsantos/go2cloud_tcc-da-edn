# GO2Cloud — Guia de Infraestrutura AWS

Documento destinado à equipe responsável pelo deploy em produção.  
Stack: **EC2 (Docker) + RDS PostgreSQL**.

---

## Arquitetura

```
Internet
    │
    ▼
EC2 (Docker)
 ├── Container: frontend  → porta 3001
 └── Container: backend   → porta 3000
                                │
                                ▼
                        RDS PostgreSQL (porta 5432)
```

---

## 1. Criar RDS PostgreSQL

### Via Console AWS
1. Acesse **RDS → Create database**
2. Configurações:
   - Engine: **PostgreSQL 16**
   - Template: **Free tier** (ou Production se quiser Multi-AZ)
   - DB instance identifier: `go2cloud-db`
   - Master username: `postgres`
   - Master password: escolha uma senha forte e **anote**
   - Instance class: `db.t3.micro`
   - Storage: 20 GB, gp3
   - **Public access: NO** (só a EC2 acessa)
   - VPC: mesma VPC que a EC2
3. Clique em **Create database** e aguarde ~10 minutos

### Após criar
Anote o **Endpoint** do RDS (exemplo: `go2cloud-db.c9akciq32.us-east-1.rds.amazonaws.com`).

---

## 2. Criar EC2

1. Acesse **EC2 → Launch Instance**
2. Configurações:
   - AMI: **Ubuntu Server 22.04 LTS**
   - Instance type: `t3.small` (mínimo recomendado com Docker)
   - Key pair: crie ou use um existente — **guarde o .pem**
   - Storage: 20 GB gp3
3. **Security Group da EC2** — libere as portas:
   | Tipo | Porta | Source |
   |------|-------|--------|
   | SSH | 22 | Seu IP |
   | Custom TCP | 3000 | 0.0.0.0/0 |
   | Custom TCP | 3001 | 0.0.0.0/0 |
4. Clique em **Launch Instance** e anote o **IP público**

---

## 3. Liberar EC2 → RDS (Security Group)

1. Acesse o **Security Group do RDS**
2. Adicione regra de entrada (Inbound):
   - Tipo: **PostgreSQL**
   - Porta: **5432**
   - Source: **Security Group da EC2** (não o IP — use o SG ID)

---

## 4. Instalar Docker na EC2

```bash
# Conectar na EC2
ssh -i sua-chave.pem ubuntu@<IP-PUBLICO-EC2>

# Instalar Docker
sudo apt update
sudo apt install -y docker.io docker-compose
sudo usermod -aG docker $USER

# Aplicar grupo sem sair (ou desconecte e reconecte via SSH)
newgrp docker
```

---

## 5. Subir o Projeto

```bash
# Transferir o projeto (de onde tiver o go2cloud.tar.gz, no seu PC):
scp -i sua-chave.pem go2cloud.tar.gz ubuntu@<IP-PUBLICO-EC2>:~

# De volta na EC2:
tar -xzf go2cloud.tar.gz
cd go2cloud
```

Edite o arquivo `docker-compose.prod.yml` substituindo os placeholders:

```bash
nano docker-compose.prod.yml
```

Substitua:
| Placeholder | Valor real |
|-------------|------------|
| `<ENDPOINT-DO-RDS>` | Endpoint copiado do console RDS |
| `<SENHA-DO-RDS>` | Senha que você definiu no RDS |
| `<GERAR-SEGREDO-FORTE>` | Rode: `openssl rand -base64 48` |
| `<IP-PUBLICO-EC2>` | IP público da EC2 (em todos os lugares) |

---

## 6. Subir os Containers

```bash
# Subir backend e frontend
docker-compose -f docker-compose.prod.yml up -d --build

# Verificar se subiram
docker ps

# Criar tabelas no RDS (rode só uma vez)
docker-compose -f docker-compose.prod.yml exec backend npm run migrate

# Verificar logs se der problema
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend
```

---

## 7. Acessar

- **Frontend:** `http://<IP-PUBLICO-EC2>:3001`
- **API health check:** `http://<IP-PUBLICO-EC2>:3000/health`

---

## Comandos Úteis

```bash
# Ver containers rodando
docker ps

# Parar tudo
docker-compose -f docker-compose.prod.yml down

# Reiniciar só o backend
docker-compose -f docker-compose.prod.yml restart backend

# Ver logs em tempo real
docker-compose -f docker-compose.prod.yml logs -f

# Acessar terminal do container backend
docker-compose -f docker-compose.prod.yml exec backend sh
```

---

## Checklist de Verificação

- [ ] RDS criado e endpoint anotado
- [ ] EC2 criada com Docker instalado
- [ ] Security Group do RDS libera porta 5432 para o SG da EC2
- [ ] Security Group da EC2 libera portas 3000 e 3001
- [ ] `docker-compose.prod.yml` preenchido com valores reais (sem placeholders)
- [ ] `docker-compose up -d` rodou sem erros
- [ ] `npm run migrate` rodou com sucesso
- [ ] `http://<IP>:3001` abre o site no navegador
- [ ] `http://<IP>:3000/health` retorna `{"status":"ok",...}`

---

## Observações Importantes

**JWT_SECRET:** Nunca use o valor padrão em produção. Gere um segredo real:
```bash
openssl rand -base64 48
```

**Prometheus da senha:** Se esquecer a senha do RDS, ela não pode ser recuperada — só resetada pelo console AWS.

**Migrate idempotente:** O `npm run migrate` é seguro de rodar mais de uma vez — só cria tabelas que não existem ainda.

**Admin da plataforma:** Para dar acesso de administrador a uma conta, acesse o banco via psql e rode:
```sql
UPDATE users SET is_admin = true WHERE email = 'seu@email.com';
```
O usuário precisa fazer login novamente para o novo token refletir o cargo de admin.
