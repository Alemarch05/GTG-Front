export type ContributionStatus = 'HELD_IN_ESCROW' | 'RELEASED' | 'REFUNDED';

export interface Contribution {
  id: string;
  campaign_id: string;
  user_id: string;
  amount: number;
  status: ContributionStatus;
  created_at: string;
  campaign_title?: string; // Opcional para mostrar en la vista de historial
}

export interface CreateContributionDTO {
  campaign_id: string;
  user_id: string;
  amount: number;
}

export interface ContributionResponse {
  success: boolean;
  data: Contribution;
}

export interface UserContributionsResponse {
  success: boolean;
  data: Contribution[];
}
