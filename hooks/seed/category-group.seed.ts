export const categoryGroupSeed = [
  {
    name: "Bills",
    key: "bills",
    categories: [
      {
        name: "Rent/Mortgage",
        key: "rent_mortgage",
      },
      {
        name: "Phone",
        key: "phone",
      },
      {
        name: "Internet",
        key: "internet",
      },
      {
        name: "Utilities",
        key: "utilities",
      },
    ],
  },
  {
    name: "Needs",
    key: "needs",
    categories: [
      {
        name: "Groceries",
        key: "groceries",
      },

      {
        name: "Transportation",
        key: "transportation",
      },

      {
        name: "Medical expenses",
        key: "medical_expenses",
      },
      {
        name: "Emergency fund",
        key: "emergency_fund",
      },
    ],
  },
  {
    name: "Wants",
    key: "wants",
    categories: [
      {
        name: "Dining out",
        key: "dining_out",
      },
      {
        name: "Entertainment",
        key: "entertainment",
      },
      {
        name: "Vacation",
        key: "vacation",
      },
      {
        name: "Stuff I forgot to budget for",
        key: "stuff_i_forgot_to_budget_for",
      },
    ],
  },
] as const;

export const systemCategories = [
  {
    name: "ready_to_assign",
    system: 1,
  },
];
