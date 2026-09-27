export type UserRole = 'student' | 'admin' | 'super_admin';

export type BuildingBlock = 'Block A' | 'Block B' | 'Block C';

export type ComplaintCategory =
  | 'Fan'
  | 'Electrical'
  | 'Lighting'
  | 'Projector'
  | 'Furniture'
  | 'Wi-Fi / Internet'
  | 'Plumbing'
  | 'Cleanliness'
  | 'Laboratory Equipment'
  | 'Door / Window'
  | 'Other';

export type ComplaintPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export type ComplaintStatus = 'Pending' | 'Accepted' | 'In Progress' | 'Resolved' | 'Rejected';

export type AdminRequestStatus = 'pending' | 'approved' | 'rejected' | 'disabled';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  student_id?: string; // USN
  role: UserRole;
  branch?: string;
  year?: string;
  semester?: string;
  cse_class: string; // CSE-1 to CSE-50
  created_at: string;
}

export interface Complaint {
  id: string;
  complaint_number: string; // CMP-2026-0001
  student_id: string;
  cse_class: string;
  building: BuildingBlock;
  room_number: string;
  category: ComplaintCategory;
  description: string;
  image_url?: string | null;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  admin_remark?: string | null;
  rejection_reason?: string | null;
  created_at: string;
  updated_at: string;
  resolved_at?: string | null;
  // Joined student info (for admin tables)
  student?: {
    full_name: string;
    student_id?: string;
    email: string;
    branch?: string;
    year?: string;
    semester?: string;
    cse_class: string;
  };
}

export interface ComplaintUpdate {
  id: string;
  complaint_id: string;
  status: ComplaintStatus;
  remark?: string | null;
  updated_by?: string | null;
  created_at: string;
  updater?: {
    full_name: string;
    role: UserRole;
  };
}

export interface AppNotification {
  id: string;
  user_id: string;
  complaint_id?: string | null;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface AdminRequest {
  id: string;
  user_id?: string | null;
  requested_email: string;
  requested_name: string;
  requested_role: 'admin' | 'super_admin';
  status: AdminRequestStatus;
  approved_by?: string | null;
  created_at: string;
  updated_at: string;
}
