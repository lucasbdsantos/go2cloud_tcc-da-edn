# Network Flow

## Visão Geral

O **Network Flow** descreve o caminho completo percorrido pelas requisições dos usuários até os serviços da aplicação, considerando as duas propostas arquiteturais do projeto:

- Proposta Low-Cost  
- Proposta Maior Investimento  

Este documento detalha como ocorre a entrada de tráfego na infraestrutura, o papel dos provedores de CDN (Cloudflare e Amazon CloudFront), a resolução DNS e a distribuição das requisições até as camadas de aplicação e banco de dados dentro da AWS.

---

## Objetivo

Este documento tem como objetivo:

- Explicar o fluxo completo de requisições HTTP/HTTPS.
- Demonstrar o papel da camada de CDN (Cloudflare vs CloudFront).
- Detalhar a resolução DNS (Registro.br e Route 53).
- Apresentar o fluxo até o Application Load Balancer.
- Evidenciar a separação entre camadas públicas e privadas na VPC.
- Comparar as duas arquiteturas em termos de custo, segurança e desempenho.

---

# Proposta Low-Cost

## Visão Geral

Na proposta Low-Cost, a camada de borda é fornecida pela **Cloudflare**, responsável por atuar como CDN e camada inicial de segurança da aplicação.

A Cloudflare funciona como ponto de entrada principal do tráfego, realizando cache global, proteção contra ataques e distribuição de conteúdo estático antes do encaminhamento para a infraestrutura AWS.

---

## Fluxo de Entrada

Usuário
|
▼
Registro.br (DNS autoritativo)
|
▼
Cloudflare (CDN + Proxy Reverso)
|
▼
Application Load Balancer (AWS)
|
▼
Auto Scaling Group
|
▼
Amazon EC2 (Subnets privadas)
|
▼
Amazon RDS PostgreSQL


---

## Funcionamento do Fluxo

### Usuário → Cloudflare
- Conexão HTTPS iniciada pelo navegador.
- DNS aponta para nameservers da Cloudflare.
- Cloudflare atua como proxy reverso global.
- Pode responder requisições diretamente via cache.
- Certificados SSL gerenciados pela Cloudflare (Full / Strict SSL).

### Cloudflare → AWS ALB
- Caso não haja cache, a requisição é encaminhada para AWS.
- Destino: Application Load Balancer.
- O ALB distribui tráfego entre instâncias EC2.

### ALB → EC2 → RDS
- EC2s em subnets privadas processam a aplicação.
- Requisições seguem regras de negócio.
- A aplicação acessa o Amazon RDS via rede interna.

---

## Características

- Menor custo operacional
- Dependência de serviço externo (Cloudflare)
- Menor integração nativa com AWS
- Alta eficiência de cache na borda
- Segurança baseada em regras da Cloudflare

---

# Proposta Maior Investimento

## Visão Geral

Na proposta Maior Investimento, a camada de entrada é totalmente baseada em serviços AWS, utilizando o **Amazon CloudFront** como CDN global.

O CloudFront atua como primeira camada da infraestrutura, integrado ao Route 53 e serviços de segurança como AWS WAF e ACM.

---

## Fluxo de Entrada

Usuário
│
▼
Registro.br
|
▼
Amazon Route 53
|
▼
Amazon CloudFront
|
▼
AWS WAF
|
▼
Application Load Balancer (AWS)
|
▼
Auto Scaling Group
|
▼
Amazon EC2 (Subnets privadas)
|
▼
Amazon RDS PostgreSQL


---

## Funcionamento do Fluxo

### Usuário → Route 53 → CloudFront
- O domínio é resolvido pelo Route 53.
- Route 53 retorna a distribuição CloudFront.
- Conexão HTTPS é estabelecida com o CloudFront.

### CloudFront → AWS WAF
- Requisições passam por inspeção do WAF.
- Regras de segurança filtram tráfego malicioso.
- Apenas requisições válidas seguem adiante.

### CloudFront → ALB → EC2
- CloudFront encaminha requisições ao ALB.
- O ALB distribui para instâncias EC2.
- EC2s processam a aplicação em subnets privadas.

### EC2 → RDS
- Comunicação com banco via rede interna da VPC.
- Banco Amazon RDS PostgreSQL isolado.

---

## Características

- Alta integração com AWS
- Melhor controle de segurança (WAF + ACM)
- Menor dependência de terceiros
- Alta escalabilidade global
- Melhor governança e observabilidade

---

# Comparação entre as Propostas

| Camada               | Low-Cost              | Maior Investimento        |
|---------------------|-----------------------|----------------------------|
| CDN                 | Cloudflare            | CloudFront                 |
| DNS                 | Registro.br + Cloudflare | Route 53               |
| Firewall            | Regras Cloudflare     | AWS WAF                    |
| Certificados SSL    | Cloudflare SSL        | AWS Certificate Manager    |
| Integração AWS      | Parcial               | Completa                   |

---

## Diferença Arquitetural Principal

### Low-Cost
- Foco em redução de custos
- Uso de serviços externos (Cloudflare)
- Menor complexidade dentro da AWS

### Maior Investimento
- Integração total com AWS
- Maior controle de segurança e tráfego
- Melhor observabilidade e escalabilidade global

---

## Resumo

O fluxo de rede nas duas arquiteturas segue o mesmo padrão fundamental:

- Resolução DNS  
- Camada de CDN / Edge  
- Balanceamento de carga  
- Execução em EC2  
- Persistência em RDS  

A principal diferença está na camada de entrada:

- Low-Cost → Cloudflare  
- Maior Investimento → Amazon CloudFront  

Essa escolha impacta diretamente custo, segurança, controle e integração da arquitetura.



