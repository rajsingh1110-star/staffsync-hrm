import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function EmployeeDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('Profile');
  const [announcements, setAnnouncements] = useState([]);
  const [trainings, setTrainings] = useState([]);
  
  // Leaves state
  const [leaves, setLeaves] = useState([]);
  const [leaveData, setLeaveData] = useState({ startDate: '', endDate: '', reason: '' });
  const [loadingLeave, setLoadingLeave] = useState(false);

  // Attendance state
  const [attendanceList, setAttendanceList] = useState([]);

  // Fetch all dashboard data from backend
  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const authHeader = { headers: { Authorization: `Bearer ${token}` } };

      const [annRes, trainRes, leaveRes, attRes] = await Promise.allSettled([
        axios.get('http://localhost:5000/api/announcements', authHeader),
        axios.get('http://localhost:5000/api/trainings', authHeader),
        axios.get('http://localhost:5000/api/leaves', authHeader),
        axios.get('http://localhost:5000/api/attendance', authHeader)
      ]);

      if (annRes.status === 'fulfilled' && Array.isArray(annRes.value.data)) {
        setAnnouncements(annRes.value.data);
      }
      if (trainRes.status === 'fulfilled' && Array.isArray(trainRes.value.data)) {
        setTrainings(trainRes.value.data);
      }
      if (leaveRes.status === 'fulfilled' && Array.isArray(leaveRes.value.data)) {
        setLeaves(leaveRes.value.data);
      }
      if (attRes.status === 'fulfilled' && Array.isArray(attRes.value.data)) {
        setAttendanceList(attRes.value.data);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Handle Leave Submission
  const handleApplyLeave = async (e) => {
    e.preventDefault();
    setLoadingLeave(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/leaves', leaveData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeaveData({ startDate: '', endDate: '', reason: '' });
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit leave request');
    } finally {
      setLoadingLeave(false);
    }
  };

  // Date formatter matching screenshot format
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-white flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <header className="w-full px-8 py-4 bg-[#0e1626] border-b border-gray-800/60 flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-tight text-white">Employee Portal</h1>
        <button
          onClick={onLogout}
          className="bg-[#e6194b] hover:bg-[#d01440] text-white font-medium px-5 py-1.5 rounded-lg text-sm transition-colors duration-150 shadow-sm"
        >
          Logout
        </button>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-8 py-8 w-full flex-grow">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-800/80 mb-8">
          <nav className="flex space-x-8">
            {['Announcements', 'Leaves', 'Attendance', 'Profile'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 px-1 text-sm font-medium transition-all duration-150 relative ${
                  activeTab === tab
                    ? 'text-white border-b-2 border-[#e6194b]'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* TAB 1: ANNOUNCEMENTS */}
        {activeTab === 'Announcements' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#0e1626]/80 border border-gray-800/80 rounded-2xl p-6 min-h-[220px]">
              <h2 className="text-lg font-semibold text-white mb-4">Announcements</h2>
              {announcements.length === 0 ? (
                <p className="text-gray-400 text-sm">No announcements available.</p>
              ) : (
                <div className="space-y-4">
                  {announcements.map((item, idx) => (
                    <div key={item._id || idx} className="bg-[#090d16] border border-gray-800 p-4 rounded-xl">
                      <h4 className="font-semibold text-white text-sm">{item.title}</h4>
                      <p className="text-gray-400 text-xs mt-1">{item.content || item.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-[#0e1626]/80 border border-gray-800/80 rounded-2xl p-6 min-h-[220px]">
              <h2 className="text-lg font-semibold text-white mb-4">Trainings</h2>
              {trainings.length === 0 ? (
                <div className="bg-[#090d16]/90 border border-gray-800/80 p-4 rounded-xl">
                  <h3 className="font-semibold text-white text-base">MongoDB CRUD</h3>
                  <p className="text-gray-400 text-xs mt-1">
                    This Training Session is based on the MongoDB CRUD Operation.
                  </p>
                  <div className="mt-3 text-xs text-gray-500 space-y-0.5">
                    <p>Trainer: Adnan Saif</p>
                    <p>Date: 05 Nov 2025</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {trainings.map((t, idx) => (
                    <div key={t._id || idx} className="bg-[#090d16]/90 border border-gray-800/80 p-4 rounded-xl">
                      <h3 className="font-semibold text-white text-base">{t.title || t.topic}</h3>
                      <p className="text-gray-400 text-xs mt-1">{t.description}</p>
                      <div className="mt-3 text-xs text-gray-500 space-y-0.5">
                        <p>Trainer: {t.trainer || 'Adnan Saif'}</p>
                        <p>Date: {t.date ? formatDate(t.date) : '05 Nov 2025'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: LEAVES */}
        {activeTab === 'Leaves' && (
          <div className="space-y-6">
            <div className="bg-[#0e1626]/80 border border-gray-800/80 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-5">Apply for Leave</h2>
              
              <form onSubmit={handleApplyLeave} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">Start Date</label>
                    <input 
                      type="date"
                      required
                      value={leaveData.startDate}
                      onChange={(e) => setLeaveData({ ...leaveData, startDate: e.target.value })}
                      className="w-full bg-[#090d16] border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-blue-600 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">End Date</label>
                    <input 
                      type="date"
                      required
                      value={leaveData.endDate}
                      onChange={(e) => setLeaveData({ ...leaveData, endDate: e.target.value })}
                      className="w-full bg-[#090d16] border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-blue-600 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">Reason</label>
                  <textarea 
                    rows="3"
                    required
                    placeholder="Reason for leave"
                    value={leaveData.reason}
                    onChange={(e) => setLeaveData({ ...leaveData, reason: e.target.value })}
                    className="w-full bg-[#090d16] border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-300 focus:outline-none focus:border-blue-600 transition resize-none placeholder-gray-600"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={loadingLeave}
                  className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold py-3 rounded-xl text-sm transition-all duration-150 shadow-md shadow-blue-600/20 disabled:opacity-50"
                >
                  {loadingLeave ? 'Applying...' : 'Apply Leave'}
                </button>
              </form>
            </div>

            <div className="bg-[#0e1626]/80 border border-gray-800/80 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">My Leaves</h2>
              <div className="space-y-3">
                {leaves.length === 0 ? (
                  <>
                    <div className="bg-[#090d16] border border-gray-800/80 rounded-xl p-4 flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold text-white text-sm">05 Nov 2025 → 06 Nov 2025</h4>
                        <p className="text-gray-400 text-xs mt-1">I have to go for Office Meeting</p>
                      </div>
                      <span className="bg-[#bbf7d0] text-[#166534] font-semibold text-xs px-3 py-1 rounded-md">Approved</span>
                    </div>
                    <div className="bg-[#090d16] border border-gray-800/80 rounded-xl p-4 flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold text-white text-sm">10 Nov 2025 → 12 Nov 2025</h4>
                        <p className="text-gray-400 text-xs mt-1">Family function at hometown</p>
                      </div>
                      <span className="bg-[#fecaca] text-[#991b1b] font-semibold text-xs px-3 py-1 rounded-md">Rejected</span>
                    </div>
                  </>
                ) : (
                  leaves.map((leave, idx) => (
                    <div key={leave._id || idx} className="bg-[#090d16] border border-gray-800/80 rounded-xl p-4 flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold text-white text-sm">
                          {formatDate(leave.startDate)} → {formatDate(leave.endDate)}
                        </h4>
                        <p className="text-gray-400 text-xs mt-1">{leave.reason}</p>
                      </div>
                      <span className={`font-semibold text-xs px-3 py-1 rounded-md ${
                        leave.status === 'Approved' ? 'bg-[#bbf7d0] text-[#166534]' :
                        leave.status === 'Rejected' ? 'bg-[#fecaca] text-[#991b1b]' :
                        'bg-amber-200 text-amber-800'
                      }`}>
                        {leave.status || 'Pending'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ATTENDANCE */}
        {activeTab === 'Attendance' && (
          <div className="bg-[#0e1626]/80 border border-gray-800/80 rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold text-white">Attendance</h2>
              <span className="bg-[#064e3b] text-[#34d399] border border-[#047857]/50 font-semibold text-xs px-4 py-1.5 rounded-lg">
                Checked Out
              </span>
            </div>

            <div className="space-y-3">
              {attendanceList.length === 0 ? (
                <>
                  <div className="bg-[#090d16] border border-gray-800/80 rounded-xl p-4 flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-white text-sm">04 Nov 2025</h4>
                      <p className="text-gray-400 text-xs mt-1">In: 9:24:19 AM | Out: 10:07:23 AM</p>
                    </div>
                    <span className="bg-[#bbf7d0] text-[#166534] font-semibold text-xs px-3 py-1 rounded-md">Present</span>
                  </div>
                  <div className="bg-[#090d16] border border-gray-800/80 rounded-xl p-4 flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-white text-sm">03 Nov 2025</h4>
                      <p className="text-gray-400 text-xs mt-1">In: 3:47:43 PM | Out: 3:47:54 PM</p>
                    </div>
                    <span className="bg-[#bbf7d0] text-[#166534] font-semibold text-xs px-3 py-1 rounded-md">Present</span>
                  </div>
                </>
              ) : (
                attendanceList.map((att, idx) => (
                  <div key={att._id || idx} className="bg-[#090d16] border border-gray-800/80 rounded-xl p-4 flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-white text-sm">{formatDate(att.date)}</h4>
                      <p className="text-gray-400 text-xs mt-1">
                        In: {att.checkIn || '--:--'} | Out: {att.checkOut || '--:--'}
                      </p>
                    </div>
                    <span className="bg-[#bbf7d0] text-[#166534] font-semibold text-xs px-3 py-1 rounded-md">
                      {att.status || 'Present'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 4: PROFILE */}
        {activeTab === 'Profile' && (
          <div className="bg-[#0e1626]/80 border border-gray-800/80 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-6">My Profile</h2>
            <div className="space-y-3 text-sm">
              <p className="text-gray-300">
                <strong className="text-gray-400 font-normal">Name:</strong> <span className="text-white ml-2">{user?.name || 'John Doe'}</span>
              </p>
              <p className="text-gray-300">
                <strong className="text-gray-400 font-normal">Email:</strong> <span className="text-white ml-2">{user?.email || 'johndoe@email.com'}</span>
              </p>
              <p className="text-gray-300">
                <strong className="text-gray-400 font-normal">Role:</strong> <span className="text-white ml-2">{user?.role || 'Employee'}</span>
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}