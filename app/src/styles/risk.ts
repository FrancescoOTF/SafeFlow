export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export type ClientRiskRow = {
  corporate_client_id: string;
  client_name: string;
  effective_risk: RiskLevel;
  expired_count: number;
  risk_count: number;
  missing_count: number;
};

export type RequirementStatusRow = {
  document_name: string;
  status: "MISSING" | "RISK" | "EXPIRED" | "OK";
  expires_at: string | null;
  days_delta: number | null;
};
