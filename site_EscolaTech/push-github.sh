#!/bin/bash
# Script para inicializar o repositório Git e subir no GitHub.
# Pré-requisito: ter Git instalado e estar logado no GitHub CLI (gh auth login)
# ou ter configurado suas credenciais git globalmente.

set -e

echo "=== GO2Cloud — Push para GitHub ==="
echo ""

# Pede o nome do repositório e usuário
read -p "Seu usuário do GitHub (ex: lucassilva): " GITHUB_USER
read -p "Nome do repositório (ex: go2cloud): " REPO_NAME

echo ""
echo "Inicializando Git..."
git init
git add .

# Confirma que .env não vai junto
if git ls-files --others --exclude-standard | grep -q "^\.env$\|/\.env$"; then
  echo "ERRO: .env encontrado nos arquivos a commitar. Verifique o .gitignore."
  exit 1
fi

echo "Verificando que nenhum .env vazou..."
if git status --short | grep -q " .env$"; then
  echo "ERRO: .env detectado. Abortando."
  exit 1
fi

echo "✅ Nenhum .env no commit"

git commit -m "feat: GO2Cloud - full stack AWS training platform

- Next.js 14 frontend com design system dark/glassmorphism
- Express + TypeScript backend com JWT auth
- PostgreSQL schema com migrations idempotentes
- Docker setup para dev local e prod (EC2 + RDS)
- Rate limiting, helmet, controle de acesso admin
- Documentação de deploy AWS (INFRA.md)"

echo ""
echo "Criando repositório no GitHub..."
gh repo create "$GITHUB_USER/$REPO_NAME" --public --source=. --remote=origin --push

echo ""
echo "✅ Projeto no ar: https://github.com/$GITHUB_USER/$REPO_NAME"
