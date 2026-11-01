import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ManagerDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('Training & Development');
  const [leaves, setLeaves] = useState([]);
  const [trainings, setTrainings] = useState([]);

  // Training Form State
  const [trainingForm, setTrainingForm] = useState({
    title: '',
    date: '',
    description: '',
    trainer: '',
    assignedTo: ''
  });
  const [loadingTraining, setLoadingTraining] = useState(false);

  // Fetch Manager Dashboard data
  const fetchManagerData = async () => {
    try {
      const token = localStorage.getItem('token');
      const authHeader = { headers: { Authorization: `Bearer ${token}` } };

      const [leaveRes, trainRes] = await Promise.allSettled([
        axios.get('http://localhost:5000/api/leaves', authHeader),
        axios.get('http://localhost:5000/api/trainings', authHeader)
      ]);

      if (leaveRes.status === 'fulfilled' && Array.isArray(leaveRes.value.data)) {
        setLeaves(leaveRes.value.data);
      }
      if (trainRes.status === 'fulfilled' && Array.isArray(trainRes.value.data)) {
        setTrainings(trainRes.value.data);
      }
    } catch (err) {
      console.error('Error fetching manager data:', err);
    }
  };

  useEffect(() => {
    fetchManagerData();
  }, []);

  // Handle Create Training Submission
  const handleCreateTraining = async (e) => {
    e.preventDefault();
    setLoadingTraining(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/trainings', trainingForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTrainingForm({ title: '', date: '', description: '', trainer: '', assignedTo: '' });
      fetchManagerData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create training session');
    } finally {
      setLoadingTraining(false);
    }
  };

  // Handle Delete Training
  const handleDeleteTraining = async (trainingId) => {
    if (!window.confirm('Are you sure you want to delete this training session?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/trainings/${trainingId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchManagerData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete training');
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-white flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <header className="w-full px-8 py-4 bg-[#0e1626] border-b border-gray-800/60 flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-tight text-white">Manager Dashboard</h1>
        <button
          onClick={onLogout}
          className="bg-[#e6194b] hover:bg-[#d01440] text-white font-medium px-5 py-1.5 rounded-lg text-sm transition-colors duration-150 shadow-sm"
        >
          Logout
        </button>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-8 py-8 w-full flex-grow">
        <h2 className="text-xl font-semibold text-white text-center mb-6">Welcome Back, Manager</h2>

        {/* Navigation Tabs */}
        <div className="flex space-x-3 mb-8">
          <button
            onClick={() => setActiveTab('Leave Applications')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === 'Leave Applications'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-[#0e1626] text-gray-400 hover:text-white border border-gray-800'
            }`}
          >
            Leave Applications
          </button>
          <button
            onClick={() => setActiveTab('Training & Development')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === 'Training & Development'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-[#0e1626] text-gray-400 hover:text-white border border-gray-800'
            }`}
          >
            Training & Development
          </button>
        </div>

        {/* TAB 1: LEAVE APPLICATIONS */}
        {activeTab === 'Leave Applications' && (
          <div className="bg-[#0e1626]/80 border border-gray-800/80 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Leave Applications</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {leaves.length === 0 ? (
                <>
                  <div className="bg-[#090d16] border border-gray-800/80 rounded-xl p-5 text-sm space-y-1.5 text-gray-300">
                    <p><strong className="text-white">Employee:</strong> Pravanshu Samadhiya</p>
                    <p className="text-gray-400 text-xs">(Pravanshu@gmail.com)</p>
                    <p className="pt-2"><strong className="text-white">From:</strong> 11/5/2025</p>
                    <p><strong className="text-white">To:</strong> 11/6/2025</p>
                    <p className="pt-2"><strong className="text-white">Reason:</strong> I have to go for Office Meeting</p>
                    <p className="pt-2"><strong className="text-emerald-400">Status: Approved</strong></p>
                    <p className="text-gray-400 text-xs">Approved/Rejected By: HR</p>
                  </div>

                  <div className="bg-[#090d16] border border-gray-800/80 rounded-xl p-5 text-sm space-y-1.5 text-gray-300">
                    <p><strong className="text-white">Employee:</strong> Pravanshu Samadhiya</p>
                    <p className="text-gray-400 text-xs">(Pravanshu@gmail.com)</p>
                    <p className="pt-2"><strong className="text-white">From:</strong> 11/10/2025</p>
                    <p><strong className="text-white">To:</strong> 11/12/2025</p>
                    <p className="pt-2"><strong className="text-white">Reason:</strong> Family function at hometown</p>
                    <p className="pt-2"><strong className="text-red-400">Status: Rejected</strong></p>
                    <p className="text-gray-400 text-xs">Approved/Rejected By: HR</p>
                  </div>
                </>
              ) : (
                leaves.map((leave, idx) => (
                  <div key={leave._id || idx} className="bg-[#090d16] border border-gray-800/80 rounded-xl p-5 text-sm space-y-1.5 text-gray-300">
                    <p><strong className="text-white">Employee:</strong> {leave.user?.name || 'Employee'}</p>
                    <p className="text-gray-400 text-xs">({leave.user?.email || 'email@domain.com'})</p>
                    <p className="pt-2"><strong className="text-white">From:</strong> {new Date(leave.startDate).toLocaleDateString()}</p>
                    <p><strong className="text-white">To:</strong> {new Date(leave.endDate).toLocaleDateString()}</p>
                    <p className="pt-2"><strong className="text-white">Reason:</strong> {leave.reason}</p>
                    <p className="pt-2">
                      <strong className={leave.status === 'Approved' ? 'text-emerald-400' : leave.status === 'Rejected' ? 'text-red-400' : 'text-amber-400'}>
                        Status: {leave.status || 'Pending'}
                      </strong>
                    </p>
                    <p className="text-gray-400 text-xs">Approved/Rejected By: HR</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 2: TRAINING & DEVELOPMENT */}
        {activeTab === 'Training & Development' && (
          <div className="space-y-8">
            <div className="bg-[#0e1626]/80 border border-gray-800/80 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-5">Training & Development</h3>

              <form onSubmit={handleCreateTraining} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    type="text" required placeholder="Training Title" value={trainingForm.title}
                    onChange={(e) => setTrainingForm({ ...trainingForm, title: e.target.value })}
                    className="bg-[#090d16] border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-blue-600 transition placeholder-gray-600"
                  />
                  <input 
                    type="date" required placeholder="dd/mm/yyyy" value={trainingForm.date}
                    onChange={(e) => setTrainingForm({ ...trainingForm, date: e.target.value })}
                    className="bg-[#090d16] border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-blue-600 transition"
                  />
                </div>

                <textarea 
                  rows="3" required placeholder="Description" value={trainingForm.description}
                  onChange={(e) => setTrainingForm({ ...trainingForm, description: e.target.value })}
                  className="w-full bg-[#090d16] border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-300 focus:outline-none focus:border-blue-600 transition resize-none placeholder-gray-600"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    type="text" required placeholder="Trainer Name" value={trainingForm.trainer}
                    onChange={(e) => setTrainingForm({ ...trainingForm, trainer: e.target.value })}
                    className="bg-[#090d16] border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-blue-600 transition placeholder-gray-600"
                  />
                  <input 
                    type="text" placeholder="Assign To (Employee ID)" value={trainingForm.assignedTo}
                    onChange={(e) => setTrainingForm({ ...trainingForm, assignedTo: e.target.value })}
                    className="bg-[#090d16] border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-blue-600 transition placeholder-gray-600"
                  />
                </div>

                <button 
                  type="submit" disabled={loadingTraining}
                  className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold py-3 rounded-xl text-sm transition-all duration-150 shadow-md shadow-blue-600/20 disabled:opacity-50"
                >
                  {loadingTraining ? 'Creating...' : 'Create Training'}
                </button>
              </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {trainings.length === 0 ? (
                <div className="bg-[#0e1626]/80 border border-gray-800/80 rounded-2xl p-5 text-sm space-y-2 text-gray-300">
                  <h4 className="font-semibold text-white text-base">MongoDB CRUD</h4>
                  <p className="text-gray-400 text-xs">This Training Session is based on the MongoDB CRUD Operation.</p>
                  <p className="pt-2"><strong className="text-white">Date:</strong> 5/11/2025</p>
                  <p><strong className="text-white">Trainer:</strong> Adnan Saif</p>
                  <p><strong className="text-white">Assigned To:</strong> N/A</p>
                  <div className="flex gap-2 pt-3">
                    <button className="bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs px-4 py-1.5 rounded-lg transition">Edit</button>
                    <button className="bg-[#e6194b] hover:bg-[#d01440] text-white font-semibold text-xs px-4 py-1.5 rounded-lg transition">Delete</button>
                  </div>
                </div>
              ) : (
                trainings.map((t, idx) => (
                  <div key={t._id || idx} className="bg-[#0e1626]/80 border border-gray-800/80 rounded-2xl p-5 text-sm space-y-2 text-gray-300">
                    <h4 className="font-semibold text-white text-base">{t.title}</h4>
                    <p className="text-gray-400 text-xs">{t.description}</p>
                    <p className="pt-2"><strong className="text-white">Date:</strong> {new Date(t.date).toLocaleDateString()}</p>
                    <p><strong className="text-white">Trainer:</strong> {t.trainer}</p>
                    <p><strong className="text-white">Assigned To:</strong> {t.assignedTo || 'N/A'}</p>
                    <div className="flex gap-2 pt-3">
                      <button className="bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs px-4 py-1.5 rounded-lg transition">Edit</button>
                      <button onClick={() => handleDeleteTraining(t._id)} className="bg-[#e6194b] hover:bg-[#d01440] text-white font-semibold text-xs px-4 py-1.5 rounded-lg transition">Delete</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}