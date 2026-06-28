# Autenticação e Gerenciamento de Identidade

## Objetivo

Este documento descreve a estratégia de autenticação adotada nas duas propostas arquiteturais do projeto.

A proposta **Low-Cost** reutiliza o mecanismo de autenticação já implementado na aplicação, enquanto a proposta **Maior Investimento** utiliza o Amazon Cognito como serviço gerenciado de identidade.

Os detalhes de implementação da autenticação (middlewares, JWT, bcrypt, validações e regras de negócio) são documentados no repositório da aplicação.

---

# Proposta Low-Cost

## Visão Geral

Na proposta Low-Cost não é utilizado o Amazon Cognito.

A aplicação possui um mecanismo próprio de autenticação baseado em JSON Web Token (JWT), permitindo manter toda a lógica de autenticação no backend da aplicação.

Essa abordagem reduz custos de infraestrutura, elimina dependências de serviços externos de identidade e aproveita uma implementação já consolidada.

---

## Fluxo de Autenticação

O usuário acessa a aplicação através do domínio protegido pelo Cloudflare.

As requisições seguem para o Application Load Balancer, que distribui o tráfego para as instâncias EC2 executando a aplicação.

Durante o login, o backend valida as credenciais informadas consultando os usuários armazenados no banco PostgreSQL.

Após a autenticação bem-sucedida, a aplicação gera um JWT contendo as informações necessárias para identificação do usuário e devolve esse token ao cliente.

Nas requisições seguintes, o token é enviado no cabeçalho Authorization e validado pelo backend antes do processamento da solicitação.

Fluxo resumido:

```text
Usuário

↓

Cloudflare
(DNS + CDN + WAF)

↓

Application Load Balancer

↓

Aplicação (EC2)

↓

PostgreSQL

↓

Validação das credenciais

↓

JWT

↓

Usuário
```

---

## Recursos de Segurança

A autenticação da aplicação utiliza diversas camadas de segurança, entre elas:

- JWT com expiração configurada;
- Hash de senhas utilizando bcrypt;
- Validação das credenciais no backend;
- Helmet para proteção de cabeçalhos HTTP;
- Rate Limiting nas rotas de autenticação;
- Controle de acesso baseado em perfis (Role-Based Access);
- Comunicação protegida por HTTPS através do Application Load Balancer.

Essa estratégia permite manter um ambiente seguro sem depender de um serviço externo de autenticação.

---

## Integração com AWS

Mesmo sem utilizar o Amazon Cognito, as instâncias EC2 continuam acessando serviços AWS através de IAM Roles e VPC Endpoints.

Entre eles:

- Amazon ECR;
- AWS Systems Manager;
- AWS Secrets Manager;
- Amazon CloudWatch;
- Amazon S3.

A autenticação dos usuários permanece totalmente independente da autenticação entre a aplicação e os serviços AWS.

---

# Proposta de Maior Investimento

## Visão Geral

Na proposta de maior investimento, a autenticação dos usuários é centralizada utilizando o Amazon Cognito.

Nesse cenário, a aplicação delega ao Cognito o gerenciamento das identidades, autenticação dos usuários e emissão dos tokens utilizados nas requisições autenticadas.

Essa abordagem reduz a responsabilidade da aplicação em relação ao gerenciamento de identidade e facilita a adoção de recursos avançados de autenticação.

---

## Fluxo de Autenticação

O usuário acessa a aplicação normalmente através do domínio publicado.

Ao realizar o login, a aplicação encaminha a solicitação ao Amazon Cognito.

Após validar as credenciais, o Cognito gera os tokens de autenticação e os devolve para a aplicação, que passa a utilizá-los nas requisições autenticadas.

Fluxo resumido:

```text
Usuário

↓

CloudFront

↓

Application Load Balancer

↓

Aplicação (EC2)

↓

Amazon Cognito

↓

Validação das credenciais

↓

JWT

↓

Aplicação

↓

Usuário
```

---

## Comunicação com o Cognito

As instâncias EC2 permanecem em subnets privadas.

Nesta proposta, a comunicação com o Amazon Cognito ocorre através do NAT Gateway.

Fluxo:

```text
EC2

↓

NAT Gateway

↓

Internet

↓

Amazon Cognito
```

---

## Recursos Disponíveis

O Amazon Cognito oferece funcionalidades adicionais, como:

- gerenciamento centralizado de usuários;
- políticas de senha;
- recuperação de senha;
- autenticação multifator (MFA);
- integração com provedores de identidade;
- gerenciamento de sessões;
- emissão e renovação automática de tokens.

---

# Comparação das Estratégias

| Característica | Low-Cost | Maior Investimento |
|----------------|----------|-------------------|
| Serviço de autenticação | Aplicação | Amazon Cognito |
| Gerenciamento de usuários | Aplicação | Cognito |
| Emissão de JWT | Aplicação | Cognito |
| Dependência de serviço AWS | Não | Sim |
| Comunicação externa para autenticação | Não | Sim |
| Complexidade operacional | Menor | Maior |
| Custo | Menor | Maior |

---

# Decisão Arquitetural

A proposta Low-Cost prioriza simplicidade e redução de custos, reutilizando o mecanismo de autenticação já implementado na aplicação. Essa abordagem elimina a necessidade de um serviço adicional de gerenciamento de identidade, mantendo boas práticas de segurança por meio de JWT, hash de senhas, controle de acesso, HTTPS e mecanismos de proteção contra ataques.

A proposta de Maior Investimento utiliza o Amazon Cognito para centralizar a autenticação e o gerenciamento de identidades, oferecendo recursos avançados e reduzindo a responsabilidade da aplicação em relação à segurança das credenciais e ao ciclo de vida dos usuários.

Ambas as soluções atendem aos requisitos do projeto, representando estratégias distintas de arquitetura que equilibram custo, complexidade operacional, segurança e escalabilidade.