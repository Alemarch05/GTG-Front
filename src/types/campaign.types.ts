export interface Campaign {
  id: string;
  user_id: string;
  title: string;
  description: string;
  target_amount: number | string;
  current_amount: number | string; 
  status: 'ACTIVE' | 'SUCCESSFUL' | 'FAILED';
  expires_at: string; 
  created_at: string;
}

export interface CreateCampaignDTO {
  title: string;
  description: string;
  goal_amount: number;
  deadline: string;
}