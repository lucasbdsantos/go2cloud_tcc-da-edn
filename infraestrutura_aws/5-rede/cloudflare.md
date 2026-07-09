# Cloudflare

### Visão Geral

Na proposta **Low Cost**, a Cloudflare é responsável pela camada de entrada da aplicação, concentrando os serviços de DNS, CDN, Web Application Firewall (WAF), proxy reverso e gerenciamento de certificados SSL/TLS.

Essa abordagem substitui serviços equivalentes da AWS, como Amazon Route 53, Amazon CloudFront e AWS WAF, reduzindo significativamente o custo operacional da infraestrutura.

Após o registro do domínio no **Registro.br**, os servidores DNS são apontados para a Cloudflare, que passa a gerenciar todo o tráfego destinado à aplicação.

---

### Objetivos

A utilização da Cloudflare possui os seguintes objetivos:

* Gerenciar a resolução DNS do domínio.
* Proteger a aplicação contra ataques provenientes da Internet.
* Distribuir conteúdo através da CDN global.
* Disponibilizar acesso seguro utilizando HTTPS.
* Reduzir custos com serviços de borda da AWS.
* Atuar como proxy reverso entre os usuários e a infraestrutura hospedada na AWS.

---

### Arquitetura

Na proposta Low Cost, a Cloudflare representa a primeira camada da infraestrutura acessada pelos usuários.

Todo o tráfego HTTPS passa inicialmente pela rede da Cloudflare antes de ser encaminhado ao Application Load Balancer.

Fluxo simplificado:

```text id="h81ccf"
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
</br>

## Serviços Utilizados

### 1. DNS

A Cloudflare atua como servidor DNS autoritativo da aplicação.

#### Funções

* Resolução do domínio.
* Gerenciamento dos registros DNS.
* Encaminhamento das requisições para a infraestrutura AWS.


### 2. Proxy Reverso

Todas as requisições passam primeiro pela infraestrutura da Cloudflare.

O endereço IP do Application Load Balancer permanece oculto aos usuários finais, aumentando a segurança da aplicação.


### 3. CDN

A Content Delivery Network (CDN) distribui conteúdo através da rede global da Cloudflare.

#### Benefícios

* Redução da latência.
* Melhor desempenho para usuários.
* Cache de conteúdos estáticos.
* Menor número de requisições ao ambiente AWS.


### 4. Web Application Firewall (WAF)

A Cloudflare implementa uma camada adicional de proteção para aplicações Web.

#### Recursos

* Filtragem de tráfego HTTP e HTTPS.
* Bloqueio de requisições maliciosas.
* Proteção contra ataques comuns a aplicações Web.
* Mitigação de ataques DDoS.


### 5. SSL/TLS

A Cloudflare gerencia os certificados utilizados na comunicação HTTPS entre os usuários e a aplicação.

Essa configuração garante que todo o tráfego seja criptografado durante a comunicação.

---
</br>

### Fluxo das Requisições

O fluxo de entrada das requisições ocorre da seguinte forma:

```text
                                                   Usuário
                                                      │
                                                      ▼
                                                Consulta DNS
                                                      │
                                                      ▼
                                                  Cloudflare
                                                      │
                                                      ▼
                                                Inspeção WAF
                                                      │
                                                      ▼
                                                  CDN / Cache
                                                      │
                                                      ▼
                                                    HTTPS
                                                      │
                                                      ▼
                                          Application Load Balancer
                                                      │
                                                      ▼
                                                 Amazon EC2
```

A Cloudflare realiza todas as verificações de segurança antes de encaminhar o tráfego para a infraestrutura hospedada na AWS.

---

### Integração com a AWS

Após o processamento realizado pela Cloudflare, as requisições são encaminhadas ao Application Load Balancer.

A partir desse ponto, o fluxo segue normalmente pela infraestrutura AWS.

```text
                                                 Cloudflare
                                                      │
                                                      ▼
                                          Application Load Balancer
                                                      │
                                                      ▼
                                                Auto Scaling Group
                                                      │
                                                      ▼
                                                 Amazon EC2
                                                      │
                                                      ▼
                                            Amazon RDS PostgreSQL
```

---
</br>

## Benefícios da Arquitetura

A utilização da Cloudflare proporciona diversas vantagens para a proposta Low Cost.

### 1. Redução de Custos

A Cloudflare substitui três serviços gerenciados da AWS:

| Serviço AWS       | Substituído por |
| ----------------- | --------------- |
| Amazon Route 53   | Cloudflare DNS  |
| Amazon CloudFront | Cloudflare CDN  |
| AWS WAF           | Cloudflare WAF  |

Essa estratégia reduz significativamente o custo mensal da infraestrutura.

### 2. Segurança

A camada de borda protege a aplicação antes que o tráfego alcance a AWS.

Entre os mecanismos utilizados estão:

* Proxy Reverso.
* Firewall para aplicações Web.
* Mitigação de ataques DDoS.
* Criptografia HTTPS.
* Ocultação do endereço IP do Application Load Balancer.

### 3. Desempenho

A CDN da Cloudflare contribui para:

* Menor latência.
* Distribuição global de conteúdo.
* Cache de arquivos estáticos.
* Redução da carga sobre o Application Load Balancer.

---
</br>

### Comparação com a Proposta de Maior Investimento

| Característica    | Low Cost |         Maior Investimento        |
| ----------------- | :------: | :-------------------------------: |
| Cloudflare DNS    |     ✔    |                 ✖                 |
| Cloudflare CDN    |     ✔    |                 ✖                 |
| Cloudflare WAF    |     ✔    |                 ✖                 |
| Proxy Reverso     |     ✔    |                 ✖                 |
| SSL/TLS           |     ✔    | Parcial (AWS Certificate Manager) |
| Amazon Route 53   |     ✖    |                 ✔                 |
| Amazon CloudFront |     ✖    |                 ✔                 |
| AWS WAF           |     ✖    |                 ✔                 |

---
</br>

## Decisões Arquiteturais

As principais decisões relacionadas à Cloudflare foram:

### 1. Centralização da Camada de Entrada

A Cloudflare concentra os serviços de DNS, CDN, WAF e SSL em uma única plataforma, simplificando a arquitetura.

### 2. Otimização de Custos

A substituição dos serviços de borda da AWS pela Cloudflare reduz significativamente o investimento necessário para disponibilizar a aplicação na Internet.

### 3. Segurança

Toda requisição é inspecionada antes de alcançar o ambiente AWS, reduzindo a exposição direta da infraestrutura e melhorando a postura de segurança da solução.

---
</br>

### Resumo

Na proposta **Low Cost**, a Cloudflare desempenha um papel central na camada de entrada da aplicação, atuando como serviço de DNS, CDN, Web Application Firewall, proxy reverso e gerenciador de certificados SSL/TLS.

Ao substituir serviços equivalentes da AWS, a Cloudflare permite reduzir os custos da infraestrutura sem comprometer a disponibilidade, a segurança e o desempenho da aplicação.

Essa decisão arquitetural representa um dos principais diferenciais da proposta Low Cost, demonstrando como é possível construir uma solução moderna e segura utilizando serviços de borda externos integrados à infraestrutura hospedada na AWS.