# Estratégia de Backup

### Visão Geral

Além da estratégia de snapshots e backups automáticos do Amazon RDS, este projeto adota uma política complementar de backup dos dados do banco PostgreSQL.

O objetivo é garantir a recuperação das informações da aplicação em diferentes cenários de falha, como exclusões acidentais, corrupção lógica dos dados, falhas durante atualizações ou necessidade de restauração de versões específicas do banco.

Essa estratégia é baseada em práticas comumente adotadas por pequenas e médias empresas que utilizam ambientes AWS.

---

### Objetivos

A estratégia de backup possui os seguintes objetivos:

* Proteger os dados da aplicação;
* Permitir recuperação rápida em caso de falhas;
* Complementar os snapshots do Amazon RDS;
* Manter diferentes pontos de restauração;
* Reduzir riscos durante atualizações da aplicação;
* Atender boas práticas de continuidade de negócios.

---

### Estratégia Adotada

A política de backup é composta por quatro camadas complementares.

#### 1. Backups Automáticos do Amazon RDS

Os **Automated Backups** permanecem habilitados durante todo o ciclo de vida da instância.

Características:

* Point-in-Time Recovery (PITR);
* Backups automáticos diários;
* Recuperação para um instante específico;
* Gerenciamento automático pela AWS.

Essa camada protege principalmente contra falhas operacionais e exclusões acidentais.

---

#### 2. Snapshots Manuais

Antes de qualquer alteração importante na infraestrutura, recomenda-se a criação de um Snapshot Manual.

Exemplos:

* Atualização da aplicação;
* Upgrade do PostgreSQL;
* Alterações estruturais no banco;
* Migração de dados.

Os snapshots permitem restaurar rapidamente toda a instância do banco de dados para um estado conhecido.

---

#### 3. Backup Lógico do PostgreSQL

Além dos recursos nativos do Amazon RDS, recomenda-se a realização de backups lógicos utilizando a ferramenta **pg_dump**.

Esse tipo de backup gera arquivos contendo a estrutura e os dados do banco de dados, permitindo restaurações completas ou parciais sem depender diretamente dos snapshots da infraestrutura.

Os arquivos podem ser armazenados em um bucket Amazon S3 para maior durabilidade e disponibilidade.

---

#### 4. Armazenamento no Amazon S3

Os backups lógicos devem ser enviados para um bucket dedicado no Amazon S3.

Recomenda-se habilitar:

* Versionamento do bucket;
* Criptografia em repouso;
* Lifecycle Policy para exclusão automática de backups antigos.

Essa estratégia reduz custos de armazenamento e aumenta a segurança dos arquivos de backup.

---
</br>

### Fluxo de Backup

```text
                                                  Banco PostgreSQL
                                                        │
                                                        ▼
                                                     pg_dump
                                                        │
                                                        ▼
                                                  Arquivo .sql
                                                        │
                                                        ▼
                                                    Amazon S3
                                                        │
                                                        ▼
                                                  Versionamento
                                                        │
                                                        ▼
                                                  Lifecycle Policy
```

---

### Frequência Recomendada

| Tipo de Backup          | Frequência          |
| ----------------------- | ------------------- |
| Automated Backup (RDS)  | Diário              |
| Point-in-Time Recovery  | Contínuo            |
| Snapshot Manual         | Antes de alterações |
| Backup Lógico (pg_dump) | Diário              |
| Teste de Restauração    | Mensal              |

---

### Política de Retenção

| Tipo                    | Retenção                       |
| ----------------------- | ------------------------------ |
| Automated Backups       | Conforme política do RDS       |
| Snapshots Manuais       | Até a validação das alterações |
| Backups Lógicos Diários | 30 dias                        |
| Backups Mensais         | 12 meses                       |

A política pode ser ajustada conforme os requisitos de negócio e disponibilidade da aplicação.

---

### Processo de Recuperação

Em caso de necessidade de restauração, recomenda-se seguir a seguinte ordem:

```text
                                            Incidente
                                                │
                                                ▼
                                    Verificar possibilidade de PITR
                                                │
                                                ▼
                                    Caso necessário, restaurar Snapshot
                                                │
                                                ▼
                              Caso seja preciso recuperar apenas dados específicos,
                              utilizar backup lógico (pg_dump)
                                                │
                                                ▼
                                 Validar integridade da aplicação
```

Essa abordagem reduz o tempo de recuperação e oferece maior flexibilidade para diferentes tipos de incidentes.

---

### Benefícios

A estratégia proposta oferece diversas vantagens:

* Proteção contra falhas de infraestrutura;
* Recuperação de erros operacionais;
* Recuperação de dados específicos através do pg_dump;
* Armazenamento seguro utilizando Amazon S3;
* Redução de custos por meio de políticas de retenção;
* Simplicidade operacional para pequenas e médias empresas;
* Complementação da estratégia de snapshots do Amazon RDS.

---

### Considerações Finais

A combinação entre **Automated Backups**, **Point-in-Time Recovery**, **Snapshots Manuais**, **backup lógico com pg_dump** e armazenamento dos arquivos no **Amazon S3** constitui uma estratégia de backup equilibrada para pequenas e médias empresas.

Essa abordagem complementa a estratégia de snapshots descrita em **snapshot_db.md**, oferecendo múltiplas opções de recuperação dos dados, reduzindo riscos operacionais e aumentando a confiabilidade da infraestrutura sem elevar significativamente os custos de operação.