# Amazon EC2

### Visão Geral

As instâncias **Amazon EC2 (Elastic Compute Cloud)** representam a camada de computação da infraestrutura, sendo responsáveis pela execução da aplicação containerizada nas duas propostas arquiteturais do projeto: **Low-Cost** e **Maior Investimento**.

Todas as instâncias são provisionadas a partir de uma **Amazon Machine Image (AMI)** previamente preparada, contendo o sistema operacional, Docker, AWS CLI e demais dependências necessárias para execução da aplicação. Dessa forma, o processo de inicialização torna-se mais rápido, padronizado e previsível.

Após o provisionamento, um script **User Data** é executado automaticamente para realizar a atualização da aplicação através do Amazon ECR.

---

### Papel da EC2 na Arquitetura

As instâncias EC2 possuem as seguintes responsabilidades:

- Executar a aplicação containerizada.
- Receber requisições encaminhadas pelo Application Load Balancer.
- Obter as imagens Docker armazenadas no Amazon ECR.
- Executar os containers da aplicação.
- Integrar-se ao Auto Scaling Group para substituição e escalabilidade automática.
- Operar em sub-redes privadas, sem exposição direta à Internet.

---

### Configuração das Instâncias

Para ambas as arquiteturas, as instâncias utilizam a seguinte configuração base:

| Recurso | Configuração |
|---------|--------------|
| Tipo da Instância | t3.micro |
| vCPUs | 2 |
| Memória RAM | 1 GB |
| Volume Amazon EBS | 8 GB |
| Tipo do Volume | General Purpose SSD (gp3) |
| Sistema Operacional | Linux |
| Provisionamento | Launch Template |
| Inicialização | Amazon Machine Image (AMI) personalizada |

O armazenamento utiliza um volume **Amazon EBS gp3** de **8 GB**, escolhido por oferecer uma excelente relação entre desempenho e custo para cargas de trabalho de propósito geral. Como toda a aplicação é executada em containers Docker e a AMI já contém o ambiente previamente configurado, essa capacidade é suficiente para armazenar o sistema operacional, dependências e imagens da aplicação, mantendo o custo da infraestrutura reduzido.

---

### Amazon Machine Image (AMI)

As instâncias não são configuradas durante o boot.

Todo o ambiente necessário já está incorporado na AMI personalizada, incluindo:

- Docker instalado;
- AWS CLI instalada;
- Configurações básicas do sistema operacional;
- Dependências da aplicação;
- Ajustes de segurança e inicialização.

Essa estratégia reduz significativamente o tempo necessário para disponibilizar uma nova instância durante eventos de Auto Scaling.

---

### User Data

Como o ambiente já está preparado na AMI, o **User Data** possui apenas a responsabilidade de atualizar e iniciar a aplicação.

Durante a inicialização da instância ocorre o seguinte fluxo:

1. Execução automática do User Data.
2. Autenticação no Amazon ECR utilizando a IAM Role da instância.
3. Download (pull) da imagem Docker mais recente.
4. Inicialização do container da aplicação.

Essa abordagem permite que novas versões da aplicação sejam distribuídas automaticamente sempre que uma nova instância for criada.

---

### Fluxo de Inicialização

O processo completo de provisionamento ocorre conforme o fluxo abaixo:

```text
                                                Auto Scaling Group
                                                        │
                                                        ▼
                                                 Launch Template
                                                        │
                                                        ▼
                                             Criação da Instância EC2
                                                        │
                                                        ▼
                                        Inicialização da AMI Personalizada
                                                        │
                                                        ▼
                                                Execução do User Data
                                                        │
                                                        ▼
                                                Autenticação no Amazon ECR
                                                        │
                                                        ▼
                                                Docker Pull da Imagem
                                                        │
                                                        ▼
                                           Inicialização do Container
                                                        │
                                                        ▼
                                  Health Check do Application Load Balancer
                                                        │
                                                        ▼
                                    Instância disponível para receber tráfego
```

---

### Integração com o Amazon ECR

A aplicação é distribuída através do **Amazon Elastic Container Registry (ECR)**.

As instâncias utilizam uma **IAM Role** para autenticação, eliminando a necessidade de armazenar credenciais na máquina.

O fluxo ocorre da seguinte forma:

```text
                                                 Amazon ECR
                                                      │
                                                      ▼
                                                Docker Pull
                                                      │
                                                      ▼
                                                Imagem Docker
                                                      │
                                                      ▼
                                            Container em Execução
```

Sempre que uma nova instância é criada, a versão mais recente da aplicação é obtida automaticamente.

---

### Integração com o Application Load Balancer

As instâncias EC2 ficam registradas em um **Target Group** associado ao **Application Load Balancer (ALB)**.

O ALB é responsável por:

- distribuir as requisições entre as instâncias disponíveis;
- executar Health Checks periódicos;
- remover automaticamente instâncias consideradas indisponíveis;
- encaminhar tráfego apenas para instâncias saudáveis.

As instâncias não recebem conexões diretamente da Internet.

---

### Integração com o Auto Scaling Group

As instâncias são gerenciadas por um **Auto Scaling Group (ASG)**.

O ASG é responsável por:

- criar novas instâncias automaticamente;
- substituir instâncias com falha;
- manter a quantidade mínima de servidores configurada;
- distribuir instâncias entre diferentes Zonas de Disponibilidade, quando aplicável.

Essa integração garante maior disponibilidade da aplicação sem necessidade de intervenção manual.

---

### Segurança

As instâncias seguem os princípios de menor privilégio e isolamento da infraestrutura.

Características adotadas:

- execução em sub-redes privadas;
- ausência de endereço IP público;
- acesso permitido apenas pelo Application Load Balancer;
- autenticação no Amazon ECR através de IAM Role;
- Security Groups restringindo o tráfego às portas necessárias.

Essa configuração reduz significativamente a superfície de ataque da infraestrutura.

---

### Utilização nas Arquiteturas

#### 1. Proposta Low-Cost

Na arquitetura **Low-Cost**, as instâncias EC2 executam a aplicação utilizando recursos mínimos, priorizando a redução dos custos operacionais.

A escalabilidade ocorre automaticamente através do Auto Scaling Group, mantendo apenas a capacidade necessária para atender à demanda.

</br>

#### 2. Proposta Maior Investimento

Na arquitetura **Maior Investimento**, as instâncias desempenham as mesmas funções, porém inseridas em uma infraestrutura com maior nível de disponibilidade e redundância.

A utilização de múltiplas Zonas de Disponibilidade permite maior tolerância a falhas e melhor distribuição da carga de trabalho.

---

### Conclusão

As instâncias Amazon EC2 constituem a camada de processamento da aplicação, sendo responsáveis pela execução dos containers Docker e pelo atendimento das requisições encaminhadas pelo Application Load Balancer.

A utilização de uma AMI previamente configurada, aliada ao uso do Amazon ECR para distribuição das imagens Docker e ao Auto Scaling Group para gerenciamento automático das instâncias, proporciona uma infraestrutura padronizada, escalável e com menor tempo de provisionamento.