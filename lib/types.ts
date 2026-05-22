export type Device = {
  id: string;
  name: string;
  owner: string | null;
  mac_address: string | null;
  ip_address: string | null;
  is_blocked: boolean;
  created_at: string;
};

export type BlockRule = {
  id: string;
  domain: string;
  reason: string | null;
  enabled: boolean;
  created_at: string;
};

export type Schedule = {
  id: string;
  device_id: string;
  start_time: string;
  end_time: string;
  days: string[];
  enabled: boolean;
  devices?: Pick<Device, "name" | "owner"> | null;
};
