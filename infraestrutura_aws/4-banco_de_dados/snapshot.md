# Snapshot Strategy

### Visão Geral

A estratégia de **Snapshots** define a política de proteção, recuperação e retenção dos dados armazenados no banco de dados PostgreSQL da aplicação. Seu objetivo é garantir a recuperação rápida do ambiente em casos de falhas operacionais, erros humanos, atualizações mal sucedidas ou desastres, minimizando a perda de dados (RPO) e o tempo de indisponibilidade (RTO).

Neste projeto são apresentadas duas abordagens distintas, adequadas às arquiteturas propostas:

* **Proposta Low-Cost**
* **Proposta Maior Investimento**

Embora ambas utilizem os mecanismos nativos do Amazon RDS, cada estratégia foi dimensionada considerando diferentes requisitos de disponibilidade, retenção de dados e custo operacional.

---
</br>

## 1. Proposta Low-Cost

### Objetivo

A estratégia Low-Cost prioriza a redução de custos operacionais sem comprometer a capacidade de recuperação do banco de dados em situações de falha.

Essa abordagem é indicada para pequenas empresas, ambientes de desenvolvimento, homologação ou aplicações cujo volume de alterações seja relativamente baixo.

---

### Backups Automáticos

A instância do Amazon RDS possui os **Automated Backups** habilitados.

#### Configuração

| Configuração                  | Valor                        |
| ----------------------------- | ---------------------------- |
| Automated Backups             | Habilitado                   |
| Retenção                      | 7 dias                       |
| Point-in-Time Recovery (PITR) | Habilitado                   |
| Janela de Backup              | Madrugada (baixa utilização) |

Durante esse período, o Amazon RDS realiza backups automáticos do banco de dados e armazena continuamente os logs de transação, permitindo restaurar a base para praticamente qualquer instante dentro da janela de retenção.

---

### Point-in-Time Recovery (PITR)

O Point-in-Time Recovery permite restaurar o banco exatamente para um momento anterior a uma falha ou exclusão acidental de dados.

Exemplo:

```text
09:10
09:11
09:12
09:13
09:14  ← exclusão acidental
09:15

↓

Restaurar para 09:13
```

Essa funcionalidade reduz significativamente a perda de dados em caso de incidentes operacionais.

---

### Snapshots Manuais

Além dos backups automáticos, recomenda-se criar snapshots manuais antes de alterações importantes no ambiente.

Os snapshots devem ser realizados antes de:

* Atualizações da aplicação;
* Alterações no esquema do banco (DDL);
* Migrações de dados;
* Atualizações da versão do PostgreSQL;
* Alterações de parâmetros críticos do banco.

Exemplos de nomenclatura:

```text
pre-update-2026-06-29

pre-schema-change

pre-postgres-upgrade

pre-migration-v2
```

Após a validação da alteração, snapshots antigos podem ser removidos para reduzir custos de armazenamento.

---

## Política de Retenção

### Backups Automáticos

```text
7 dias
```

### Snapshots Manuais

Manter apenas os três snapshots mais recentes relacionados às principais alterações realizadas no ambiente.

Exemplo:

```text
pre-v1.1

pre-v1.2

pre-v1.3
```

---

## Processo de Recuperação

Em caso de falha operacional, recomenda-se a seguinte sequência de recuperação:

```text
                                                        Falha no Banco

                                                                │
                                                                ▼

                                        Verificar possibilidade de restauração via PITR

                                                                │
                                                                ▼

                                Restaurar para o instante imediatamente anterior ao incidente

                                                                │
                                                                ▼

                                        Caso necessário, restaurar um Snapshot Manual

                                                                │
                                                                ▼

                                                     Criar nova instância RDS

                                                                │
                                                                ▼

                                        Atualizar endpoint utilizado pela aplicação
```

---
</br>


## 2. Proposta Maior Investimento

### Objetivo

A proposta empresarial prioriza disponibilidade, conformidade, auditoria e recuperação rápida dos dados, sendo adequada para ambientes de produção com maior criticidade.

Essa estratégia amplia o período de retenção dos backups, mantém múltiplos pontos de restauração e reduz os riscos durante alterações de infraestrutura.

---

### Backups Automáticos

#### Configuração

| Configuração           | Valor      |
| ---------------------- | ---------- |
| Automated Backups      | Habilitado |
| Retenção               | 35 dias    |
| Point-in-Time Recovery | Habilitado |
| Backup Window          | Madrugada  |

Com essa configuração, o ambiente mantém um histórico significativamente maior de recuperação, permitindo restaurar dados de até 35 dias anteriores.

---

### Point-in-Time Recovery (PITR)

O PITR permanece habilitado durante todo o ciclo de vida da instância.

Exemplo:

```text
09:14:01

09:14:35

09:15:10

09:15:42

↓

Restaurar exatamente para o horário desejado
```

Essa funcionalidade oferece um RPO de poucos minutos, reduzindo significativamente perdas de dados.

---

### Estratégia de Snapshots

Além dos backups automáticos, recomenda-se uma política de snapshots periódicos.

#### 1. Snapshots Diários

| Frequência | Retenção |
| ---------- | -------- |
| Diário     | 7 dias   |

</br>

#### 2. Snapshots Semanais

| Frequência   | Retenção  |
| ------------ | --------- |
| Todo domingo | 5 semanas |

</br>

#### 3. Snapshots Mensais

| Frequência          | Retenção |
| ------------------- | -------- |
| Primeiro dia do mês | 12 meses |

</br>

#### 4. Snapshots Anuais

| Frequência | Retenção                                  |
| ---------- | ----------------------------------------- |
| Janeiro    | 5 anos (ou conforme política corporativa) |

---
</br>


### Snapshots Obrigatórios

Independentemente da rotina automática, recomenda-se criar snapshots antes de qualquer alteração crítica da infraestrutura.

Entre elas:

* Atualização da aplicação;
* Upgrade do PostgreSQL;
* Alteração da classe da instância;
* Alteração de armazenamento;
* Alteração de parâmetros do banco;
* Migração de dados;
* Mudanças estruturais no esquema do banco.

Essa prática reduz significativamente o risco de perda de dados durante atividades de manutenção.

---

### Criptografia

Todos os snapshots devem permanecer criptografados utilizando a mesma chave AWS KMS empregada pela instância do Amazon RDS.

Essa prática garante:

* Proteção dos dados em repouso;
* Conformidade com requisitos de segurança;
* Integridade durante restaurações.

---

### Recuperação de Desastres

Como estratégia complementar de continuidade de negócios, recomenda-se a cópia periódica dos snapshots para outra Região AWS.

Essa abordagem permite restaurar o ambiente mesmo em cenários de indisponibilidade regional.

Fluxo simplificado:

```text
                                                            Snapshot

                                                                │
                                                                ▼

                                                   Cópia para outra Região AWS

                                                                │
                                                                ▼

                                            Restauração em caso de desastre regional
```

---

### Política de Retenção

A política de retenção segue uma estratégia em camadas:

```text
                                                        Snapshots Diários

                                                                │
                                                                ▼

                                                             7 dias

                                                                │
                                                                ▼

                                                        Snapshots Semanais

                                                                │
                                                                ▼

                                                            5 semanas

                                                                │
                                                                ▼

                                                        Snapshots Mensais

                                                                │
                                                                ▼

                                                             12 meses

                                                                │
                                                                ▼

                                                        Snapshots Anuais

                                                                │
                                                                ▼

                                                             5 anos
```

Essa organização reduz custos de armazenamento sem comprometer a capacidade de recuperação histórica.

---

### Comparativo das Estratégias

| Característica          | Low-Cost            | Maior Investimento                              |
| ----------------------- | ------------------- | ----------------------------------------------- |
| Automated Backups       | Sim                 | Sim                                             |
| Retenção dos Backups    | 7 dias              | 35 dias                                         |
| Point-in-Time Recovery  | Sim                 | Sim                                             |
| Snapshots Manuais       | Antes de alterações | Antes de alterações                             |
| Snapshots Diários       | Não                 | Sim                                             |
| Snapshots Semanais      | Não                 | Sim                                             |
| Snapshots Mensais       | Não                 | Sim                                             |
| Snapshots Anuais        | Não                 | Sim                                             |
| Criptografia            | Sim                 | Sim                                             |
| Cópia para outra Região | Não                 | Sim                                             |
| Objetivo                | Redução de custos   | Alta disponibilidade e recuperação de desastres |

---

### Considerações Finais

A estratégia adotada combina os mecanismos nativos do Amazon RDS com políticas de retenção compatíveis com cada arquitetura proposta.

Na solução **Low-Cost**, prioriza-se simplicidade operacional e redução de custos, utilizando backups automáticos, Point-in-Time Recovery e snapshots manuais em momentos estratégicos.

Na solução de **Maior Investimento**, adicionam-se políticas de retenção em múltiplas camadas, snapshots periódicos, criptografia e replicação entre regiões, aproximando a arquitetura das práticas utilizadas em ambientes corporativos que exigem maior disponibilidade, conformidade e capacidade de recuperação de desastres.