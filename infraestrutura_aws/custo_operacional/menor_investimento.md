# Documentação da Infraestrutura de menor valor e Previsão de Custos

## Escola Tech | Site institucional e página de matrículas
**Cenário de baixo custo - US East (N. Virginia) / us-east-1**

**Custo mensal projetado:** US\$ 86,82  
**Custo anual projetado:** US\$ 1.041,80  
*Estimativa mensal antes de descontos, impostos e créditos baseada na AWS Pricing Calculator exportada em 29/06/2026.*

### Metadados da Estimativa (JSON)
- **ID da Estimativa:** `b64697d1-4b5c-4366-bc50-80386303737d`
- **Nome:** `EscolaTech-BaixoCusto-InstanceRefresh-us-east-1`
- **Data de Criação:** 29 de junho de 2026 às 11:14 (UTC-3:00)
- **Data de Exportação:** 29 de junho de 2026 às 17:17 (UTC-3:00)
- **Expira em:** 29 de julho de 2027 às 11:14 (UTC-3:00)
- **Status:** VALID

---

## 1. Resumo Executivo
A Escola Tech necessita hospedar um site institucional com página de matrículas capaz de atender tráfego contínuo e absorver picos de acesso durante campanhas. A solução utiliza balanceamento de carga, Auto Scaling, banco de dados gerenciado em Multi-AZ, armazenamento de arquivos e deploy automatizado via Docker. 

A estimativa reflete a capacidade-base contínua da aplicação utilizando preços públicos sob demanda. Itens externos como domínio, Cloudflare e impostos não estão incluídos.

---

## 2. Visão Geral da Arquitetura
O tráfego passa por uma camada de DNS/CDN, chega ao **Application Load Balancer (ALB)** e é distribuído entre instâncias **EC2** em duas Availability Zones (sub-redes privadas). O banco de dados **RDS PostgreSQL** opera em rede privada e o deploy utiliza imagens do **Amazon ECR**.

### 2.1 Objetivos Atendidos
| Objetivo | Implementação |
| :--- | :--- |
| **Disponibilidade** | ALB em duas AZs; EC2 em AZs distintas; RDS Multi-AZ. |
| **Escalabilidade** | Auto Scaling Group (ASG) para capacidade-base e picos. |
| **Segurança** | EC2 e RDS em sub-redes privadas; Security Groups segmentados. |
| **Atualização** | CodeBuild gera imagem; ECR armazena versões; Instance Refresh substitui instâncias. |
| **Controle de Custo** | Sem NAT Gateway; endpoints de interface ECR em uma única AZ; endpoint Gateway para S3. |

### 2.2 Região e Localização dos Dados
A região selecionada é **US East (N. Virginia) - us-east-1**. O uso de infraestrutura nos EUA para dados pessoais de alunos caracteriza transferência internacional de dados, exigindo avaliação sob a LGPD.

---

## 3. Provisionamento dos Recursos

### 3.1 Rede e Segmentação
- **VPC:** Sub-redes públicas para o ALB e privadas para EC2 e RDS.
- **Disponibilidade:** ALB em pelo menos duas sub-redes públicas; EC2 e RDS distribuídos entre AZ A e AZ B.
- **NAT:** Não haverá NAT Gateway no cenário de baixo custo.

### 3.2 Security Groups
| Security Group | Regra Principal | Finalidade |
| :--- | :--- | :--- |
| **sg-alb** | Entrada HTTPS 443 (Internet/Cloudflare); saída para sg-app. | Camada pública de entrada. |
| **sg-app** | Entrada do sg-alb; saída para sg-rds (5432) e endpoints privados. | Proteção das instâncias EC2. |
| **sg-rds** | Entrada 5432 somente do sg-app. | Impede acesso público ao banco. |
| **sg-vpce-ecr** | Entrada HTTPS 443 somente do sg-app. | Restringe interfaces de ECR. |

### 3.3 Camada de Aplicação e Auto Scaling
A estimativa considera **duas instâncias t3.micro** (1.460 horas/mês) como capacidade-base. 
> **Limitação:** Custos de escala acima de duas instâncias não estão incluídos no valor mensal, pois dependem da duração dos picos.

### 3.4 Banco de Dados e Armazenamento
- **Amazon RDS PostgreSQL:** `db.t3.micro` Multi-AZ, 20 GB gp3.
- **Amazon S3 Standard:** 10 GB de armazenamento médio; 1.000 escritas e 10.000 leituras mensais.
- **EBS:** 20 GB gp3 por instância EC2 (40 GB total).

---

## 4. Conectividade Privada e Baixo Custo
A redução de custos é obtida substituindo o Systems Manager por **Launch Template** e **Auto Scaling Instance Refresh**. As instâncias novas executam user data para pull da imagem privada via endpoints.

| Tipo | Serviço | Uso | Tratamento |
| :--- | :--- | :--- | :--- |
| **Interface endpoint** | `ecr.api` | Chamadas da API do ECR. | Pago. |
| **Interface endpoint** | `ecr.dkr` | Pull de imagens Docker. | Pago. |
| **Gateway endpoint** | `s3` | Acesso privado a camadas de imagens no S3. | Gratuito. |

> **Trade-off:** Manter endpoints em apenas uma AZ reduz custos, mas gera dependência dessa zona para novos pulls de imagem.

---

## 5. Fluxo de Entrega e Atualização
1. **Código:** Enviado ao GitHub.
2. **Build:** AWS CodeBuild gera imagem Docker.
3. **Registro:** Imagem publicada no Amazon ECR.
4. **Template:** Nova imagem referenciada no Launch Template.
5. **Refresh:** Instance Refresh substitui as instâncias gradualmente.
6. **Validação:** Health checks do ALB validam o tráfego.

---

## 6. Autenticação, Monitoramento e Segredos
- **Autenticação:** Tratada internamente pela aplicação (sem Amazon Cognito).
- **Monitoramento:** Métricas nativas do CloudWatch para EC2, ALB e ASG. Logs centralizados e alarmes estão fora do escopo inicial.
- **Segredos:** 2 segredos no **AWS Secrets Manager** com 2.000 chamadas mensais. 
> **Atenção:** Sem NAT ou endpoint específico para Secrets Manager, deve-se validar como as instâncias privadas acessarão o serviço.

---

## 7. Previsão de Custos Detalhada

### 7.1 Resumo por Categoria
| Categoria | Premissa | Custo Mensal | Participação |
| :--- | :--- | :--- | :--- |
| **Banco de Dados** | RDS PostgreSQL Multi-AZ + 20 GB gp3 | US\$ 30,88 | 35,6% |
| **Computação** | 2 EC2 t3.micro + 40 GB EBS gp3 | US\$ 18,38 | 21,2% |
| **Balanceamento** | 1 ALB (730h) + 51,1 LCU-h | US\$ 16,83 | 19,4% |
| **Rede Privada** | 2 Interface Endpoints ECR + 2 GB proc. | US\$ 14,62 | 16,8% |
| **Transferência** | 50 GB Internet + 10 GB Regional | US\$ 4,60 | 5,3% |
| **Segurança** | 2 segredos + 2.000 chamadas API | US\$ 0,81 | 0,9% |
| **Entrega** | ECR 2 GB + CodeBuild 50 min | US\$ 0,45 | 0,5% |
| **Armazenamento** | S3 Standard 10 GB + requisições | US\$ 0,24 | 0,3% |
| **Total Mensal** | **Estimativa Calculada** | **US\$ 86,82** | **100,0%** |

### 7.2 Linhas de Uso (Dados Estruturados JSON)
| Serviço | Grupo | Tipo de Uso | Quantidade | Custo (USD) | ID de Uso (JSON) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **RDS** | CamadaDeDados | Multi-AZ db.t3.micro | 730 Hrs | 26,28 | `21639d72-2881-4b6d-9a68-0510db9002d1` |
| **RDS** | CamadaDeDados | Multi-AZ-GP3-Storage | 20 GB | 4,60 | `17d95899-a726-4987-ab1d-cc911d72afd0` |
| **EC2** | CamadaDeAplicacao | BoxUsage:t3.micro | 1460 Hrs | 15,184 | `98445b5d-5db0-4f8e-a574-73134d721db8` |
| **EBS** | CamadaDeAplicacao | EBS:VolumeUsage.gp3 | 40 GB-Mo | 3,20 | `a881807a-d805-41d3-943a-41dc3608f65d` |
| **ELB** | CamadaDeAplicacao | LoadBalancerUsage | 730 Hrs | 16,425 | `a5fddc1a-26fa-4370-b621-143268d0f40a` |
| **ELB** | CamadaDeAplicacao | LCUUsage | 51,1 LCU-Hrs | 0,4088 | `485f58be-4f97-4e69-90c7-04301b551ab1` |
| **VPC** | CamadaDeRedePrivada | VpcEndpoint-Hours | 1460 Hrs | 14,60 | `69faaefc-eab4-4276-b8e9-c3e1c809e56e` |
| **VPC** | CamadaDeRedePrivada | VpcEndpoint-Bytes | 2 GB | 0,02 | `0e45aa87-ce91-4b8a-adfa-44d5da2f53f1` |
| **Data Transfer**| CamadaDeAplicacao | Out-Bytes (Internet) | 50 GB | 4,50 | `9d6d69c6-c4ed-44ce-8b2f-4e62f7910f0e` |
| **Data Transfer**| CamadaDeAplicacao | Regional-Bytes | 10 GB | 0,10 | `ed6d1ab5-1117-40c2-a400-c9cb3e08e5d5` |
| **Secrets Mgr** | CamadaDeSeguranca | Secrets | 2 Secrets | 0,80 | `331ca08b-53f7-48d4-8476-587a5d986cdf` |
| **Secrets Mgr** | CamadaDeSeguranca | APIRequest | 2000 API | 0,01 | `e80b5a6b-9179-47d0-a17d-2b5d5d8a98d6` |
| **CodeBuild** | CamadaDeEntrega | Linux:g1.small | 50 min | 0,25 | `47c1aa3f-e060-4349-bcce-efa5339a296b` |
| **ECR** | CamadaDeEntrega | TimedStorage-ByteHrs | 2 GB | 0,20 | `8e5fa59e-ea35-4dcc-9734-619bbbf8710f` |
| **S3** | CamadaDeArmazenamento| TimedStorage-ByteHrs | 10 GB | 0,23 | `6406a8ea-b2cd-4d04-8354-80499be6410e` |
| **S3** | CamadaDeArmazenamento| Requests-Tier1 | 1000 Req | 0,005 | `5a2acac8-a56b-42b4-bee2-5017b6c97ed6` |
| **S3** | CamadaDeArmazenamento| Requests-Tier2 | 10000 Req | 0,004 | `26c221e4-038d-4504-90b7-e4ca9fe122f6` |

---

### Informações Complementares
- **ID da Conta AWS associada à estimativa:** `409852989473`.
- **Tipo de Tarifa:** `BEFORE_DISCOUNTS` (Preços públicos).
- **Moeda:** USD.