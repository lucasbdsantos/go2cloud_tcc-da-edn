# Amazon CloudFront

### Visão Geral

O Amazon CloudFront é o serviço de **Content Delivery Network (CDN)** da AWS responsável por distribuir o conteúdo da aplicação através de uma rede global de **Edge Locations**.

Na proposta **Maior Investimento**, o CloudFront representa a primeira camada da infraestrutura hospedada na AWS, posicionando-se entre o Amazon Route 53 e o Application Load Balancer.

Além da distribuição de conteúdo, o CloudFront integra-se ao **AWS WAF** e ao **AWS Certificate Manager (ACM)**, proporcionando uma camada adicional de segurança, desempenho e disponibilidade.

---

### Objetivos

O Amazon CloudFront possui os seguintes objetivos:

* Reduzir a latência das requisições.
* Distribuir conteúdo através da rede global da AWS.
* Armazenar em cache arquivos estáticos da aplicação.
* Integrar-se ao AWS WAF para inspeção das requisições.
* Utilizar certificados HTTPS gerenciados pelo AWS Certificate Manager.
* Reduzir a carga sobre o Application Load Balancer.
* Melhorar a experiência dos usuários através da entrega de conteúdo pelas Edge Locations mais próximas.

---

### Arquitetura

Na proposta de **Maior Investimento**, todas as requisições HTTPS passam inicialmente pelo Amazon CloudFront.

Após a resolução do domínio realizada pelo Amazon Route 53, o usuário é direcionado para a distribuição CloudFront.

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

O CloudFront atua como intermediário entre os usuários e a infraestrutura hospedada na AWS.

---
</br>

## Funcionamento da Comunicação HTTPS

Todo o acesso à aplicação ocorre utilizando o protocolo **HTTPS**.

O Amazon CloudFront atua como a primeira camada da infraestrutura AWS, recebendo as conexões HTTPS dos usuários e encaminhando as requisições ao Application Load Balancer.

A comunicação ocorre em duas etapas distintas.

### 1. Usuário → Amazon CloudFront

O navegador estabelece uma conexão HTTPS com a distribuição CloudFront.

Durante essa etapa:

* O domínio já foi resolvido pelo Amazon Route 53.
* O certificado TLS é fornecido pelo AWS Certificate Manager (ACM).
* Todo o tráfego entre o usuário e a AWS permanece criptografado.

### 2. Amazon CloudFront → Application Load Balancer

Após receber a requisição do usuário, o CloudFront estabelece uma nova conexão HTTPS com o Application Load Balancer.

O ALB recebe as requisições e realiza o balanceamento entre as instâncias EC2 pertencentes ao Auto Scaling Group.

Após o balanceamento, o tráfego é encaminhado às instâncias através da rede privada da Amazon VPC.

Nesta arquitetura, a comunicação entre o Application Load Balancer e as instâncias Amazon EC2 ocorre utilizando **HTTP**, uma vez que todo o tráfego permanece isolado na rede privada da VPC.

Essa abordagem simplifica a configuração da infraestrutura sem comprometer a segurança do ambiente.


### Fluxo da Comunicação HTTPS

```text
                                                         Usuário
                                                            │
                                                          HTTPS
                                                            │
                                                            ▼
                                                      Amazon CloudFront
                                                      (Certificado ACM)
                                                            │
                                                          HTTPS
                                                            │
                                                            ▼
                                                      Application Load Balancer
                                                      (Certificado ACM)
                                                            │
                                                          HTTP
                                                            │
                                                            ▼
                                                    Auto Scaling Group
                                                            │
                                                            ▼
                                                        Amazon EC2
                                                            │
                                                        JDBC/TCP
                                                            │
                                                            ▼
                                                      Amazon RDS PostgreSQL
```

---
</br>

## Funcionamento do Cache

Após receber uma requisição, o CloudFront verifica se o recurso solicitado já está armazenado em uma de suas Edge Locations.

Existem dois cenários possíveis.

### 1. Cache Hit

Quando o recurso já está armazenado em cache, o CloudFront responde diretamente ao usuário.

Nesse caso, a requisição não é encaminhada para o Application Load Balancer nem para as instâncias EC2.

Fluxo:

```text
                                                         Usuário
                                                            │
                                                            ▼
                                                          HTTPS
                                                            │
                                                            ▼
                                                      Amazon CloudFront
                                                      (Cache Hit)
                                                            │
                                                            ▼
                                                      Resposta ao Usuário
```

Essa estratégia reduz significativamente a latência e diminui a carga sobre a infraestrutura da aplicação.


### 2. Cache Miss

Quando o recurso não está armazenado em cache, o CloudFront encaminha a requisição para a infraestrutura de origem.

Após receber a resposta da aplicação, o CloudFront armazena o conteúdo em cache (quando permitido pelas políticas configuradas), possibilitando que futuras requisições sejam respondidas diretamente pelas Edge Locations.

Fluxo:

```text
                                                         Usuário
                                                            │
                                                          HTTPS
                                                            │
                                                            ▼
                                                      Amazon CloudFront
                                                      (Cache Miss)
                                                            │
                                                         HTTPS
                                                            ▼
                                                Application Load Balancer
                                                            │
                                                            ▼
                                                      Amazon EC2
                                                            │
                                                            ▼
                                                   Resposta da Aplicação
                                                            │
                                                            ▼
                                                      Amazon CloudFront
                                                            │
                                                            ▼
                                                          Cache
                                                            │
                                                            ▼
                                                         Usuário
```


### Estratégia de Cache

Nesta arquitetura, recomenda-se a utilização de diferentes políticas de cache para conteúdos estáticos e dinâmicos.

| Tipo de Conteúdo    | Estratégia         |
| ------------------- | ------------------ |
| Arquivos JavaScript | Cache habilitado   |
| Arquivos CSS        | Cache habilitado   |
| Imagens             | Cache habilitado   |
| Fontes              | Cache habilitado   |
| Ícones              | Cache habilitado   |
| Documentos públicos | Cache habilitado   |
| API REST (`/api/*`) | Cache desabilitado |
| Autenticação        | Cache desabilitado |
| Operações dinâmicas | Cache desabilitado |

Os arquivos estáticos podem permanecer armazenados nas Edge Locations durante longos períodos, enquanto as requisições dinâmicas são sempre encaminhadas ao Application Load Balancer.

---
</br>

### Integração com o Application Load Balancer

Na arquitetura proposta, o Application Load Balancer é configurado como **Origin** da distribuição CloudFront.

Fluxo:

```text
                                                      Amazon CloudFront
                                                              │
                                                              ▼
                                                  Application Load Balancer
                                                              │
                                                              ▼
                                                      Auto Scaling Group
                                                              │
                                                              ▼
                                                         Amazon EC2
```

Essa configuração permite que o CloudFront utilize todos os recursos de balanceamento, alta disponibilidade e escalabilidade oferecidos pelo Application Load Balancer.

---

### Integração com o AWS WAF

O AWS WAF é associado diretamente à distribuição CloudFront.

Todas as requisições HTTP e HTTPS são analisadas antes de alcançarem o Application Load Balancer.

Entre as proteções implementadas destacam-se:

* Bloqueio de requisições maliciosas.
* Proteção contra ataques comuns a aplicações Web.
* Filtragem de tráfego HTTP/HTTPS.
* Regras gerenciadas pela AWS.
* Mitigação de ataques automatizados.

---

### Integração com o AWS Certificate Manager

O Amazon CloudFront utiliza certificados emitidos pelo AWS Certificate Manager.

Essa integração garante:

* Comunicação HTTPS.
* Criptografia TLS.
* Gerenciamento automático dos certificados.
* Renovação automática dos certificados emitidos pela AWS.

---
</br>

## Benefícios

### 1. Desempenho

* Redução da latência.
* Distribuição global através das Edge Locations.
* Cache automático de arquivos estáticos.
* Menor carga sobre o Application Load Balancer.
* Melhor experiência para usuários distribuídos geograficamente.

### 2. Segurança

A integração entre CloudFront, AWS WAF e AWS Certificate Manager oferece uma camada adicional de proteção para a aplicação.

Os principais benefícios incluem:

* Comunicação HTTPS.
* Inspeção das requisições.
* Proteção contra ataques Web.
* Redução da exposição direta da infraestrutura.

### 3. Escalabilidade

O CloudFront distribui o tráfego utilizando milhares de servidores distribuídos globalmente, absorvendo grandes volumes de acesso antes que as requisições alcancem a infraestrutura da aplicação.


### Fluxo Completo

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

### Comparação entre as Propostas

| Característica                         | Low Cost | Maior Investimento |
| -------------------------------------- | :------: | :----------------: |
| Amazon CloudFront                      |     ✖    |          ✔         |
| Cloudflare CDN                         |     ✔    |          ✖         |
| Cache Global                           |     ✔    |          ✔         |
| Edge Locations                         |     ✔    |          ✔         |
| Integração com AWS WAF                 |     ✖    |          ✔         |
| Integração com AWS Certificate Manager |     ✖    |          ✔         |
| Cache de arquivos estáticos            |     ✔    |          ✔         |

---
</br>

## Decisões Arquiteturais

As principais decisões relacionadas ao Amazon CloudFront foram:

### 1. Distribuição Global

O CloudFront foi escolhido para reduzir a latência das requisições e distribuir o conteúdo da aplicação através da infraestrutura global da AWS.


### 2. Integração Nativa

O serviço integra-se de forma nativa ao Amazon Route 53, AWS WAF, AWS Certificate Manager e Application Load Balancer, simplificando o gerenciamento da camada de entrada da arquitetura.


### 3. Otimização de Desempenho

A utilização de cache para conteúdos estáticos reduz significativamente o número de requisições encaminhadas à infraestrutura de origem, melhorando o desempenho da aplicação e reduzindo a carga sobre as instâncias EC2.

---
</br>


### Resumo

O Amazon CloudFront é responsável pela distribuição global de conteúdo na proposta **Maior Investimento**, atuando como a principal camada de entrada da infraestrutura hospedada na AWS.

Além de acelerar a entrega de conteúdo por meio das Edge Locations, o CloudFront estabelece conexões HTTPS seguras com os usuários e com o Application Load Balancer, integra-se ao AWS WAF para inspeção das requisições e utiliza certificados gerenciados pelo AWS Certificate Manager.

A estratégia de cache para arquivos estáticos reduz a carga sobre o Application Load Balancer e as instâncias Amazon EC2, enquanto as requisições dinâmicas continuam sendo encaminhadas diretamente para a aplicação.

Essa arquitetura representa uma solução escalável, segura e alinhada às boas práticas recomendadas pela AWS para aplicações Web de produção.