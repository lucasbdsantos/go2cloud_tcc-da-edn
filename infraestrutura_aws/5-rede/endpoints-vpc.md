# VPC Endpoints

### Objetivo

A proposta **Low-Cost** utiliza **VPC Endpoints** para permitir que as instâncias EC2 localizadas nas sub-redes privadas acessem serviços da AWS sem a necessidade de um NAT Gateway.

Essa abordagem reduz significativamente os custos da infraestrutura, mantendo a comunicação privada entre a VPC e os serviços AWS necessários para o funcionamento da aplicação.

---

### Arquitetura

Nesta arquitetura, as instâncias EC2 privadas não possuem acesso direto à Internet.

Toda a comunicação com os serviços AWS utilizados pela aplicação ocorre através de VPC Endpoints.

Os principais serviços acessados são:

* AWS Systems Manager (SSM)
* Amazon Elastic Container Registry (ECR)
* Amazon S3

Essa estratégia elimina a necessidade de tráfego de saída pela Internet para operações de gerenciamento das instâncias e obtenção das imagens Docker da aplicação.

---
</br>

## Endpoints Utilizados

### 1. Interface Endpoint — EC2 Messages

**Serviço**

```
com.amazonaws.<region>.ec2messages
```

**Finalidade**

Utilizado pelo agente do Systems Manager para troca de mensagens de controle com o serviço AWS.

Também é um endpoint obrigatório para o gerenciamento das instâncias via SSM.

### 2. Interface Endpoint — Amazon ECR API

**Serviço**

```
com.amazonaws.<region>.ecr.api
```

**Finalidade**

Permite que as instâncias realizem autenticação e chamadas à API do Amazon Elastic Container Registry.

É utilizado durante o processo de obtenção das imagens Docker armazenadas no ECR.

### 3. Interface Endpoint — Amazon ECR Docker

**Serviço**

```
com.amazonaws.<region>.ecr.dkr
```

**Finalidade**

Responsável pela transferência das imagens Docker do Amazon ECR para as instâncias EC2.

Sem este endpoint, o comando `docker pull` não consegue realizar o download das imagens.

### 4. Gateway Endpoint — Amazon S3

**Serviço**

```
com.amazonaws.<region>.s3
```

**Finalidade**

Embora as imagens sejam armazenadas logicamente no Amazon ECR, suas camadas (layers) são armazenadas no Amazon S3.

Durante um `docker pull`, após a autenticação no ECR, as camadas da imagem são transferidas diretamente do Amazon S3.

Por esse motivo, o Gateway Endpoint para o Amazon S3 é indispensável para o funcionamento da arquitetura.

Além disso, o Gateway Endpoint possui custo inferior aos Interface Endpoints, contribuindo para a estratégia de redução de custos da solução.

---
</br>

### Fluxo de Comunicação

```
                                                          GitHub
                                                            │
                                                            ▼
                                                        AWS CodeBuild
                                                            │
                                                            ▼
                                                        Amazon ECR
                                                            │
                                                            ├── ecr.api
                                                            │
                                                            ├── ecr.dkr
                                                            ▼
                                                        Amazon S3 (Layers)
                                                            │
                                                            ▼
                                                        EC2 Privada
```

Gerenciamento das instâncias:

```
                                                         Administrador
                                                               │
                                                               ▼
                                                        AWS Systems Manager
                                                               │
                                                               ├── ssm
                                                               ├── ssmmessages
                                                               └── ec2messages
                                                                       │
                                                                       ▼
                                                                  EC2 Privada
```

---

### Tabela Resumo

| Endpoint          | Tipo      | Obrigatório | Finalidade                              |
| ----------------- | --------- | ----------- | --------------------------------------- |
| SSM               | Interface | Sim         | Gerenciamento remoto das instâncias     |
| SSM Messages      | Interface | Sim         | Comunicação do agente SSM               |
| EC2 Messages      | Interface | Sim         | Comunicação do agente SSM               |
| Amazon ECR API    | Interface | Sim         | Autenticação e chamadas à API do ECR    |
| Amazon ECR Docker | Interface | Sim         | Download das imagens Docker             |
| Amazon S3         | Gateway   | Sim         | Download das camadas das imagens Docker |

---

### Decisão de Arquitetura

A utilização de VPC Endpoints substitui a necessidade de um NAT Gateway na proposta **Low-Cost**, permitindo que as instâncias privadas acessem exclusivamente os serviços AWS necessários para sua operação.

Como estratégia de otimização de custos, a arquitetura não realiza o envio de logs da aplicação para o Amazon CloudWatch Logs. Dessa forma, não é necessário criar endpoints adicionais para esse serviço, reduzindo o número de Interface Endpoints e o custo operacional da solução.

Essa abordagem mantém a comunicação privada dentro da rede da AWS, melhora a postura de segurança da infraestrutura e reduz os custos recorrentes quando comparada à utilização de um NAT Gateway para acesso aos serviços AWS.