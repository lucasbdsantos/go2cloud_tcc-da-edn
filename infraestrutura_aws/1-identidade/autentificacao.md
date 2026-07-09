# Autenticação e Gerenciamento de Identidade

### Objetivo

Este documento descreve a estratégia de autenticação adotada nas duas propostas arquiteturais do projeto.

A proposta de **Menor investimento (Low-cost)** reutiliza o mecanismo de autenticação já implementado na aplicação, enquanto a proposta **Maior Investimento** utiliza o Amazon Cognito como serviço gerenciado de identidade.

Os detalhes de implementação da autenticação (middlewares, JWT, bcrypt, validações e regras de negócio) são documentados no repositório da aplicação.

---

## Proposta de Menor investimento

### Visão Geral

Na proposta Low-Cost não é utilizado o Amazon Cognito.

A aplicação possui um mecanismo próprio de autenticação baseado em JSON Web Token (JWT), permitindo manter toda a lógica de autenticação no backend da aplicação.

Essa abordagem reduz custos de infraestrutura, elimina dependências de serviços externos de identidade e aproveita uma implementação já consolidada.

---

### Fluxo de Autenticação

1. O usuário acessa a aplicação através do domínio protegido pelo Cloudflare.

2. As requisições seguem para o Application Load Balancer, que distribui o tráfego para as instâncias EC2 executando a aplicação.

3. Durante o login, o backend valida as credenciais informadas consultando os usuários armazenados no banco PostgreSQL.

4. Após a autenticação bem-sucedida, a aplicação gera um JWT contendo as informações necessárias para identificação do usuário e devolve esse token ao cliente.

5. Nas requisições seguintes, o token é enviado no cabeçalho Authorization e validado pelo backend antes do processamento da solicitação.

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

### Recursos de Segurança

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

### Integração com AWS

A autenticação dos usuários é totalmente realizada pela aplicação, sem dependência de serviços gerenciados de identidade da AWS e sem comunicação externa para autenticação. As únicas integrações com a AWS são relacionadas à infraestrutura, como: 
- Amazon ECR;
- AWS Systems Manager;
- AWS Secrets Manager;
- Amazon CloudWatch;
- Amazon S3.

As intregrações são realizadas por meio de IAM Roles e, quando configurado, VPC Endpoints.

---
</br>

## Proposta de Maior Investimento

### Visão Geral

Na proposta de maior investimento, a autenticação dos usuários é centralizada utilizando o Amazon Cognito.

Nesse cenário, a aplicação delega ao Cognito o gerenciamento das identidades, autenticação dos usuários e emissão dos tokens utilizados nas requisições autenticadas.

Essa abordagem reduz a responsabilidade da aplicação em relação ao gerenciamento de identidade e facilita a adoção de recursos avançados de autenticação.

---

### Fluxo de Autenticação

1. O usuário acessa a aplicação normalmente através do domínio publicado.

2. Ao realizar o login, a aplicação encaminha a solicitação ao Amazon Cognito.

3. Após validar as credenciais, o Cognito gera os tokens de autenticação e os devolve para a aplicação, que passa a utilizá-los nas requisições autenticadas.

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

### Comunicação com o Cognito

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

### Recursos Disponíveis

O Amazon Cognito oferece funcionalidades adicionais, como:

- Gerenciamento centralizado de usuários;
- Políticas de senha;
- Recuperação de senha;
- Autenticação multifator (MFA);
- Integração com provedores de identidade;
- Gerenciamento de sessões;
- Emissão e renovação automática de tokens.

---
</br>

## Comparação das Estratégias

| Característica | Menor investimento | Maior Investimento |
|----------------|----------|-------------------|
| Serviço de autenticação | Aplicação(JWT) | Amazon Cognito |
| Gerenciamento de usuários | Aplicação | Amazon Cognito |
| Emissão de JWT | Aplicação | Amazon Cognito |
| Dependência de serviço AWS para autenticação | Não | Sim |
| Comunicação externa para autenticação | Não | Sim |
| Complexidade operacional | Moderado | Moderado |
| Custo | Moderado | Alto |

---
</br>

## Decisão Arquitetural

A proposta **Low-Cost** prioriza simplicidade e redução de custos, reutilizando o mecanismo de autenticação já implementado na aplicação. Essa abordagem elimina a necessidade de um serviço adicional de gerenciamento de identidade, mantendo boas práticas de segurança por meio de JWT, hash de senhas, controle de acesso, HTTPS e mecanismos de proteção contra ataques.

A proposta de **Maior Investimento** utiliza o Amazon Cognito para centralizar a autenticação e o gerenciamento de identidades, oferecendo recursos avançados e reduzindo a responsabilidade da aplicação em relação à segurança das credenciais e ao ciclo de vida dos usuários.

Ambas as soluções atendem aos requisitos do projeto, representando estratégias distintas de arquitetura que equilibram custo, complexidade operacional, segurança e escalabilidade.