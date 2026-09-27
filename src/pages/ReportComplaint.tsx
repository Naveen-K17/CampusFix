import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import {
  BUILDING_BLOCKS,
  COMPLAINT_CATEGORIES,
  PRIORITY_CONFIG,
} from '../lib/utils';
import {
  BuildingBlock,
  ComplaintCategory,
  ComplaintPriority,
  Complaint,
} from '../types/database';
import { dbCreateComplaint, dbUploadComplaintImage } from '../lib/supabase';
import { ImageUploader } from '../components/ImageUploader';
import {
  AlertCircle,
  Building,
  CheckCircle2,
  FileText,
  MapPin,
  Sparkles,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

interface ReportComplaintProps {
  onNavigate: (view: string, id?: string) => void;
}

export const ReportComplaint: React.FC<ReportComplaintProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { addToast } = useNotifications();

  // If user is not logged in, prompt to log in or register
  const studentCseClass = user?.cse_class || 'CSE-17';

  const [step, setStep] = useState<number>(1);
  const [building, setBuilding] = useState<BuildingBlock>('Block A');
  const [roomNumber, setRoomNumber] = useState<string>('');
  const [category, setCategory] = useState<ComplaintCategory>('Fan');
  const [description, setDescription] = useState<string>('');
  const [priority, setPriority] = useState<ComplaintPriority>('Medium');

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedComplaint, setSubmittedComplaint] = useState<Complaint | null>(null);

  // Validate step 1
  const validateStep1 = () => {
    if (!roomNumber.trim()) {
      setErrorMsg('Please enter a room number or hall identifier (e.g. 204, Lab 2).');
      return false;
    }
    setErrorMsg(null);
    return true;
  };

  // Validate step 2
  const validateStep2 = () => {
    if (!description.trim() || description.trim().length < 10) {
      setErrorMsg('Please provide a detailed description (at least 10 characters).');
      return false;
    }
    setErrorMsg(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep1() || !validateStep2()) return;

    if (!user) {
      setErrorMsg('Please sign in or register before submitting a complaint.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      let uploadedImageUrl: string | null = null;
      if (imageFile) {
        uploadedImageUrl = await dbUploadComplaintImage(imageFile);
      }

      const newComplaint = await dbCreateComplaint({
        student_id: user.id,
        cse_class: studentCseClass,
        building,
        room_number: roomNumber.trim(),
        category,
        description: description.trim(),
        image_url: uploadedImageUrl,
        priority,
      });

      setSubmittedComplaint(newComplaint);
      addToast(
        'Complaint Submitted',
        `Complaint ${newComplaint.complaint_number} has been sent to administration.`,
        'success'
      );
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg('Failed to submit complaint. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animated Success Screen
  if (submittedComplaint) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 bg-slate-50">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-md p-8 text-center animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-200">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Complaint Submitted Successfully
          </h2>

          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            Your complaint has been sent to the administration. Campus technicians will review
            the request and update you in real time.
          </p>

          {/* Ticket Card */}
          <div className="my-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-2 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-medium">Complaint ID:</span>
              <span className="font-mono font-bold text-sm text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                {submittedComplaint.complaint_number}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500">Location:</span>
              <span className="font-semibold text-slate-800">
                {submittedComplaint.building}, Room {submittedComplaint.room_number}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500">Class:</span>
              <span className="font-mono text-slate-800">{submittedComplaint.cse_class}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500">Category:</span>
              <span className="font-semibold text-slate-800">{submittedComplaint.category}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500">Priority:</span>
              <span className="font-semibold text-slate-800">{submittedComplaint.priority}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => onNavigate('complaint-details', submittedComplaint.id)}
              className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              View Complaint Timeline
            </button>
            <button
              onClick={() => onNavigate('student-dashboard')}
              className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
            <FileText className="w-3.5 h-3.5" />
            Campus Maintenance Request
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Report a Campus Issue
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto">
            Tell us what needs to be fixed and we'll take care of the rest.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Step Progress Bar */}
          <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between text-xs font-semibold">
            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[11px] ${
                  step === 1 ? 'bg-indigo-600 text-white' : 'bg-emerald-600 text-white'
                }`}
              >
                1
              </span>
              <span className={step === 1 ? 'text-indigo-600' : 'text-slate-700'}>
                Location & Category
              </span>
            </div>

            <div className="w-8 h-px bg-slate-300" />

            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[11px] ${
                  step === 2 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'
                }`}
              >
                2
              </span>
              <span className={step === 2 ? 'text-indigo-600' : 'text-slate-500'}>
                Details & Photo
              </span>
            </div>
          </div>

          {errorMsg && (
            <div className="m-6 mb-0 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {step === 1 ? (
              <div className="space-y-6 animate-in fade-in-50 duration-200">
                {/* Read-Only Student CSE Class Banner */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-800">
                      Your Class: <strong className="font-mono text-indigo-600">{studentCseClass}</strong>
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Auto-populated from your registered student profile
                    </p>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 bg-white px-2 py-1 rounded border border-slate-200">
                    Read-only
                  </span>
                </div>

                {/* Building / Block: STRICTLY Block A, Block B, Block C ONLY */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-2">
                    Building / Block *
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {BUILDING_BLOCKS.map((blk) => (
                      <button
                        key={blk}
                        type="button"
                        onClick={() => setBuilding(blk)}
                        className={`py-3 px-4 rounded-xl border text-xs font-semibold text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                          building === blk
                            ? 'bg-indigo-50 border-indigo-600 text-indigo-700 ring-2 ring-indigo-600/10'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <Building className="w-4 h-4" />
                        <span>{blk}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Room Number: User-entered field (NOT a dropdown) */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Room Number *
                  </label>
                  <p className="text-[11px] text-slate-500 mb-2">
                    Enter the exact classroom, lab, or seminar hall identifier.
                  </p>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={roomNumber}
                      onChange={(e) => setRoomNumber(e.target.value)}
                      placeholder="Enter room number (e.g. 101, 204, 305, Lab 2, Seminar Hall)"
                      className="w-full text-xs px-3.5 py-2.5 pl-9 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-600"
                    />
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>

                {/* Category Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-2">
                    Complaint Category *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {COMPLAINT_CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`py-2 px-3 rounded-lg border text-xs font-medium text-left transition-colors cursor-pointer ${
                          category === cat
                            ? 'bg-slate-900 border-slate-900 text-white'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      if (validateStep1()) setStep(2);
                    }}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Next: Add Details & Photo</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in-50 duration-200">
                {/* Description Textarea */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Describe the problem *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Example: The ceiling fan near the second row is not working."
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-600 resize-none leading-relaxed"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Be specific about row number, desk position, or equipment label.
                  </p>
                </div>

                {/* Photo Upload with preview */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Upload Complaint Image (Recommended)
                  </label>
                  <ImageUploader
                    onImageSelected={(file) => setImageFile(file)}
                    previewUrl={previewUrl}
                    setPreviewUrl={setPreviewUrl}
                    isUploading={isSubmitting}
                  />
                </div>

                {/* Priority Selection with explanations */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-2">
                    Priority Level *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(Object.keys(PRIORITY_CONFIG) as ComplaintPriority[]).map((p) => {
                      const cfg = PRIORITY_CONFIG[p];
                      const isSelected = priority === p;
                      return (
                        <div
                          key={p}
                          onClick={() => setPriority(p)}
                          className={`p-3 rounded-xl border cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-slate-900 border-slate-900 text-white'
                              : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold">{cfg.label}</span>
                          </div>
                          <p
                            className={`text-[11px] leading-tight ${
                              isSelected ? 'text-slate-300' : 'text-slate-500'
                            }`}
                          >
                            {cfg.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom navigation buttons */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    <span>{isSubmitting ? 'Uploading & Submitting...' : 'Submit Complaint'}</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
