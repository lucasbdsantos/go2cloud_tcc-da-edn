Network Flow
Visão Geral

O Network Flow descreve o caminho completo que as requisições dos usuários percorrem até alcançar os serviços da aplicação, considerando as duas propostas arquiteturais do projeto:

Proposta Low-Cost
Proposta Maior Investimento

Este documento detalha como ocorre a entrada de tráfego na infraestrutura, o papel dos provedores de CDN (Cloudflare ou CloudFront), a resolução DNS e a distribuição das requisições até as camadas de aplicação e banco de dados dentro da AWS.

O objetivo principal é demonstrar como o tráfego de internet é tratado em cada cenário, evidenciando diferenças de custo, segurança, desempenho e complexidade operacional.

Objetivos do Network Flow
Explicar o caminho completo das requisições HTTP/HTTPS.
Demonstrar a diferença entre Cloudflare e AWS CloudFront como camada de borda.
Detalhar o papel do DNS (Registro.br e Route 53).
Apresentar o fluxo de entrada até o Application Load Balancer.
Evidenciar a separação entre camadas públicas e privadas na VPC.
Comparar comportamento das duas arquiteturas.
Proposta Low-Cost
Visão Geral

Na proposta Low-Cost, a camada de borda é fornecida pela Cloudflare, responsável por atuar como CDN e proteção inicial da aplicação.

O Cloudflare funciona como ponto de entrada principal do tráfego, realizando cache global, proteção contra ataques e distribuição de conteúdo estático antes do encaminhamento para a infraestrutura AWS.

Fluxo de Entrada (Low-Cost)
Usuário
      │
      ▼
Registro.br (DNS autoritativo do domínio)
      │
      ▼
Cloudflare (CDN + Proxy Reverso)
      │
      ▼
Application Load Balancer (AWS)
      │
      ▼
Auto Scaling Group
      │
      ▼
Amazon EC2 (Subnets privadas)
      │
      ▼
Amazon RDS PostgreSQL
Funcionamento da Comunicação
Usuário → Cloudflare

O navegador inicia uma conexão HTTPS com o Cloudflare.

Nesta etapa:

O DNS do domínio aponta para os nameservers do Cloudflare.
O Cloudflare atua como proxy reverso global.
O certificado SSL pode ser gerenciado pelo próprio Cloudflare (Full SSL / Strict SSL).
O tráfego pode ser respondido diretamente via cache.
Cloudflare → AWS Application Load Balancer

Quando não há cache disponível, o Cloudflare encaminha a requisição para a infraestrutura AWS.

O destino é o Application Load Balancer, que distribui o tráfego entre instâncias EC2 em Auto Scaling Group.

ALB → EC2 → RDS

Após o balanceamento:

O ALB encaminha requisições para instâncias EC2 em subnets privadas.
As EC2 processam regras de negócio da aplicação.
A aplicação acessa o banco Amazon RDS PostgreSQL via rede privada.
Características da Proposta Low-Cost
Menor custo operacional.
Dependência de serviço externo (Cloudflare).
Menor integração nativa com serviços AWS.
Alta eficiência de cache na borda.
Segurança baseada em regras do Cloudflare.
Proposta Maior Investimento
Visão Geral

Na proposta Maior Investimento, a camada de entrada é totalmente baseada em serviços AWS, utilizando a CDN Amazon CloudFront como ponto principal de distribuição global.

O CloudFront atua como primeira camada da infraestrutura, integrado ao DNS da AWS e serviços de segurança como WAF e ACM.

Fluxo de Entrada (Maior Investimento)
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
Auto Scaling Group
      │
      ▼
Amazon EC2 (Subnets privadas)
      │
      ▼
Amazon RDS PostgreSQL
Funcionamento da Comunicação
Usuário → Route 53 → CloudFront
O domínio é resolvido pelo Amazon Route 53.
O Route 53 retorna a distribuição CloudFront como endpoint principal.
O usuário estabelece conexão HTTPS com o CloudFront.
CloudFront → AWS WAF
O tráfego passa por inspeção do AWS WAF.
Regras de segurança filtram requisições maliciosas.
Apenas tráfego válido segue para a camada de aplicação.
CloudFront → ALB → EC2
O CloudFront encaminha requisições para o Application Load Balancer.
O ALB distribui tráfego entre instâncias EC2 em Auto Scaling Group.
As instâncias processam requisições dentro de subnets privadas.
EC2 → RDS
A aplicação acessa o Amazon RDS via rede interna.
Toda comunicação permanece isolada dentro da VPC.
Características da Proposta Maior Investimento
Alta integração nativa com AWS.
Melhor controle de segurança (WAF + ACM).
Menor dependência de terceiros.
Maior escalabilidade global.
Melhor governança e observabilidade.
Comparação entre as Propostas
Camada de Entrada	Low-Cost	Maior Investimento
CDN	Cloudflare	CloudFront
DNS	Registro.br + Cloudflare	Route 53
Firewall WAF	Cloudflare Rules	AWS WAF
Certificados SSL	Cloudflare SSL	AWS Certificate Manager
Integração AWS	Parcial	Completa
Diferença Principal de Arquitetura
Low-Cost

A arquitetura prioriza:

Redução de custos.
Uso de serviços externos para CDN e segurança.
Menor complexidade operacional dentro da AWS.
Maior Investimento

A arquitetura prioriza:

Integração total dentro do ecossistema AWS.
Maior controle sobre segurança e tráfego.
Melhor observabilidade e governança.
Escalabilidade global nativa.
Resumo

O fluxo de rede nas duas propostas segue a mesma lógica fundamental de entrega de aplicação Web:

Resolução DNS
Camada de CDN / Edge
Balanceamento de carga
Execução em instâncias EC2
Persistência em banco de dados RDS

A principal diferença está na camada de entrada:

Na Low-Cost, o tráfego é gerenciado pelo Cloudflare.
Na Maior Investimento, o tráfego é gerenciado pelo Amazon CloudFront integrado ao ecossistema AWS.

Essa diferença impacta diretamente custo, segurança, controle e integração da arquitetura, sendo um dos principais pontos de decisão do projeto