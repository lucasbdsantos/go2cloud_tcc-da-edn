# Grupos do Auto Scaling

### Visão Geral

O **Auto Scaling Group (ASG)** é o serviço responsável pela elasticidade da arquitetura, ou seja, ele vai garantir que a aplicação mantenha a quantidade adequada de instâncias EC2 em execução, proporcionando **alta disponibilidade**, **recuperação automática de falhas** e **escalabilidade horizontal** conforme a demanda de utilização da infraestrutura.

Nas duas propostas arquiteturais deste projeto, o Auto Scaling Group utiliza um **Launch Template** previamente configurado para provisionar automaticamente novas instâncias sempre que necessário, distribuindo-as entre duas Zonas de Disponibilidade (Availability Zones) da mesma região da AWS.

Além do provisionamento automático, o ASG monitora continuamente a saúde das instâncias através de verificações realizadas pelo Amazon EC2 e pelo Application Load Balancer (ALB), substituindo automaticamente recursos que apresentem falhas.

---

### Objetivos

O Auto Scaling Group foi adotado para atender aos seguintes objetivos:

* Garantir alta disponibilidade da aplicação;
* Distribuir instâncias entre múltiplas Availability Zones;
* Substituir automaticamente instâncias com falha;
* Escalar horizontalmente conforme a utilização da CPU;
* Reduzir intervenção manual na operação da infraestrutura;
* Integrar automaticamente novas instâncias ao Load Balancer;
* Enviar eventos operacionais para monitoramento via Amazon SNS.

---
</br>

### Arquitetura da Solução

Embora as duas propostas apresentem diferenças na infraestrutura de rede e conectividade, ambas utilizam exatamente a mesma estratégia para gerenciamento automático das instâncias EC2.

#### 1. Proposta Low-Cost

Nesta proposta, o Auto Scaling Group distribui as instâncias entre duas subnets privadas localizadas em diferentes Availability Zones.

Características:

* Launch Template compartilhado
* Desired Capacity igual a 1
* Escalabilidade até 4 instâncias
* Recuperação automática em caso de falha
* Integração com Application Load Balancer
* Health Checks do ALB e EC2
* Monitoramento via SNS


#### 2. Proposta Maior Investimento

Na proposta de maior investimento, o funcionamento do Auto Scaling Group permanece o mesmo.

A principal diferença está na infraestrutura ao redor do ASG, composta por componentes altamente redundantes, como NAT Gateway dedicado, CloudFront e maior disponibilidade dos serviços de rede.

O comportamento do Auto Scaling Group continua responsável por:

* Provisionamento automático
* Escalabilidade horizontal
* Recuperação automática
* Balanceamento entre Availability Zones
* Integração com ALB

---
</br>

### Configuração do Auto Scaling Group

#### 1. Identificação

| Configuração     | Valor                |
| ---------------- | -------------------- |
| Nome             | asgprodsite          |
| Launch Template  | lt_prod_site         |
| Estratégia       | Balanced Best Effort |
| Desired Capacity | 1                    |
| Minimum Capacity | 1                    |
| Maximum Capacity | 4                    |

---

#### 2. Rede

| Configuração     | Valor                   |
| ---------------- | ----------------------- |
| VPC              | vpc_prod                |
| Security Group   | sg_prod_app             |
| Key Pair         | Não configurado         |
| Subnet Privada A | snet_prod_app_private_a |
| Subnet Privada B | snet_prod_app_private_b |

As instâncias são distribuídas automaticamente entre duas Availability Zones, garantindo maior disponibilidade da aplicação.

---

#### 3. Integração com o Load Balancer

| Configuração     | Valor                   |
| ---------------- | ----------------------- |
| Load Balancer    | alb_prod_site           |
| Health Check     | ELB Health Check        |
| EC2 Health Check | Amazon EBS Health Check |
| Grace Period     | 300 segundos            |

O período de Grace Period permite que uma nova instância seja totalmente inicializada antes de ser considerada disponível para receber tráfego.

---

#### 4. Política de Escalabilidade

Foi utilizada a política **Target Tracking Scaling Policy**, permitindo que o Auto Scaling Group monitore continuamente a utilização média de CPU das instâncias.

| Configuração    | Valor                   |
| --------------- | ----------------------- |
| Tipo            | Target Tracking         |
| Métrica         | Utilização média de CPU |
| Target Value    | 90%                     |
| Instance Warmup | 300 segundos            |

Quando a utilização média da CPU ultrapassa o valor definido, novas instâncias são automaticamente provisionadas.

Da mesma forma, quando a carga diminui, instâncias excedentes podem ser removidas automaticamente, respeitando os limites mínimos configurados.

---

#### 5. Estratégia de Atualização

O Auto Scaling Group foi configurado utilizando a estratégia:

**Launch Before Terminate**

Essa configuração garante que uma nova instância seja criada, inicializada e validada antes da remoção da instância anterior.

Essa abordagem reduz significativamente o risco de indisponibilidade durante substituições automáticas.

---

#### 6. Percentual de Instâncias Saudáveis

| Configuração    | Valor |
| --------------- | ----- |
| Healthy Minimum | 100%  |
| Healthy Maximum | 110%  |

Durante substituições automáticas, o ASG pode provisionar temporariamente uma instância adicional para garantir que sempre exista capacidade disponível durante o processo.

---

### Fluxo de Funcionamento

#### 1. Provisionamento Inicial

```text
                                                 Launch Template
                                                        │
                                                        ▼
                                                 Auto Scaling Group
                                                        │
                                                        ▼
                                                 Desired Capacity = 1
                                                        │
                                                        ▼
                                                 Provisiona uma instância EC2
                                                        │
                                                        ▼
                                                 Executa User Data
                                                        │
                                                        ▼
                                          Realiza autenticação no Amazon ECR
                                                        │
                                                        ▼
                                                 Baixa imagens Docker
                                                        │
                                                        ▼
                                             Inicializa os containers
                                                        │
                                                        ▼
                                             ALB executa Health Check
                                                        │
                                                        ▼
                                     Instância adicionada ao Target Group
                                                        │
                                                        ▼
                                   Aplicação disponível para receber tráfego
```

---

#### 2. Monitoramento Contínuo

Após o provisionamento inicial, o Auto Scaling Group monitora continuamente o ambiente.

```text
                                                 Instâncias EC2
                                                        │
                                                        ▼
                                          CloudWatch monitora utilização
                                                        │
                                                        ▼
                                                     CPU média
                                                        │
                                                        ▼
                                             Target Tracking Policy
                                                        │
                                                        ▼
                                     Avalia necessidade de escalabilidade
```

---

#### 3. Escalabilidade Horizontal

Quando ocorre aumento de carga:

```text
                                                    CPU > 90%
                                                        │
                                                        ▼
                                             Target Tracking Policy
                                                        │
                                                        ▼
                                                 Auto Scaling Group
                                                        │
                                                        ▼
                                            Provisiona nova instância
                                                        │
                                                        ▼
                                                 Launch Template
                                                        │
                                                        ▼
                                                 Executa User Data
                                                        │
                                                        ▼
                                                 Baixa imagens Docker
                                                        │
                                                        ▼
                                                 Containers iniciados
                                                        │
                                                        ▼
                                                   Health Check
                                                        │
                                                        ▼
                                          Adiciona nova instância ao ALB
```

O processo ocorre automaticamente, sem necessidade de intervenção administrativa.

---

#### 4. Recuperação Automática de Falhas

Caso uma instância apresente problemas:

```text
                                          Instância apresenta falha
                                                        │
                                                        ▼
                                          Health Check detecta problema
                                                        │
                                                        ▼
                                       ASG marca instância como Unhealthy
                                                        │
                                                        ▼
                                             Launch Before Terminate
                                                        │
                                                        ▼
                                             Nova instância criada
                                                        │
                                                        ▼
                                                 Executa User Data
                                                        │
                                                        ▼
                                              Health Check aprovado
                                                        │
                                                        ▼
                                          Nova instância recebe tráfego
                                                        │
                                                        ▼
                                          Instância antiga removida
```

Essa estratégia reduz significativamente o tempo de indisponibilidade da aplicação.

---

#### 5. Fluxo Completo do Auto Scaling Group

```text
                                             Launch Template
                                                    │
                                                    ▼
                                            Auto Scaling Group
                                                    │
                                                    ▼
                                              Provisiona EC2
                                                    │
                                                    ▼
                                             Executa User Data
                                                    │
                                                    ▼
                                            Login no Amazon ECR
                                                    │
                                                    ▼
                                            Download das imagens
                                                    │
                                                    ▼
                                      Inicialização dos Containers
                                                    │
                                                    ▼
                                          Application Load Balancer
                                                    │
                                                    ▼
                                            Health Check (ALB)
                                                    │
                                                    ▼
                                          Target Group recebe EC2
                                                    │
                                                    ▼
                                           Aplicação disponível
                                                    │
                                                    ▼
                                          CloudWatch monitora CPU
                                                    │
                                                    ▼
                                               CPU > 90% ?
                                              ┌─────┴──────────┐
                                              │                │
                                              │                │
                                              │                │
                                             Não              Sim
                                              │                │
                                              ▼                ▼
                                       Mantém estado       Nova EC2
                                                               │
                                                               ▼
                                                         Executa User Data
                                                               │
                                                               ▼
                                                         Health Check
                                                               │
                                                               ▼
                                                     Adiciona ao Target Group
                                                               │
                                                               ▼
                                                    Remove instância antiga
                                                    (Launch Before Terminate)
``` 

---
</br>

### Eventos Monitorados

Todas as alterações realizadas pelo Auto Scaling Group geram notificações para o tópico SNS **monitoramentosite**.

Eventos monitorados:

| Evento                     | Finalidade                      |
| -------------------------- | ------------------------------- |
| Launch                     | Nova instância criada           |
| Terminate                  | Instância removida              |
| Replace                    | Substituição automática         |
| Root Volume Replace        | Troca do volume principal       |
| Failed Launch              | Falha ao criar instância        |
| Failed Terminate           | Falha ao remover instância      |
| Failed Root Volume Replace | Falha na substituição do volume |

Essas notificações permitem acompanhar em tempo real o comportamento do Auto Scaling Group.

---

### Benefícios da Configuração

#### 1. Proposta Low-Cost

* Escalabilidade automática conforme demanda.
* Alta disponibilidade utilizando duas Availability Zones.
* Recuperação automática sem intervenção manual.
* Baixo custo operacional mantendo apenas uma instância quando a carga é reduzida.
* Crescimento automático até quatro instâncias.

</br>

#### 2. Proposta Maior Investimento

* Mesmo mecanismo automático de escalabilidade.
* Integração com uma infraestrutura de rede mais resiliente.
* Maior disponibilidade dos serviços complementares.
* Maior capacidade para suportar cargas elevadas.
* Continuidade operacional mesmo durante falhas de infraestrutura.

---
</br>

### Considerações Técnicas

A utilização do Auto Scaling Group permite que a infraestrutura mantenha um comportamento dinâmico, adaptando automaticamente a quantidade de instâncias EC2 de acordo com a carga de trabalho.

A combinação entre **Launch Template**, **Target Tracking Scaling Policy**, **Application Load Balancer**, **Health Checks**, **Launch Before Terminate** e **Amazon SNS** proporciona uma solução altamente resiliente, reduzindo indisponibilidades, automatizando processos operacionais e aumentando a confiabilidade da arquitetura proposta.

Essa configuração representa uma das principais características de arquiteturas modernas em ambientes de computação em nuvem, permitindo que a aplicação responda automaticamente a variações de demanda e falhas de infraestrutura sem necessidade de intervenção manual.
