export type ContributionStatus = 'HELD_IN_ESCROW' | 'HELD' | 'RELEASED' | 'REFUNDED';

export interface Contribution {
  id?: string;
  contribution_id?: string;
  campaign_id: string;
  user_id?: string;
  amount: number;
  status: ContributionStatus | string;
  created_at: string;
  campaign_title?: string; // Título de la campaña asociada al aporte
  campaign_status?: string;
}

export interface CreateContributionDTO {
  campaign_id: string;
  user_id: string;
  amount: number;
}

export interface ContributionResponse {
  success?: boolean;
  message?: string;
  data: Contribution;
}

export interface UserContributionsData {
  total_contributed?: number;
  contributions: Contribution[];
}

export interface UserContributionsResponse {
  success?: boolean;
  message?: string;
  data: Contribution[] | UserContributionsData;
}
