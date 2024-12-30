export type AccountType =
  | "checking"
  | "savings"
  | "cash"
  | "credit_card"
  | "line_of_credit"
  | "mortgage"
  | "auto_loan"
  | "student_loan"
  | "personal_loan"
  | "medical_debt"
  | "other_debt"
  | "asset"
  | "liability";

export type AccountGroup = "budget" | "loan" | "tracking";

export type TargetType = "weekly" | "monthly" | "yearly" | "custom";

export type RefillStrategy = "set_aside" | "refill_up_to" | "balance_of";
