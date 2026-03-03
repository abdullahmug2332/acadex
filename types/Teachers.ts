export type Teacher = {
  id: number;
  uid: string;
  first_name: string;
  last_name: string;
  email: string;
  cnic: string;
  phone?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  department?: string;
  qualification?: string;
  experience?: number;
  date_of_birth?: string;
  hired_date?: string;
  status?: 'active' | 'inactive';
  image?: string;
  subject_id: number[]; // stored as array after parsing JSON
  created_at: string;
  updated_at: string;
};
export interface TeacherForm {
  first_name: string;
  last_name: string;
  email: string;
  cnic:string;
  phone?: string;
  gender?: 'male' | 'female' | 'other';
  date_of_birth?: string; 
  address?: string;
  department?: string;
  qualification?: string;
  experience?: string;
  hired_date: string;   // matches backend
  subject_id: any[]; // send array of subject IDs
}