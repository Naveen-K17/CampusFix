import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  AdminRequest,
  AppNotification,
  Complaint,
  ComplaintPriority,
  ComplaintStatus,
  ComplaintUpdate,
  Profile,
} from '../types/database';
import { generateComplaintNumber } from './utils';

// Read configuration from environment or session overrides
const envUrl = import.meta.env.VITE_SUPABASE_URL;
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if credentials are valid (not default placeholder)
export const isSupabaseConfigured = Boolean(
  envUrl &&
    envKey &&
    !envUrl.includes('your-project') &&
    envUrl.startsWith('https://') &&
    envKey.length > 20
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(envUrl, envKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

// ============================================================================
// RESILIENT LOCAL STORE (Allows instant live testing even before Supabase project creation)
// ============================================================================

const SEED_PROFILES: Profile[] = [
  {
    id: 'super-admin-uuid-1',
    full_name: 'Naveen Kattimani',
    email: 'naveenkattimani326@gmail.com',
    role: 'super_admin',
    branch: 'Computer Science & Engineering',
    year: 'Faculty / Admin',
    semester: 'Campus Admin',
    cse_class: 'CSE-1',
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: 'student-demo-uuid-1',
    full_name: 'Aditya Sharma',
    email: 'aditya.cse17@sapthagiri.edu.in',
    student_id: '1SG22CS017',
    role: 'student',
    branch: 'Computer Science & Engineering',
    year: '3rd Year',
    semester: 'Semester 5',
    cse_class: 'CSE-17',
    created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
  },
];

const SEED_COMPLAINTS: Complaint[] = [
  {
    id: 'cmp-seed-1',
    complaint_number: 'CMP-2026-0001',
    student_id: 'student-demo-uuid-1',
    cse_class: 'CSE-17',
    building: 'Block A',
    room_number: '204',
    category: 'Fan',
    description: 'The ceiling fan near the second row is vibrating intensely and making loud scraping noise during lectures.',
    priority: 'High',
    status: 'In Progress',
    admin_remark: 'Electrician team assigned. Repair scheduled for 4:00 PM after classes.',
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    student: {
      full_name: 'Aditya Sharma',
      student_id: '1SG22CS017',
      email: 'aditya.cse17@sapthagiri.edu.in',
      branch: 'CSE',
      cse_class: 'CSE-17',
    },
  },
  {
    id: 'cmp-seed-2',
    complaint_number: 'CMP-2026-0002',
    student_id: 'student-demo-uuid-1',
    cse_class: 'CSE-17',
    building: 'Block B',
    room_number: 'Lab 2',
    category: 'Projector',
    description: 'HDMI display flickering with green tint on the main interactive projector.',
    priority: 'Medium',
    status: 'Pending',
    created_at: new Date(Date.now() - 5 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 3600000).toISOString(),
    student: {
      full_name: 'Aditya Sharma',
      student_id: '1SG22CS017',
      email: 'aditya.cse17@sapthagiri.edu.in',
      branch: 'CSE',
      cse_class: 'CSE-17',
    },
  },
  {
    id: 'cmp-seed-3',
    complaint_number: 'CMP-2026-0003',
    student_id: 'student-demo-uuid-1',
    cse_class: 'CSE-17',
    building: 'Block A',
    room_number: '101',
    category: 'Lighting',
    description: 'Two tubelights at the back corner are flickering constantly.',
    priority: 'Low',
    status: 'Resolved',
    admin_remark: 'LED tubes replaced and illumination verified.',
    resolved_at: new Date(Date.now() - 12 * 3600000).toISOString(),
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 12 * 3600000).toISOString(),
    student: {
      full_name: 'Aditya Sharma',
      student_id: '1SG22CS017',
      email: 'aditya.cse17@sapthagiri.edu.in',
      branch: 'CSE',
      cse_class: 'CSE-17',
    },
  },
];

const SEED_UPDATES: ComplaintUpdate[] = [
  {
    id: 'upd-1',
    complaint_id: 'cmp-seed-1',
    status: 'Pending',
    remark: 'Complaint logged by student.',
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'upd-2',
    complaint_id: 'cmp-seed-1',
    status: 'Accepted',
    remark: 'Complaint reviewed and accepted by Campus Maintenance Dept.',
    created_at: new Date(Date.now() - 1.8 * 86400000).toISOString(),
    updater: {
      full_name: 'Naveen Kattimani',
      role: 'super_admin',
    },
  },
  {
    id: 'upd-3',
    complaint_id: 'cmp-seed-1',
    status: 'In Progress',
    remark: 'Electrician team assigned. Repair scheduled for 4:00 PM after classes.',
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    updater: {
      full_name: 'Naveen Kattimani',
      role: 'super_admin',
    },
  },
  {
    id: 'upd-4',
    complaint_id: 'cmp-seed-3',
    status: 'Resolved',
    remark: 'LED tubes replaced and illumination verified.',
    created_at: new Date(Date.now() - 12 * 3600000).toISOString(),
    updater: {
      full_name: 'Naveen Kattimani',
      role: 'super_admin',
    },
  },
];

const SEED_ADMIN_REQUESTS: AdminRequest[] = [
  {
    id: 'req-1',
    requested_email: 'ramesh.maintenance@sapthagiri.edu.in',
    requested_name: 'Ramesh Gowda',
    requested_role: 'admin',
    status: 'approved',
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 9 * 86400000).toISOString(),
  },
  {
    id: 'req-2',
    requested_email: 'sunita.admin@sapthagiri.edu.in',
    requested_name: 'Sunita Rao',
    requested_role: 'admin',
    status: 'pending',
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
];

const SEED_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    user_id: 'student-demo-uuid-1',
    complaint_id: 'cmp-seed-1',
    title: 'Work started on your complaint',
    message: 'Work has started on your complaint CMP-2026-0001 (Fan, Block A, Room 204).',
    is_read: false,
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'notif-2',
    user_id: 'student-demo-uuid-1',
    complaint_id: 'cmp-seed-3',
    title: 'Complaint resolved',
    message: 'Your complaint CMP-2026-0003 has been marked as Resolved by administration.',
    is_read: true,
    created_at: new Date(Date.now() - 12 * 3600000).toISOString(),
  },
];

// Helper to access resilient local storage data
function getLocalItem<T>(key: string, fallback: T): T {
  try {
    const val = localStorage.getItem(`campusfix_${key}`);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
}

function setLocalItem<T>(key: string, val: T): void {
  try {
    localStorage.setItem(`campusfix_${key}`, JSON.stringify(val));
  } catch {
    // ignore
  }
}

// ============================================================================
// DATA OPERATIONS (Unified for Supabase and Resilient fallback)
// ============================================================================

export async function dbFetchComplaints(studentId?: string): Promise<Complaint[]> {
  if (supabase) {
    try {
      let query = supabase
        .from('complaints')
        .select(`
          *,
          student:profiles!complaints_student_id_fkey(full_name, student_id, email, branch, year, semester, cse_class)
        `)
        .order('created_at', { ascending: false });

      if (studentId) {
        query = query.eq('student_id', studentId);
      }

      const { data, error } = await query;
      if (!error && data) return data as Complaint[];
      console.warn('Supabase fetch complaints note:', error?.message);
    } catch (err) {
      console.warn('Falling back to local cache for complaints:', err);
    }
  }

  const allComplaints = getLocalItem<Complaint[]>('complaints', SEED_COMPLAINTS);
  if (studentId) {
    return allComplaints.filter((c) => c.student_id === studentId);
  }
  return allComplaints;
}

export async function dbFetchComplaintById(id: string): Promise<{
  complaint: Complaint | null;
  updates: ComplaintUpdate[];
}> {
  if (supabase) {
    try {
      const { data: complaint, error: cmpError } = await supabase
        .from('complaints')
        .select(`
          *,
          student:profiles!complaints_student_id_fkey(full_name, student_id, email, branch, year, semester, cse_class)
        `)
        .eq('id', id)
        .single();

      const { data: updates, error: updError } = await supabase
        .from('complaint_updates')
        .select(`
          *,
          updater:profiles!complaint_updates_updated_by_fkey(full_name, role)
        `)
        .eq('complaint_id', id)
        .order('created_at', { ascending: true });

      if (!cmpError && complaint) {
        return {
          complaint: complaint as Complaint,
          updates: (updates as ComplaintUpdate[]) || [],
        };
      }
    } catch (err) {
      console.warn('Fallback to local cache for complaint details:', err);
    }
  }

  const complaints = getLocalItem<Complaint[]>('complaints', SEED_COMPLAINTS);
  const complaint = complaints.find((c) => c.id === id) || null;
  const updates = getLocalItem<ComplaintUpdate[]>('updates', SEED_UPDATES).filter(
    (u) => u.complaint_id === id
  );

  return { complaint, updates };
}

export async function dbCreateComplaint(complaintData: Omit<Complaint, 'id' | 'complaint_number' | 'status' | 'created_at' | 'updated_at'>): Promise<Complaint> {
  const currentComplaints = getLocalItem<Complaint[]>('complaints', SEED_COMPLAINTS);
  const complaintNumber = generateComplaintNumber(currentComplaints.length + 1);
  const newId = `cmp-${Date.now()}`;
  const now = new Date().toISOString();

  const newComplaint: Complaint = {
    ...complaintData,
    id: newId,
    complaint_number: complaintNumber,
    status: 'Pending',
    created_at: now,
    updated_at: now,
  };

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('complaints')
        .insert({
          complaint_number: complaintNumber,
          student_id: complaintData.student_id,
          cse_class: complaintData.cse_class,
          building: complaintData.building,
          room_number: complaintData.room_number,
          category: complaintData.category,
          description: complaintData.description,
          image_url: complaintData.image_url,
          priority: complaintData.priority,
          status: 'Pending',
        })
        .select(`
          *,
          student:profiles!complaints_student_id_fkey(full_name, student_id, email, branch, year, semester, cse_class)
        `)
        .single();

      if (!error && data) {
        // Record initial update
        await supabase.from('complaint_updates').insert({
          complaint_id: data.id,
          status: 'Pending',
          remark: 'Complaint submitted by student.',
          updated_by: complaintData.student_id,
        });

        return data as Complaint;
      }
    } catch (err) {
      console.warn('Supabase insert failed, saving locally:', err);
    }
  }

  // Update local memory
  const updatedList = [newComplaint, ...currentComplaints];
  setLocalItem('complaints', updatedList);

  const updates = getLocalItem<ComplaintUpdate[]>('updates', SEED_UPDATES);
  const initialUpdate: ComplaintUpdate = {
    id: `upd-${Date.now()}`,
    complaint_id: newId,
    status: 'Pending',
    remark: 'Complaint submitted by student.',
    updated_by: complaintData.student_id,
    created_at: now,
  };
  setLocalItem('updates', [...updates, initialUpdate]);

  return newComplaint;
}

export async function dbUpdateComplaintStatus(
  complaintId: string,
  status: ComplaintStatus,
  adminRemark: string,
  adminUser: Profile,
  rejectionReason?: string
): Promise<Complaint | null> {
  const now = new Date().toISOString();
  const isResolved = status === 'Resolved';

  if (supabase) {
    try {
      const updatePayload: Record<string, unknown> = {
        status,
        updated_at: now,
        admin_remark: adminRemark,
      };

      if (rejectionReason) {
        updatePayload.rejection_reason = rejectionReason;
      }
      if (isResolved) {
        updatePayload.resolved_at = now;
      }

      const { data, error } = await supabase
        .from('complaints')
        .update(updatePayload)
        .eq('id', complaintId)
        .select(`
          *,
          student:profiles!complaints_student_id_fkey(full_name, student_id, email, branch, year, semester, cse_class)
        `)
        .single();

      if (!error && data) {
        // Log timeline update
        await supabase.from('complaint_updates').insert({
          complaint_id: complaintId,
          status,
          remark: rejectionReason || adminRemark,
          updated_by: adminUser.id,
        });

        // Notify student
        await supabase.from('notifications').insert({
          user_id: data.student_id,
          complaint_id: complaintId,
          title: `Complaint ${status}`,
          message:
            status === 'Accepted'
              ? `Your complaint ${data.complaint_number} has been accepted by administration.`
              : status === 'In Progress'
              ? `Work has started on your complaint ${data.complaint_number}: ${adminRemark}`
              : status === 'Resolved'
              ? `Your complaint ${data.complaint_number} has been resolved: ${adminRemark}`
              : `Your complaint ${data.complaint_number} was rejected: ${rejectionReason}`,
        });

        return data as Complaint;
      }
    } catch (err) {
      console.warn('Supabase update failed, applying locally:', err);
    }
  }

  // Local fallback execution
  const complaints = getLocalItem<Complaint[]>('complaints', SEED_COMPLAINTS);
  const targetIndex = complaints.findIndex((c) => c.id === complaintId);
  if (targetIndex === -1) return null;

  const target = complaints[targetIndex];
  const updatedComplaint: Complaint = {
    ...target,
    status,
    admin_remark: adminRemark || target.admin_remark,
    rejection_reason: rejectionReason || target.rejection_reason,
    updated_at: now,
    resolved_at: isResolved ? now : target.resolved_at,
  };

  complaints[targetIndex] = updatedComplaint;
  setLocalItem('complaints', complaints);

  // Add timeline entry
  const updates = getLocalItem<ComplaintUpdate[]>('updates', SEED_UPDATES);
  const newUpdate: ComplaintUpdate = {
    id: `upd-${Date.now()}`,
    complaint_id: complaintId,
    status,
    remark: rejectionReason || adminRemark,
    updated_by: adminUser.id,
    created_at: now,
    updater: {
      full_name: adminUser.full_name,
      role: adminUser.role,
    },
  };
  setLocalItem('updates', [...updates, newUpdate]);

  // Add student notification
  const notifications = getLocalItem<AppNotification[]>('notifications', SEED_NOTIFICATIONS);
  const newNotif: AppNotification = {
    id: `notif-${Date.now()}`,
    user_id: target.student_id,
    complaint_id: complaintId,
    title: `Complaint ${status}`,
    message:
      status === 'Accepted'
        ? `Your complaint ${target.complaint_number} has been accepted by administration.`
        : status === 'In Progress'
        ? `Work has started on your complaint ${target.complaint_number}: ${adminRemark}`
        : status === 'Resolved'
        ? `Your complaint ${target.complaint_number} has been resolved: ${adminRemark}`
        : `Your complaint ${target.complaint_number} was rejected: ${rejectionReason}`,
    is_read: false,
    created_at: now,
  };
  setLocalItem('notifications', [newNotif, ...notifications]);

  return updatedComplaint;
}

export async function dbUpdateComplaintPriority(
  complaintId: string,
  priority: ComplaintPriority
): Promise<boolean> {
  if (supabase) {
    try {
      const { error } = await supabase
        .from('complaints')
        .update({ priority, updated_at: new Date().toISOString() })
        .eq('id', complaintId);
      if (!error) return true;
    } catch (err) {
      console.warn('Supabase update priority failed:', err);
    }
  }

  const complaints = getLocalItem<Complaint[]>('complaints', SEED_COMPLAINTS);
  const target = complaints.find((c) => c.id === complaintId);
  if (target) {
    target.priority = priority;
    target.updated_at = new Date().toISOString();
    setLocalItem('complaints', complaints);
    return true;
  }
  return false;
}

export async function dbFetchNotifications(userId: string): Promise<AppNotification[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);
      if (!error && data) return data as AppNotification[];
    } catch (err) {
      console.warn('Supabase fetch notifications fallback:', err);
    }
  }

  const all = getLocalItem<AppNotification[]>('notifications', SEED_NOTIFICATIONS);
  return all.filter((n) => n.user_id === userId);
}

export async function dbMarkNotificationRead(notificationId: string): Promise<void> {
  if (supabase) {
    try {
      await supabase.from('notifications').update({ is_read: true }).eq('id', notificationId);
    } catch {
      // ignore
    }
  }
  const all = getLocalItem<AppNotification[]>('notifications', SEED_NOTIFICATIONS);
  const target = all.find((n) => n.id === notificationId);
  if (target) {
    target.is_read = true;
    setLocalItem('notifications', all);
  }
}

export async function dbFetchAdminRequests(): Promise<AdminRequest[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('admin_requests')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) return data as AdminRequest[];
    } catch (err) {
      console.warn('Supabase fetch admin requests:', err);
    }
  }
  return getLocalItem<AdminRequest[]>('admin_requests', SEED_ADMIN_REQUESTS);
}

export async function dbCreateAdminRequest(
  name: string,
  email: string,
  role: 'admin' | 'super_admin' = 'admin'
): Promise<AdminRequest> {
  const now = new Date().toISOString();
  const newReq: AdminRequest = {
    id: `req-${Date.now()}`,
    requested_name: name,
    requested_email: email,
    requested_role: role,
    status: 'approved', // Auto-approved when created directly by Super Admin
    created_at: now,
    updated_at: now,
  };

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('admin_requests')
        .insert({
          requested_name: name,
          requested_email: email,
          requested_role: role,
          status: 'approved',
        })
        .select()
        .single();
      if (!error && data) return data as AdminRequest;
    } catch (err) {
      console.warn('Supabase create admin request:', err);
    }
  }

  const current = getLocalItem<AdminRequest[]>('admin_requests', SEED_ADMIN_REQUESTS);
  setLocalItem('admin_requests', [newReq, ...current]);
  return newReq;
}

export async function dbUpdateAdminRequestStatus(
  id: string,
  status: AdminRequest['status'],
  approverId: string
): Promise<boolean> {
  const now = new Date().toISOString();
  if (supabase) {
    try {
      const { error } = await supabase
        .from('admin_requests')
        .update({
          status,
          approved_by: approverId,
          updated_at: now,
        })
        .eq('id', id);
      if (!error) return true;
    } catch (err) {
      console.warn('Supabase update admin request status:', err);
    }
  }

  const all = getLocalItem<AdminRequest[]>('admin_requests', SEED_ADMIN_REQUESTS);
  const target = all.find((r) => r.id === id);
  if (target) {
    target.status = status;
    target.approved_by = approverId;
    target.updated_at = now;
    setLocalItem('admin_requests', all);
    return true;
  }
  return false;
}

export async function dbUploadComplaintImage(file: File): Promise<string> {
  if (supabase) {
    try {
      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `complaints/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('complaint-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (!uploadError) {
        const { data } = supabase.storage.from('complaint-images').getPublicUrl(filePath);
        return data.publicUrl;
      }
      console.warn('Supabase storage upload error:', uploadError.message);
    } catch (err) {
      console.warn('Storage upload fallback:', err);
    }
  }

  // Fallback: Read as base64 data URL
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
