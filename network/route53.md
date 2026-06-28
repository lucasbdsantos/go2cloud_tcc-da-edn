# Amazon Route 53

## Visão Geral

O Amazon Route 53 é o serviço de DNS gerenciado da AWS responsável pela resolução do domínio da aplicação.

Na proposta **Maior Investimento**, o Route 53 é utilizado como servidor DNS autoritativo, direcionando as requisições dos usuários para a camada de distribuição de conteúdo da arquitetura.

Após o registro do domínio no **Registro.br**, os servidores DNS passam a ser gerenciados pelo Amazon Route 53.

---

# Objetivos

O Amazon Route 53 possui os seguintes objetivos:

* Gerenciar a resolução DNS do domínio.
* Direcionar o tráfego para a infraestrutura AWS.
* Integrar-se aos demais serviços da arquitetura.
* Fornecer alta disponibilidade para a resolução de nomes.
* Simplificar o gerenciamento dos registros DNS.

---

# Arquitetura

Após o registro do domínio, o Amazon Route 53 torna-se o servidor DNS autoritativo da aplicação.

Todas as consultas DNS realizadas pelos usuários são respondidas pelo Route 53.

Fluxo simplificado:

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

# Integração com Registro.br

O domínio é registrado no Registro.br.

Após a criação da Hosted Zone no Amazon Route 53, são fornecidos os Name Servers (NS) responsáveis pela resolução do domínio.

Esses servidores são cadastrados no painel do Registro.br, delegando ao Route 53 toda a administração do DNS.

Fluxo:

```text
Registro.br
      │
      ▼
Name Servers (AWS)
      │
      ▼
Amazon Route 53
```

---

# Hosted Zone

A Hosted Zone representa a zona DNS do domínio.

Nela são armazenados todos os registros utilizados pela aplicação.

Entre os principais registros estão:

* Registro A (Alias)
* Registro AAAA (IPv6)
* Registro CNAME (quando necessário)
* Registro MX
* Registro TXT

---

# Registro Principal

O domínio principal é configurado utilizando um registro **A (Alias)** apontando para a distribuição do Amazon CloudFront.

Fluxo:

```text
Domínio
      │
      ▼
Route 53
      │
      ▼
Alias Record
      │
      ▼
Amazon CloudFront
```

A utilização de registros Alias elimina a necessidade de gerenciamento manual de endereços IP.

---

# Integração com CloudFront

Após resolver o domínio, o Route 53 direciona os usuários para a distribuição do Amazon CloudFront.

A partir desse ponto:

* O CloudFront recebe a conexão HTTPS.
* O AWS Certificate Manager fornece o certificado TLS.
* O AWS WAF inspeciona as requisições.
* O Application Load Balancer distribui o tráfego para as instâncias EC2.

---

# Fluxo Completo

```text
Usuário
      │
      ▼
Consulta DNS
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

# Benefícios

A utilização do Amazon Route 53 oferece diversas vantagens para a proposta de Maior Investimento.

## Alta Disponibilidade

O serviço é totalmente gerenciado pela AWS e distribuído globalmente.

---

## Integração Nativa

O Route 53 integra-se diretamente com:

* Amazon CloudFront
* Application Load Balancer
* AWS Certificate Manager
* Outros serviços da AWS

---

## Gerenciamento Simplificado

A administração dos registros DNS ocorre em um único serviço, integrado ao restante da infraestrutura.

---

# Comparação entre as Propostas

| Característica | Low Cost | Maior Investimento |
|----------------|:--------:|:------------------:|
| Registro.br | ✔ | ✔ |
| Amazon Route 53 | ✖ | ✔ |
| Cloudflare DNS | ✔ | ✖ |
| Hosted Zone | ✖ | ✔ |
| Alias Records | ✖ | ✔ |

---

# Decisões Arquiteturais

As principais decisões relacionadas ao Amazon Route 53 foram:

### Integração com os serviços AWS

O Route 53 foi escolhido por integrar-se de forma nativa ao Amazon CloudFront e ao restante da infraestrutura.

---

### Separação da camada DNS

O Route 53 atua exclusivamente como servidor DNS autoritativo.

A distribuição de conteúdo e a proteção da aplicação são realizadas por outros serviços da arquitetura.

---

### Gerenciamento centralizado

Todos os registros DNS da aplicação permanecem centralizados na AWS, facilitando futuras expansões da infraestrutura.

---

# Resumo

O Amazon Route 53 é responsável pela resolução do domínio da aplicação na proposta **Maior Investimento**.

Após a delegação do domínio realizada no Registro.br, o Route 53 passa a atuar como servidor DNS autoritativo, direcionando as requisições para o Amazon CloudFront.

Essa abordagem proporciona alta disponibilidade, integração nativa com os serviços AWS e gerenciamento centralizado da camada de DNS, compondo a estratégia de entrada da arquitetura de maior investimento.