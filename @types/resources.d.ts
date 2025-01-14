interface Resources {
  "translation": {
    "hello": "Olá",
    "budget": "Orçamento",
    "loan": "Empréstimo",
    "tracking": "Monitoramento",
    "test": "Este é um teste {{value}}",
    "accountTypes": {
      "checking": "Conta corrente",
      "savings": "Conta Poupança",
      "cash": "Dinheiro",
      "credit_card": "Cartão de Crédito",
      "line_of_credit": "Linha de Crédito",
      "mortgage": "Financiamento de Imóvel",
      "auto_loan": "Financiamento de Automóvel",
      "student_loan": "Empréstimo Estudantil",
      "personal_loan": "Empréstimo Pessoal",
      "medical_debt": "Dívida Médica",
      "other_debt": "Outras Dívidas",
      "asset": "Investimentos",
      "liability": "Passivo",
      "placeholder": "Selecione o Tipo de Conta"
    },
    "cagegoryGroups": {
      "bills": "Faturas",
      "needs": "Necessidades",
      "wants": "Desejos",
      "placeholder": "Selecione o Grupo de Categorias",
      "categories": {
        "rent_mortgage": "Aluguel/Moradia",
        "phone": "Telefone",
        "internet": "Internet",
        "utilities": "Utilidades",
        "placeholder": "Selecione a Categoria",
        "groceries": "Compras",
        "transportation": "Transporte",
        "medical_expenses": "Despesas Médicas",
        "emergency_fund": "Fundo de Emergência",
        "entertainment": "Entretenimento",
        "vacation": "Férias",
        "stuff_i_forgot_to_budget_for": "Coisas que eu esqueci de orçar",
        "dining_out": "Jantar"
      }
    },
    "screens": {
      "budget": "Orçamento",
      "accounts": "Contas",
      "accounts.add": "Adicionar Conta",
      "accounts.edit": "Editar Conta",
      "accounts.accountType": "Selecione o Tipo de Conta",
      "transaction": "Transação",
      "report": "Relatório",
      "help": "Ajuda"
    },
    "months": {
      "10": "Outubro",
      "11": "Novembro",
      "12": "Dezembro",
      "01": "Janeiro",
      "02": "Fevereiro",
      "03": "Março",
      "04": "Abril",
      "05": "Maio",
      "06": "Junho",
      "07": "Julho",
      "08": "Agosto",
      "09": "Setembro"
    },
    "screen": {
      "categoryDetail": {
        "balance": "Saldo",
        "from": "De {{month}}",
        "assigned": "Alocado em {{month}}",
        "activity": "Atividade em {{month}}",
        "available": "Disponível",
        "target": "Meta",
        "targetTitle": "Quanto você precisa para {{categoryName}}?",
        "targetDescription": "A meta é o valor que você deseja ter disponível para gastar em {{categoryName}}. Se você não tem uma meta, você pode deixar este campo em branco.",
        "createTarget": "Criar Meta",
        "warning": {
          "title": "Aviso",
          "upcoming": "{{total}} transações futuras",
          "availableAfterUpcoming": "Disponível após as transações futuras"
        },
        "actions": {
          "rename": "Renomear Categoria",
          "delete": "Excluir Categoria",
          "hide": "Ocultar Categoria"
        }
      },
      "targetDetail": {
        "frequency": {
          "monthly": "Mensal",
          "weekly": "Semanal",
          "yearly": "Anual",
          "custom": "Personalizado"
        }
      }
    }
  }
}

export default Resources;
