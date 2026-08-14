"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Settings, Save, CheckCircle2, Shield, Bell, Lock, Globe } from "lucide-react";

export default function ApplicationSettings() {
  const [institutionName, setInstitutionName] = useState("OnnoRokom School & College");
  const [academicSession, setAcademicSession] = useState("2026-2027");
  const [passingPercentage, setPassingPercentage] = useState(40);
  const [allowLateSubmissions, setAllowLateSubmissions] = useState(false);
  const [enableEmailNotifications, setEnableEmailNotifications] = useState(true);
  const [savedMsg, setSavedMsg] = useState(false);

  useEffect(() => {
    const savedSettings = localStorage.getItem("app_settings");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        if (parsed.institutionName) setInstitutionName(parsed.institutionName);
        if (parsed.academicSession) setAcademicSession(parsed.academicSession);
        if (parsed.passingPercentage) setPassingPercentage(parsed.passingPercentage);
        if (parsed.allowLateSubmissions !== undefined) setAllowLateSubmissions(parsed.allowLateSubmissions);
        if (parsed.enableEmailNotifications !== undefined) setEnableEmailNotifications(parsed.enableEmailNotifications);
      } catch (err) {
        console.error("Failed to parse settings", err);
      }
    }
  }, []);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const settings = {
      institutionName,
      academicSession,
      passingPercentage,
      allowLateSubmissions,
      enableEmailNotifications,
    };
    localStorage.setItem("app_settings", JSON.stringify(settings));
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 text-purple-700 p-2 rounded-lg">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Application Settings</h1>
              <p className="text-xs text-gray-500">Manage system configurations, policies, and academic defaults</p>
            </div>
          </div>
          <Link href="/admin" className="text-blue-600 font-semibold hover:underline">&larr; Back to Dashboard</Link>
        </div>

        {savedMsg && (
          <div className="p-4 bg-green-50 text-green-800 border border-green-200 rounded-xl text-sm font-medium flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span>Application settings updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSaveSettings} className="space-y-6">
          {/* General System Info */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-lg font-bold text-gray-900 border-b pb-2 flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-600" /> General Configuration
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Institution Name</label>
                <input
                  type="text"
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded-lg text-sm text-gray-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Active Academic Session</label>
                <input
                  type="text"
                  value={academicSession}
                  onChange={(e) => setAcademicSession(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded-lg text-sm text-gray-900 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Academic & Submission Policies */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-lg font-bold text-gray-900 border-b pb-2 flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-600" /> Submission & Evaluation Policies
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Default Passing Mark (%)</label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={passingPercentage}
                  onChange={(e) => setPassingPercentage(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 border rounded-lg text-sm text-gray-900 bg-white"
                />
              </div>

              <div className="flex items-center space-x-3 pt-4">
                <input
                  type="checkbox"
                  id="allowLate"
                  checked={allowLateSubmissions}
                  onChange={(e) => setAllowLateSubmissions(e.target.checked)}
                  className="w-4 h-4 text-purple-600 rounded"
                />
                <label htmlFor="allowLate" className="text-sm font-medium text-gray-800">
                  Allow Late Submissions After Deadline
                </label>
              </div>
            </div>
          </div>

          {/* Notifications & System Switches */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-lg font-bold text-gray-900 border-b pb-2 flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-600" /> Notifications & Alerts
            </h2>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="enableNotify"
                checked={enableEmailNotifications}
                onChange={(e) => setEnableEmailNotifications(e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded"
              />
              <label htmlFor="enableNotify" className="text-sm font-medium text-gray-800">
                Enable System Email Notifications for Assignment Releases & Grading
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="inline-flex items-center space-x-2 bg-purple-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-purple-700 transition shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </form>
      </div>
    </div>
  );
}
