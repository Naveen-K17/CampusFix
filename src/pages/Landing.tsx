import React from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Building2,
  CheckCircle,
  Clock,
  FileCheck2,
  MapPin,
  ShieldCheck,
  Sparkles,
  Wrench,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

interface LandingProps {
  onNavigate: (view: string) => void;
  onOpenSQLModal: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onNavigate, onOpenSQLModal }) => {
  const steps = [
    {
      number: '01',
      title: 'Report',
      description: 'Student spots a broken fan, projector issue, or faulty desk and logs a complaint with photo evidence.',
      icon: <FileCheck2 className="w-5 h-5 text-indigo-600" />,
    },
    {
      number: '02',
      title: 'Review',
      description: 'Campus administration evaluates the problem, classroom location, and assigns appropriate urgency.',
      icon: <Clock className="w-5 h-5 text-amber-600" />,
    },
    {
      number: '03',
      title: 'Accept',
      description: 'Complaint is formally accepted, and the specialized maintenance contractor or staff is dispatched.',
      icon: <ShieldCheck className="w-5 h-5 text-blue-600" />,
    },
    {
      number: '04',
      title: 'Work',
      description: 'Technician initiates repair work on site. Live status updates appear instantly on the student portal.',
      icon: <Wrench className="w-5 h-5 text-purple-600" />,
    },
    {
      number: '05',
      title: 'Resolve',
      description: 'Issue is fixed and verified. Detailed resolution remarks are permanently saved in university records.',
      icon: <CheckCircle className="w-5 h-5 text-emerald-600" />,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Value Proposition */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7 space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-800 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-indigo-600" />
                Sapthagiri NPS University · Campus Maintenance System
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] [text-wrap:balance]">
                Report it. Track it.{' '}
                <span className="text-indigo-600">Fix it.</span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl font-normal">
                A smarter, transparent platform for Computer Science students to report classroom issues
                and for university administrators to orchestrate campus repairs with real-time updates.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate('report')}
                  className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-2 group cursor-pointer"
                >
                  <span>Report an Issue</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onNavigate('login')}
                  className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm rounded-xl border border-slate-300 transition-colors shadow-xs cursor-pointer"
                >
                  Student & Admin Login
                </button>

                <button
                  onClick={() => onNavigate('admin-login')}
                  className="text-xs text-slate-500 hover:text-indigo-600 font-medium flex items-center gap-1 transition-colors pl-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Admin Gateway
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-slate-100 grid grid-cols-3 gap-6 max-w-lg">
                <div>
                  <p className="text-2xl font-bold font-mono text-slate-900 tabular-nums">50</p>
                  <p className="text-xs text-slate-500 mt-0.5">CSE Classes (CSE-1 to 50)</p>
                </div>
                <div>
                  <p className="text-2xl font-bold font-mono text-slate-900 tabular-nums">3</p>
                  <p className="text-xs text-slate-500 mt-0.5">Campus Blocks (A, B, C)</p>
                </div>
                <div>
                  <p className="text-2xl font-bold font-mono text-slate-900 tabular-nums">&lt; 24h</p>
                  <p className="text-xs text-slate-500 mt-0.5">Target Response Window</p>
                </div>
              </div>
            </motion.div>

            {/* Right Column: High-Fidelity Campus & Classroom Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200/80 bg-slate-900 group">
                <img
                  src="/src/assets/images/campus_hero_building_1790521149511.jpg"
                  alt="Sapthagiri NPS University Campus Building"
                  referrerPolicy="no-referrer"
                  className="w-full h-80 sm:h-96 object-cover object-center group-hover:scale-102 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                
                {/* Overlay Card */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/60">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                      Sapthagiri NPS University
                    </span>
                    <span className="text-[11px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
                      Live Portal
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-snug">
                    Hesaraghatta Main Road, Chikkasandra, Bengaluru, Karnataka 560057
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5-Step Workflow Animation Section */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-indigo-600 tracking-wider uppercase">
              End-To-End Lifecycle
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
              From Report to Resolution in Five Smooth Steps
            </h2>
            <p className="text-sm text-slate-600 mt-3 leading-relaxed">
              Every maintenance request follows a transparent, auditable process with automated notifications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {steps.map((step, idx) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs relative flex flex-col justify-between hover:border-indigo-300 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-bold text-slate-400">
                      {step.number}
                    </span>
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                      {step.icon}
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {step.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {idx < steps.length - 1 && (
                  <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-slate-100 border border-slate-200 items-center justify-center text-slate-400">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Classroom Interior & Coverage Areas */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold text-indigo-600 tracking-wider uppercase">
                Facility Scope
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Designed specifically for modern engineering classrooms & labs
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Whether it is a high-speed projector in a seminar hall, ceiling fans in Block A,
                or network switches in the CSE computer laboratories, students can pinpoint
                issues with exact room identifiers and photographic records.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  'Automatic mapping to student’s registered CSE Class (CSE-1 to CSE-50)',
                  'Direct selection of Block A, Block B, or Block C infrastructure',
                  'High-resolution photo proof upload with client-side preview',
                  'Super Admin authority over department supervisors & technicians',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <button
                  onClick={() => onNavigate('register')}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  Create Student Account
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-slate-100">
                <img
                  src="/src/assets/images/classroom_interior_view_1790521165253.jpg"
                  alt="Sapthagiri NPS University Smart Classroom Interior"
                  referrerPolicy="no-referrer"
                  className="w-full h-80 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Campus Location Section (Sapthagiri NPS University) */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded">
                  <MapPin className="w-3.5 h-3.5" />
                  Campus Location
                </div>

                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Sapthagiri NPS University, Bengaluru
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  CampusFix serves the entire university campus infrastructure, covering academic lecture halls,
                  computer centers, seminar auditoriums, and laboratory complexes across Block A, Block B, and Block C.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs text-slate-700">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="font-semibold text-slate-900">Campus Address</p>
                    <p className="text-slate-500 mt-1 leading-normal">
                      14/5, Chikkasandra, Hesaraghatta Main Road, Bengaluru, Karnataka 560057
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="font-semibold text-slate-900">Department</p>
                    <p className="text-slate-500 mt-1 leading-normal">
                      Department of Computer Science & Engineering (Classes CSE-1 through CSE-50)
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-4">
                  <a
                    href="https://maps.app.goo.gl/DnbufzNnrV53t4417"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
                  >
                    <span>Open in Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={onOpenSQLModal}
                    className="text-xs text-slate-600 hover:text-slate-900 font-medium underline underline-offset-4"
                  >
                    View Database Schema & SQL
                  </button>
                </div>
              </div>

              {/* Interactive map card / visual representation */}
              <div className="lg:col-span-5">
                <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 h-64 flex flex-col justify-end p-5">
                  <iframe
                    title="Sapthagiri NPS University Location"
                    className="absolute inset-0 w-full h-full border-0 filter saturate-90 contrast-105"
                    src="https://maps.google.com/maps?q=Sapthagiri%20College%20of%20Engineering%20Bengaluru&t=&z=14&ie=UTF8&iwloc=&output=embed"
                    loading="lazy"
                  />
                  <div className="relative z-10 bg-white/95 backdrop-blur-xs p-3 rounded-lg shadow-md border border-white/80">
                    <p className="text-xs font-bold text-slate-900">
                      Sapthagiri NPS University Campus
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                      Bengaluru · Karnataka · India
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-900 text-sm">CampusFix</span>
            <span>·</span>
            <span>Sapthagiri NPS University, Bengaluru</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => onNavigate('landing')}
              className="hover:text-slate-900 transition-colors"
            >
              Overview
            </button>
            <button
              onClick={() => onNavigate('report')}
              className="hover:text-slate-900 transition-colors"
            >
              Report Issue
            </button>
            <button
              onClick={() => onNavigate('admin-login')}
              className="hover:text-slate-900 transition-colors"
            >
              Admin Portal
            </button>
            <button
              onClick={onOpenSQLModal}
              className="hover:text-slate-900 transition-colors"
            >
              SQL Script
            </button>
          </div>

          <p className="font-mono text-[11px] text-slate-400">
            Initial Admin: naveenkattimani326@gmail.com
          </p>
        </div>
      </footer>
    </div>
  );
};
