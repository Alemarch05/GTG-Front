export type ContributionStatus = 'HELD' | 'RELEASED' | 'REFUNDED';

export interface Contribution {
  id?: string;
  contribution_id?: string;
  campaign_id: string;
  user_id?: string;
  amount: number;
  status: ContributionStatus;
  created_at: string;
  campaign_title?: string;
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
