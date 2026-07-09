# Maintenance Strategy

### Visão Geral

A estratégia de manutenção estabelece as boas práticas para atualização, correção e evolução da infraestrutura da aplicação, visando preservar a disponibilidade dos serviços e reduzir os riscos de indisponibilidade durante intervenções planejadas.

As atividades de manutenção abrangem tanto os recursos de infraestrutura quanto os componentes da aplicação, incluindo instâncias EC2, Amazon RDS, imagens Docker, Auto Scaling Group e demais serviços utilizados na arquitetura.

As recomendações apresentadas são aplicáveis às duas propostas arquiteturais do projeto, variando apenas o impacto esperado de acordo com o nível de redundância de cada ambiente.

---

### Objetivos

A estratégia de manutenção possui os seguintes objetivos:

* Garantir a continuidade dos serviços durante alterações planejadas;
* Reduzir riscos de indisponibilidade;
* Preservar a integridade dos dados;
* Padronizar o processo de atualização da infraestrutura;
* Facilitar o retorno ao estado anterior em caso de falhas;
* Aplicar boas práticas de operação em ambientes AWS.

---
</br>

## Tipos de Manutenção

### 1. Manutenção Preventiva

Realizada periodicamente para manter o ambiente atualizado e seguro.

Exemplos:

* Atualização do sistema operacional das instâncias;
* Atualização das imagens Docker;
* Atualização de dependências da aplicação;
* Revisão de regras de Security Groups;
* Verificação do consumo de recursos;
* Revisão das políticas de backup e snapshots.

### 2. Manutenção Corretiva

Executada quando ocorre algum incidente que comprometa o funcionamento da aplicação.

Exemplos:

* Substituição de instâncias com falha;
* Recuperação do banco de dados;
* Correção de configurações incorretas;
* Restauração por Snapshot ou Point-in-Time Recovery (PITR).

### 3. Manutenção Evolutiva

Relacionada à evolução da aplicação e da infraestrutura.

Exemplos:

* Implantação de novas funcionalidades;
* Atualização da versão do PostgreSQL;
* Alteração da classe das instâncias EC2 ou RDS;
* Expansão da capacidade de armazenamento;
* Ajustes nas políticas do Auto Scaling Group.

---
</br>

### Processo de Manutenção

Antes de qualquer alteração na infraestrutura, recomenda-se seguir um fluxo padronizado para minimizar riscos.

```text
                                                      Planejamento
                                                            │
                                                            ▼
                                                Criar Snapshot do Banco
                                                            │
                                                            ▼
                                                     Executar Backup
                                                            │
                                                            ▼
                                                     Aplicar Alterações
                                                            │
                                                            ▼
                                                      Validar Ambiente
                                                            │
                                                            ▼
                                                      Monitorar Aplicação
                                                            │
                                                            ▼
                                                      Encerrar Manutenção
```

Caso seja identificada alguma inconsistência durante a validação, recomenda-se restaurar o ambiente utilizando os procedimentos descritos em **snapshot_db.md** e **backup.md**.

---

### Atualizações da Aplicação

As atualizações da aplicação devem seguir um fluxo controlado.

```text
                                                      Nova Versão
                                                            │
                                                            ▼
                                                Build da Imagem Docker
                                                            │
                                                            ▼
                                                Publicação no Amazon ECR
                                                            │
                                                            ▼
                                    Atualização do Launch Template (quando necessário)
                                                            │
                                                            ▼
                              Provisionamento de novas instâncias pelo Auto Scaling Group
                                                            │
                                                            ▼
                                                  Validação da Aplicação
```

Esse processo reduz o risco de interrupções e mantém a padronização do ambiente.

---

### Manutenção do Banco de Dados

Antes de qualquer alteração no banco de dados, recomenda-se:

* Criar um Snapshot Manual;
* Confirmar a conclusão dos backups automáticos;
* Validar a disponibilidade do Point-in-Time Recovery (PITR);
* Executar backup lógico do banco, quando aplicável;
* Registrar a alteração realizada.

Após a conclusão da manutenção, devem ser realizados testes de conectividade e validação da aplicação.

---

### Janela de Manutenção

Sempre que possível, as manutenções devem ser realizadas em períodos de menor utilização da aplicação.

Boas práticas:

* Agendar intervenções fora do horário de maior uso;
* Informar previamente os usuários, quando necessário;
* Evitar alterações simultâneas em múltiplos componentes críticos;
* Monitorar continuamente o ambiente durante e após a manutenção.

---

### Monitoramento Pós-Manutenção

Após qualquer intervenção, recomenda-se acompanhar os principais indicadores da infraestrutura.

Itens a verificar:

* Status das instâncias EC2;
* Saúde do Application Load Balancer;
* Eventos do Auto Scaling Group;
* Conectividade com o Amazon RDS;
* Utilização de CPU e memória;
* Logs da aplicação;
* Alertas enviados pelo Amazon SNS.

O monitoramento deve permanecer ativo até que a estabilidade do ambiente seja confirmada.

---
</br>

## Diferenças entre as Propostas

### 1. Proposta Low-Cost

A arquitetura Low-Cost possui menor redundância em alguns componentes, tornando o planejamento da manutenção ainda mais importante.

Recomenda-se:

* Realizar alterações em horários de baixa utilização;
* Validar cuidadosamente cada atualização antes de concluir a manutenção;
* Manter snapshots recentes para recuperação rápida.

### 2. Proposta de Maior Investimento

A arquitetura de maior investimento possui maior disponibilidade e redundância, permitindo que determinadas atividades sejam executadas com menor impacto aos usuários.

Mesmo assim, recomenda-se seguir o mesmo fluxo de manutenção preventiva para garantir a consistência da infraestrutura.

---

### Boas Práticas

* Planejar todas as alterações antes da execução;
* Criar Snapshot Manual antes de mudanças críticas;
* Confirmar a execução dos backups;
* Validar o ambiente após cada atualização;
* Monitorar logs e métricas durante a manutenção;
* Documentar todas as alterações realizadas;
* Manter procedimentos de recuperação atualizados;
* Testar periodicamente os processos de restauração.

---

### Considerações Finais

Uma estratégia de manutenção bem definida reduz riscos operacionais, aumenta a confiabilidade da infraestrutura e contribui para a continuidade dos serviços.

A combinação entre planejamento, backups, snapshots, monitoramento e validação pós-manutenção permite realizar atualizações de forma controlada e segura, seguindo práticas amplamente adotadas em pequenas e médias empresas que utilizam serviços gerenciados da AWS.

Este documento complementa as estratégias apresentadas em **backup.md** e **snapshot_db.md**, consolidando um processo de manutenção alinhado às boas práticas de operação em ambientes de computação em nuvem.