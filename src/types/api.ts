
export interface ApiUsage {
  id: string;
  api_name: string;
  month: number;
  year: number;
  count: number;
  created_at: string;
  updated_at: string;
}

// Interface for API usage data returned from get_api_usage RPC function
export interface ApiUsageRpcResult {
  count: number;
  month: number;
  year: number;
}
