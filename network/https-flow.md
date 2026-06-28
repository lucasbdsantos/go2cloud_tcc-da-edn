Fluxo HTTPS da Arquitetura (Low-Cost vs Alta Performance)
Visão Geral

Este documento descreve o fluxo de comunicação HTTPS nas duas propostas de arquitetura da aplicação:

Arquitetura Low-Cost (Cloudflare)
Arquitetura de Maior Investimento (Amazon CloudFront)

Ambas seguem o mesmo princípio de segurança: criptografia ponta a ponta via TLS/HTTPS, com terminação na borda (edge) e tráfego interno controlado dentro da infraestrutura AWS.

Na proposta de maior investimento, o fluxo é mais integrado ao ecossistema da Amazon Web Services, enquanto na arquitetura low-cost a borda é delegada ao Cloudflare.

Arquitetura Low-Cost (Cloudflare)
Visão Geral

Nesta arquitetura, o Cloudflare atua como camada de borda responsável por:

DNS
CDN
Terminação SSL/TLS
Proteção DDoS
Cache de conteúdo estático

Ele se posiciona antes da infraestrutura hospedada na AWS.

Componentes
Domínio: Registro.br
Edge / CDN / DNS: Cloudflare
Load Balancer: Application Load Balancer
Certificados: AWS Certificate Manager
Computação: Auto Scaling Group + Amazon EC2
Fluxo HTTPS (Low-Cost)
Usuário
   │
   │ HTTPS
   ▼
Cloudflare (Edge)
   │  ├─ Terminação SSL no edge
   │  ├─ Cache de conteúdo estático (opcional)
   │  └─ Full (Strict) HTTPS até AWS
   │
   │ HTTPS ou HTTP (dependendo da configuração)
   ▼
Application Load Balancer (ALB)
   │  └─ Certificado gerenciado pelo ACM
   │
   │ HTTP ou HTTPS interno
   ▼
Auto Scaling Group (ASG)
   │
   ▼
Amazon EC2
Características da Arquitetura
Menor custo operacional
Configuração mais simples
CDN e proteção de borda nativas do Cloudflare
Possibilidade de tráfego interno via HTTP na AWS
Menor integração com serviços nativos AWS
Arquitetura de Maior Investimento (CloudFront)
Visão Geral

Nesta arquitetura, o Amazon CloudFront substitui o Cloudflare como camada de borda, oferecendo maior integração com a AWS e melhor performance global.

Componentes
CDN Global: Amazon CloudFront
Load Balancer: Application Load Balancer
Certificados: AWS Certificate Manager
Computação: Auto Scaling Group + Amazon EC2
Banco de dados: Amazon RDS PostgreSQL
Fluxo HTTPS (Alta Performance)
Usuário
   │
   │ HTTPS
   ▼
Amazon CloudFront
   │  ├─ Cache em borda (CDN global)
   │  └─ Terminação SSL via ACM
   │
   │ HTTPS
   ▼
Application Load Balancer (ALB)
   │  └─ Certificado gerenciado pelo ACM
   │
   │ HTTP (tráfego interno na VPC privada)
   ▼
Auto Scaling Group (ASG)
   │
   ▼
Amazon EC2
   │
   │ JDBC / TCP
   ▼
Amazon RDS PostgreSQL
Características da Arquitetura
Alta performance global
Integração nativa com AWS
Cache avançado em edge locations
Maior controle sobre políticas de distribuição
Maior custo operacional em relação ao Cloudflare
Comparação entre as Arquiteturas
Característica	Low-Cost (Cloudflare)	Maior Investimento(CloudFront)
CDN Global	Cloudflare	Amazon CloudFront
Integração AWS	Média	Alta
Complexidade	Baixa	Média
Custo	Menor	Maior
Controle de Cache	Médio	Avançado
Segurança na borda	Alta	Alta
Latência global	Boa	Excelente
Diferenças Principais
Cloudflare (Low-Cost)
Foco em simplicidade
Menor custo mensal
CDN e segurança integrados no edge
Menor dependência da AWS
CloudFront (Maior Investimento)
Foco em performance global
Integração total com AWS
Controle avançado de cache
Melhor escalabilidade para produção enterprise
Resumo Final

Ambas as arquiteturas utilizam HTTPS em todas as camadas externas, garantindo segurança e criptografia do tráfego.

Os dois modelos mantêm:

🔐 Terminação HTTPS na borda (Cloudflare ou CloudFront)
🔐 Certificados gerenciados pelo AWS Certificate Manager
🔒 Comunicação interna controlada dentro da VPC
⚙️ Escalabilidade via Auto Scaling Group

A principal diferença está na camada de borda:

Cloudflare → foco em custo e simplicidade
CloudFront → foco em performance e integração com AWS

Essa escolha impacta diretamente custo, latência global e nível de integração com o ecossistema da AWS.