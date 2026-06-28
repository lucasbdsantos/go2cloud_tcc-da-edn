# DNS

## Visão Geral

O Domain Name System (DNS) é responsável por traduzir nomes de domínio em endereços IP, permitindo que os usuários acessem a aplicação utilizando um endereço amigável.

Neste projeto, ambas as propostas utilizam um domínio registrado no **Registro.br**, porém adotam estratégias diferentes para gerenciamento do DNS e proteção da camada de entrada da aplicação.

A proposta **Low Cost** utiliza os serviços da **Cloudflare**, enquanto a proposta de **Maior Investimento** utiliza os serviços nativos da AWS, como Amazon Route 53, Amazon CloudFront e AWS WAF.

---

# Objetivos

A camada de DNS possui os seguintes objetivos:

* Registrar o domínio da aplicação.
* Disponibilizar acesso seguro via HTTPS.
* Direcionar o tráfego para a infraestrutura AWS.
* Melhorar desempenho e disponibilidade.
* Proteger a aplicação contra ameaças comuns da Internet.

---

# Registro do Domínio

Em ambas as arquiteturas, o domínio é adquirido através do **Registro.br**, responsável pelo registro de domínios brasileiros com a extensão **.br**.

Após o registro, os servidores DNS são configurados conforme a proposta arquitetural adotada.

---

# Proposta Low Cost

Na arquitetura **Low Cost**, o gerenciamento do DNS é realizado pela Cloudflare.

Além da resolução de nomes, a Cloudflare fornece serviços integrados de CDN, Web Application Firewall (WAF), proxy reverso e gerenciamento de certificados SSL/TLS.

Essa estratégia reduz custos ao substituir serviços equivalentes da AWS.

---

## Fluxo das Requisições

```text
Usuário
      │
      ▼
Registro.br
      │
      ▼
Cloudflare
(DNS + CDN + WAF + SSL)
      │
      ▼
Application Load Balancer
      │
      ▼
Amazon EC2
```

---

## Componentes Utilizados

| Serviço                   | Função                       |
| ------------------------- | ---------------------------- |
| Registro.br               | Registro do domínio          |
| Cloudflare DNS            | Resolução de nomes           |
| Cloudflare CDN            | Distribuição de conteúdo     |
| Cloudflare WAF            | Proteção contra ataques Web  |
| Cloudflare SSL            | Criptografia HTTPS           |
| Application Load Balancer | Distribuição das requisições |

---

## Benefícios

* Redução significativa de custos.
* DNS gerenciado.
* CDN integrada.
* Firewall de aplicações.
* Proteção contra ataques DDoS.
* Gerenciamento automático de certificados HTTPS.

---

# Proposta de Maior Investimento

Na arquitetura **Maior Investimento**, toda a camada de entrada utiliza serviços gerenciados da AWS.

Após o registro do domínio no Registro.br, os Name Servers são configurados para o Amazon Route 53, responsável pela resolução DNS.

As requisições passam pelo Amazon CloudFront, são protegidas pelo AWS WAF e, posteriormente, encaminhadas ao Application Load Balancer.

---

## Fluxo das Requisições

```text
Usuário
      │
      ▼
Registro.br
      │
      ▼
Amazon Route 53
      │
      ▼
Amazon CloudFront
      │
      ▼
AWS WAF
      │
      ▼
Application Load Balancer
      │
      ▼
Amazon EC2
```

---

## Componentes Utilizados

| Serviço                   | Função                       |
| ------------------------- | ---------------------------- |
| Registro.br               | Registro do domínio          |
| Amazon Route 53           | Serviço DNS                  |
| Amazon CloudFront         | CDN                          |
| AWS WAF                   | Firewall para aplicações Web |
| AWS Certificate Manager   | Certificados SSL/TLS         |
| Application Load Balancer | Balanceamento de carga       |

---

## Benefícios

* Integração completa com a AWS.
* Distribuição global de conteúdo.
* Proteção avançada através do AWS WAF.
* Gerenciamento centralizado da infraestrutura.
* Alta disponibilidade dos serviços de borda.

---

# Comparação entre as Propostas

| Característica            | Low Cost | Maior Investimento |
| ------------------------- | :------: | :----------------: |
| Registro.br               |     ✔    |          ✔         |
| Cloudflare DNS            |     ✔    |          ✖         |
| Amazon Route 53           |     ✖    |          ✔         |
| Cloudflare CDN            |     ✔    |          ✖         |
| Amazon CloudFront         |     ✖    |          ✔         |
| Cloudflare WAF            |     ✔    |          ✖         |
| AWS WAF                   |     ✖    |          ✔         |
| AWS Certificate Manager   |     ✖    |          ✔         |
| Application Load Balancer |     ✔    |          ✔         |

---

# Fluxo Geral da Camada de Entrada

## Low Cost

```text
Registro.br
      │
      ▼
Cloudflare
      │
      ▼
Application Load Balancer
      │
      ▼
Amazon EC2
```

---

## Maior Investimento

```text
Registro.br
      │
      ▼
Amazon Route 53
      │
      ▼
Amazon CloudFront
      │
      ▼
AWS WAF
      │
      ▼
Application Load Balancer
      │
      ▼
Amazon EC2
```

---

# Decisões Arquiteturais

As principais decisões relacionadas ao DNS foram:

### Registro do domínio

Ambas as arquiteturas utilizam o **Registro.br** para aquisição do domínio brasileiro da aplicação.

---

### Estratégia Low Cost

A Cloudflare concentra os serviços de DNS, CDN, WAF e SSL, reduzindo custos sem comprometer a segurança e a disponibilidade da aplicação.

---

### Estratégia de Maior Investimento

A arquitetura utiliza os serviços nativos da AWS para gerenciamento do DNS e proteção da camada de entrada, proporcionando maior integração com o restante da infraestrutura.

---

# Resumo

A camada de DNS é responsável pelo primeiro contato entre o usuário e a infraestrutura da aplicação.

Embora ambas as propostas utilizem um domínio registrado no **Registro.br**, elas adotam estratégias distintas para o gerenciamento do tráfego.

Na proposta **Low Cost**, a Cloudflare centraliza os serviços de DNS, CDN, WAF e HTTPS, oferecendo uma solução econômica e eficiente.

Na proposta **Maior Investimento**, a arquitetura utiliza Amazon Route 53, Amazon CloudFront e AWS WAF, formando uma camada de entrada totalmente integrada ao ecossistema AWS.

Essa comparação evidencia duas abordagens arquiteturais para publicação de aplicações na Internet, permitindo analisar as diferenças entre custo, integração e recursos disponíveis em cada solução.
