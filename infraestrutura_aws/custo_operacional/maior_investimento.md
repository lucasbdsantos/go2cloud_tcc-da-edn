# Documentação de Infraestrutura de maior valor e Previsão de Custos AWS

### Arquitetura de Maior Investimento

| Região principal | US East (N. Virginia) - us-east-1 |
| :--- | :--- |
| Estimativa de custo mensal | US\$ 122,07 |
| Fonte de precificação | AWS Pricing Calculator - Before discounts |
| Data da exportação | 29 de junho de 2026 às 19:27 (UTC-3:00) |

Objetivo do documento
Registrar a arquitetura AWS de maior investimento da plataforma Escola Tech, as premissas de provisionamento, os controles de segurança e a previsão de custos obtida na AWS Pricing Calculator. O documento descreve a configuração proposta; a cobrança real pode variar conforme o uso efetivo, impostos, créditos e descontos aplicáveis.

---

### 1. Resumo executivo
A proposta apresenta uma infraestrutura AWS voltada a uma plataforma institucional com autenticação, distribuição de conteúdo, balanceamento de carga, processamento em instâncias privadas, banco de dados Multi-AZ, entrega automatizada e controles de segurança e governança. A região selecionada é US East (N. Virginia), identificada como us-east-1. A AWS Pricing Calculator retornou um custo de US\$ 122,07 por mês (tarifa 'Before discounts'), resultando em um valor anual de referência de US\$ 1.464,87. Os componentes com maior peso financeiro são o NAT Gateway, o Amazon RDS Multi-AZ, a camada de aplicação (EC2, EBS e ALB) e os serviços de proteção de borda (CloudFront, AWS WAF e Route 53).

---

### 2. Escopo e premissas

| Elemento | Premissa utilizada na estimativa |
| :--- | :--- |
| Região | US East (N. Virginia) - us-east-1 |
| Usuários e tráfego | 50 GB/mês entregues pelo CloudFront na América do Sul e 260.000 requisições HTTPS/mês |
| Camada de aplicação | 2 Instâncias EC2 t3.micro Linux em execução contínua: 1.460 horas/mês no total |
| Armazenamento EC2 | 40 GB-Mo de EBS gp3: 20 GB por instância |
| Banco de dados | Amazon RDS PostgreSQL db.t3.micro Multi-AZ, 730 horas/mês e 20 GB de armazenamento gp3 |
| NAT Gateway | 1 NAT Gateway por 730 horas/mês; dados processados não incluídos como linha na exportação |
| Monitoramento | 5 GB de logs ingeridos, 0,75 GB-Mo armazenados, 1 GB analisado no Logs Insights e 3 alarmes |
| Segurança | 1 Web ACL, 2 regras WAF, GuardDuty fundamental, AWS Config, 2 segredos e 500 MAUs no Cognito |
| CI/CD | 50 minutos/mês de CodeBuild Linux small e 2 GB-Mo no ECR |

---

### 3. Arquitetura da solução
O fluxo de acesso parte do DNS e do CloudFront, passa pelo WAF e pelo Application Load Balancer e segue para instâncias EC2 em sub-redes privadas. O banco RDS PostgreSQL opera em Multi-AZ em sub-redes privadas de dados.

> Observação de implementação: A rota pública deve ser configurada como 0.0.0.0/0 para o Internet Gateway e, nas sub-redes privadas, a rota de saída deve apontar para o NAT Gateway. O Security Group da aplicação deve receber tráfego apenas do ALB, e o acesso ao RDS na porta 5432 deve ser restrito ao Security Group da aplicação.

---

## 4. Provisionamento por camada

### 4.1 Camada de acesso e distribuição
- Amazon Route 53: Uma hosted zone pública para o domínio com registro Alias para o CloudFront.
- Amazon CloudFront: Entrega de conteúdo para América do Sul, com o ALB como origem.
- AWS WAF: Uma Web ACL com duas regras para proteção de requisições.
- AWS Shield Standard: Proteção básica contra DDoS inclusa sem custo direto.
- AWS Certificate Manager: Certificado TLS para conexões HTTPS.

### 4.2 Rede e conectividade
A VPC (10.0.0.0/16) é dividida em sub-redes públicas e privadas distribuídas em duas Availability Zones.

| Sub-rede | CIDR | Finalidade |
| :--- | :--- | :--- |
| Public Subnet AZ A | 10.0.1.0/24 | ALB e conectividade pública |
| Public Subnet AZ B | 10.0.2.0/24 | ALB em segunda AZ |
| Private App AZ A | 10.0.10.0/24 | EC2 / Auto Scaling Group |
| Private App AZ B | 10.0.11.0/24 | EC2 / Auto Scaling Group |
| Private DB AZ A | 10.0.20.0/24 | RDS PostgreSQL Multi-AZ |
| Private DB AZ B | 10.0.21.0/24 | RDS PostgreSQL Multi-AZ |

O uso de um único NAT Gateway reduz custos, mas cria dependência de uma única AZ para saída de internet.

### 4.3 Aplicação e escalabilidade
- Application Load Balancer: Atende tráfego HTTP/HTTPS e encaminha para o Target Group.
- Auto Scaling Group: Mantém instâncias EC2 em duas AZs e permite a reposição de instâncias não saudáveis.
- EC2: Duas instâncias Linux t3.micro com 20 GB de EBS gp3 cada.

### 4.4 Dados, armazenamento e entrega
- Amazon RDS PostgreSQL: Instância db.t3.micro em configuração Multi-AZ.
- Amazon S3: 10 GB-Mo para objetos, com 1.000 requisições de gravação e 10.000 de leitura.
- Amazon ECR: 2 GB-Mo para imagens Docker.
- AWS CodeBuild: 50 minutos mensais para build e validações.

### 4.5 Implantação e administração
O fluxo utiliza GitHub, CodeBuild e ECR. O AWS Systems Manager é usado para administração remota das instâncias privadas.

---

## 5. Segurança, monitoramento e governança

### 5.1 Identidade e segredos
- Amazon Cognito: 500 usuários ativos mensais (MAUs) para autenticação.
- AWS Secrets Manager: Dois segredos com aproximadamente 2.000 chamadas de API mensais.
- IAM: Aplicação do princípio de menor privilégio.

### 5.2 Monitoramento e alertas
- CloudWatch Logs: 5 GB ingeridos e 0,75 GB-Mo armazenados.
- Logs Insights: 1 GB de dados analisados mensalmente.
- CloudWatch Alarms: Três alarmes padrão para CPU, ALB e banco de dados.
- Amazon SNS: 100 notificações por e-mail (custo zero na estimativa).

### 5.3 Detecção e conformidade
- Amazon GuardDuty: Análise de eventos do CloudTrail, VPC Flow Logs e consultas DNS.
- AWS Config: 50 itens de configuração e 30 avaliações de regras por mês.
- AWS CloudTrail: Auditoria de eventos de gerenciamento sem custo separado na estimativa.

---

## 6. Metodologia e previsão de custos

| Camada | Custo mensal estimado | Participação aproximada |
| :--- | :--- | :--- |
| Aplicação | US\$ 35,32 | 28,9% |
| Rede privada | US\$ 32,85 | 26,9% |
| Dados e armazenamento | US\$ 31,12 | 25,5% |
| Acesso e proteção de borda | US\$ 13,73 | 11,2% |
| Segurança, governança e observabilidade | US\$ 8,61 | 7,1% |
| Entrega da aplicação | US\$ 0,45 | 0,4% |

### 6.1 Detalhamento das linhas da AWS Pricing Calculator

| Serviço / Item | Uso mensal | Custo (USD) |
| :--- | :--- | :--- |
| NAT Gateway em operação | 730 Hrs | US\$ 32,85 |
| RDS PostgreSQL Multi-AZ | 730 Hrs | US\$ 26,28 |
| Application Load Balancer | 730 Hrs | US\$ 16,43 |
| EC2 t3.micro Linux | 1460 Hrs | US\$ 15,18 |
| CloudFront - transferência (América do Sul) | 50 GB | US\$ 5,50 |
| AWS WAF - Web ACL | 1 Month | US\$ 5,00 |
| Armazenamento RDS gp3 Multi-AZ | 20 GB-Mo | US\$ 4,60 |
| EBS gp3 | 40 GB-Mo | US\$ 3,20 |
| Amazon Cognito User Pls | 500 MAUs | US\$ 2,75 |
| CloudWatch Logs - ingestão | 5 GB | US\$ 2,50 |
| AWS WAF - regras/grupos | 2 Month | US\$ 2,00 |
| GuardDuty - VPC/DNS analisados | 2 GB | US\$ 2,00 |
| Secrets Manager - segredos | 2 Secrets | US\$ 0,80 |
| CloudFront - requisições HTTPS | 260.000 Requests | US\$ 0,57 |
| Route 53 - Hosted Zone | 1 HostedZone | US\$ 0,50 |
| ALB - LCU | 51.1 LCU-Hrs | US\$ 0,41 |
| CloudWatch - alarmes | 3 Alarms | US\$ 0,30 |
| CodeBuild Linux small | 50 minutes | US\$ 0,25 |
| S3 Standard - armazenamento | 10 GB-Mo | US\$ 0,23 |
| ECR - armazenamento | 2 GB-Mo | US\$ 0,20 |
| AWS WAF - requisições | 260.000 Request | US\$ 0,16 |
| AWS Config - itens contínuos | 50 ConfigurationItem | US\$ 0,15 |
| Transferência regional | 10 GB | US\$ 0,10 |
| GuardDuty - eventos CloudTrail | 10.000 Events | US\$ 0,04 |
| AWS Config - avaliações | 30 Evaluations | US\$ 0,03 |
| CloudWatch Logs - armazenamento | 0.75 GB-Mo | US\$ 0,02 |
| Outros (S3/Secrets/Logs Insights) | Diversos | ~US\$ 0,03 |

---

### 7. Análise de custo e pontos de atenção
- NAT Gateway: Custo de US\$ 32,85/mês com dependência de uma AZ. Recomenda-se avaliar NAT por AZ se a resiliência de saída for crítica.
- RDS Multi-AZ: Melhora o failover, mas aumenta o custo.
- CloudFront + WAF: Adicionam segurança e melhoram a distribuição, custando aproximadamente US\$ 13,23/mês.
- Cognito: Custo de US\$ 2,75 para 500 MAUs; validar se a aplicação utilizará este serviço.

---

### 8. Itens sem custo direto separado na estimativa
- Internet Gateway, Security Groups, Auto Scaling (cobrança pelas EC2), AWS Systems Manager, AWS Certificate Manager, AWS Shield Standard e AWS CloudTrail.

---

### 9. Referências
1. Exportação AWS Pricing Calculator: EscolaTech-MaiorInvestimento-us-east-1, 29 de junho de 2026.
2. Documentação oficial AWS para VPC, CloudFront, WAF, Config, GuardDuty, Route 53 e Secrets Manager.

---

### Informações Complementares
- ID da Estimativa: 99cb6e6b-cda6-4745-944d-e6fcd4a27064.
- ID da Conta AWS Relacionada: 409852989473.
- Data de Expiração da Estimativa: 29 de julho de 2027 às 18:05 (UTC-3:00).
- Status da Estimativa: VALID.
- Moeda: USD.