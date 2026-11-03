export type BadgeStatus = 
  | 'ACTIVE' 
  | 'SUCCESSFUL' 
  | 'FAILED' 
  | 'HELD_IN_ESCROW' 
  | 'RELEASED' 
  | 'REFUNDED';

export type AlertType = 'success' | 'error' | 'warning' | 'info';