import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function HRDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('Attendance');
  const [leaveApplications, setLeaveApplications] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  
  // Employee Management State
  const [empForm, setEmpForm] = useState({
    name: '', email: '', department: '', position: '', salary: '', joinDate: '', phone: '', address: ''
  });
  const [loadingEmp, setLoadingEmp] = useState(false);

  // Announcements State
  const [announcementForm, setAnnouncementForm] = useState({
    title: '', message: '', target: 'All'
  });
  const [loadingAnnouncement, setLoadingAnnouncement] = useState(false);

  // Fetch all initial data
  const fetchHRData = async () => {
    try {
      const token = localStorage.getItem('token');
      const authHeader = { headers: { Authorization: `Bearer ${token}` } };

      const [leaveRes, empRes, attRes] = await Promise.allSettled([
        axios.get('http://localhost:5000/api/leaves', authHeader),
        axios.get('http://localhost:5000/api/employees', authHeader),
        axios.get('http://localhost:5000/api/attendance', authHeader)
      ]);

      if (leaveRes.status === 'fulfilled' && Array.isArray(leaveRes.value.data)) {
        setLeaveApplications(leaveRes.value.data);
      }
      if (empRes.status === 'fulfilled' && Array.isArray(empRes.value.data)) {
        setEmployees(empRes.value.data);
      }
      if (attRes.status === 'fulfilled' && Array.isArray(attRes.value.data)) {
        setAttendanceRecords(attRes.value.data);
      }
    } catch (err) {
      console.error('Error fetching HR dashboard data:', err);
    }
  };

  useEffect(() => {
    fetchHRData();
  }, []);

  // Handle Leave Status Update
  const handleUpdateStatus = async (leaveId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/api/leaves/${leaveId}`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchHRData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update leave status');
    }
  };

  // Handle Add Employee Submission
  const handleAddEmployee = async (e) => {
    e.preventDefault();
    setLoadingEmp(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/employees', empForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmpForm({ name: '', email: '', department: '', position: '', salary: '', joinDate: '', phone: '', address: '' });
      fetchHRData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add employee');
    } finally {
      setLoadingEmp(false);
    }
  };

  // Handle Delete Employee
  const handleDeleteEmployee = async (empId) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/employees/${empId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchHRData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete employee');
    }
  };

  // Handle Create Announcement Submission
  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    setLoadingAnnouncement(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/announcements', announcementForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnnouncementForm({ title: '', message: '', target: 'All' });
      alert('Announcement created successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create announcement');
    } finally {
      setLoadingAnnouncement(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-white flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <header className="w-full px-8 py-4 bg-[#0e1626] border-b border-gray-800/60 flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-tight text-white">HR Portal</h1>
        <button
          onClick={onLogout}
          className="bg-[#e6194b] hover:bg-[#d01440] text-white font-medium px-5 py-1.5 rounded-lg text-sm transition-colors duration-150 shadow-sm"
        >
          Logout
        </button>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-8 py-8 w-full flex-grow">
        <h2 className="text-2xl font-bold text-white mb-6">HR Dashboard</h2>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-800/80 mb-8">
          <nav className="flex space-x-8">
            {['Leave Applications', 'Employee Management', 'Announcements', 'Attendance'].map((tab) => (
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

        {/* TAB 1: LEAVE APPLICATIONS */}
        {activeTab === 'Leave Applications' && (
          <div className="bg-[#0e1626]/80 border border-gray-800/80 rounded-2xl p-6 overflow-hidden">
            <h3 className="text-lg font-semibold text-white mb-4">Leave Applications</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                    <th className="py-3 px-4 font-semibold">Employee</th>
                    <th className="py-3 px-4 font-semibold">Email</th>
                    <th className="py-3 px-4 font-semibold">Start Date</th>
                    <th className="py-3 px-4 font-semibold">End Date</th>
                    <th className="py-3 px-4 font-semibold">Reason</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60 text-sm">
                  {leaveApplications.length === 0 ? (
                    <tr className="hover:bg-[#0b1220]/50 transition">
                      <td className="py-4 px-4 text-white font-medium">Pravanshu Samadhiya</td>
                      <td className="py-4 px-4 text-gray-400">Pravanshu@gmail.com</td>
                      <td className="py-4 px-4 text-gray-300">11/5/2025</td>
                      <td className="py-4 px-4 text-gray-300">11/6/2025</td>
                      <td className="py-4 px-4 text-gray-300">I have to go for Office Meeting</td>
                      <td className="py-4 px-4 text-gray-300">Approved</td>
                      <td className="py-4 px-4 flex gap-2">
                        <button className="bg-[#bbf7d0] text-[#166534] font-semibold text-xs px-3 py-1 rounded-md">Approve</button>
                        <button className="border border-red-500/40 text-[#fca5a5] font-semibold text-xs px-3 py-1 rounded-md">Reject</button>
                      </td>
                    </tr>
                  ) : (
                    leaveApplications.map((app) => (
                      <tr key={app._id} className="hover:bg-[#0b1220]/50 transition">
                        <td className="py-4 px-4 text-white font-medium">{app.user?.name || 'Employee'}</td>
                        <td className="py-4 px-4 text-gray-400">{app.user?.email || 'email@domain.com'}</td>
                        <td className="py-4 px-4 text-gray-300">{new Date(app.startDate).toLocaleDateString()}</td>
                        <td className="py-4 px-4 text-gray-300">{new Date(app.endDate).toLocaleDateString()}</td>
                        <td className="py-4 px-4 text-gray-300">{app.reason}</td>
                        <td className="py-4 px-4 text-gray-300">{app.status || 'Pending'}</td>
                        <td className="py-4 px-4 flex gap-2">
                          <button 
                            onClick={() => handleUpdateStatus(app._id, 'Approved')}
                            className="bg-[#bbf7d0] text-[#166534] font-semibold text-xs px-3 py-1 rounded-md hover:opacity-90 transition"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(app._id, 'Rejected')}
                            className="border border-red-500/40 text-[#fca5a5] font-semibold text-xs px-3 py-1 rounded-md hover:bg-red-950/25 transition"
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: EMPLOYEE MANAGEMENT */}
        {activeTab === 'Employee Management' && (
          <div className="space-y-8">
            <div className="bg-[#0e1626]/80 border border-gray-800/80 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-5">Employee Management</h3>

              <form onSubmit={handleAddEmployee} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input 
                    type="text" required placeholder="Name" value={empForm.name}
                    onChange={(e) => setEmpForm({ ...empForm, name: e.target.value })}
                    className="bg-[#090d16] border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-blue-600 transition placeholder-gray-600"
                  />
                  <input 
                    type="email" required placeholder="Email" value={empForm.email}
                    onChange={(e) => setEmpForm({ ...empForm, email: e.target.value })}
                    className="bg-[#090d16] border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-blue-600 transition placeholder-gray-600"
                  />
                  <input 
                    type="text" required placeholder="Department" value={empForm.department}
                    onChange={(e) => setEmpForm({ ...empForm, department: e.target.value })}
                    className="bg-[#090d16] border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-blue-600 transition placeholder-gray-600"
                  />
                  <input 
                    type="text" required placeholder="Position" value={empForm.position}
                    onChange={(e) => setEmpForm({ ...empForm, position: e.target.value })}
                    className="bg-[#090d16] border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-blue-600 transition placeholder-gray-600"
                  />
                  <input 
                    type="number" required placeholder="Salary" value={empForm.salary}
                    onChange={(e) => setEmpForm({ ...empForm, salary: e.target.value })}
                    className="bg-[#090d16] border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-blue-600 transition placeholder-gray-600"
                  />
                  <input 
                    type="date" required placeholder="dd/mm/yyyy" value={empForm.joinDate}
                    onChange={(e) => setEmpForm({ ...empForm, joinDate: e.target.value })}
                    className="bg-[#090d16] border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-blue-600 transition"
                  />
                  <input 
                    type="text" required placeholder="Phone" value={empForm.phone}
                    onChange={(e) => setEmpForm({ ...empForm, phone: e.target.value })}
                    className="bg-[#090d16] border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-blue-600 transition placeholder-gray-600"
                  />
                  <input 
                    type="text" required placeholder="Address" value={empForm.address}
                    onChange={(e) => setEmpForm({ ...empForm, address: e.target.value })}
                    className="md:col-span-2 bg-[#090d16] border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-blue-600 transition placeholder-gray-600"
                  />
                </div>

                <button 
                  type="submit" disabled={loadingEmp}
                  className="w-full bg-[#e6194b] hover:bg-[#d01440] text-white font-semibold py-3 rounded-xl text-sm transition-all duration-150 shadow-md shadow-pink-600/20 disabled:opacity-50"
                >
                  {loadingEmp ? 'Adding...' : 'Add Employee'}
                </button>
              </form>
            </div>

            <div className="bg-[#0e1626]/80 border border-gray-800/80 rounded-2xl p-6 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                      <th className="py-3 px-3 font-semibold">Name</th>
                      <th className="py-3 px-3 font-semibold">Email</th>
                      <th className="py-3 px-3 font-semibold">Department</th>
                      <th className="py-3 px-3 font-semibold">Position</th>
                      <th className="py-3 px-3 font-semibold">Salary</th>
                      <th className="py-3 px-3 font-semibold">Join Date</th>
                      <th className="py-3 px-3 font-semibold">Phone</th>
                      <th className="py-3 px-3 font-semibold">Address</th>
                      <th className="py-3 px-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/60 text-sm">
                    {employees.map((emp) => (
                      <tr key={emp._id} className="hover:bg-[#0b1220]/50 transition">
                        <td className="py-4 px-3 text-white font-medium">{emp.name}</td>
                        <td className="py-4 px-3 text-gray-400">{emp.email}</td>
                        <td className="py-4 px-3 text-gray-300">{emp.department}</td>
                        <td className="py-4 px-3 text-gray-300">{emp.position}</td>
                        <td className="py-4 px-3 text-gray-300">₹{emp.salary}</td>
                        <td className="py-4 px-3 text-gray-300">{new Date(emp.joinDate).toLocaleDateString()}</td>
                        <td className="py-4 px-3 text-gray-300">{emp.phone}</td>
                        <td className="py-4 px-3 text-gray-300">{emp.address}</td>
                        <td className="py-4 px-3 flex gap-2">
                          <button className="bg-[#60a5fa] text-[#1e3a8a] font-semibold text-xs px-3 py-1 rounded-md">Edit</button>
                          <button onClick={() => handleDeleteEmployee(emp._id)} className="bg-[#fecaca] text-[#991b1b] font-semibold text-xs px-3 py-1 rounded-md">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ANNOUNCEMENTS */}
        {activeTab === 'Announcements' && (
          <div className="bg-[#0e1626]/80 border border-gray-800/80 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-5">Announcements</h3>

            <form onSubmit={handleCreateAnnouncement} className="space-y-4 max-w-4xl">
              <input 
                type="text" required placeholder="Title" value={announcementForm.title}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                className="w-full bg-[#090d16] border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-300 focus:outline-none focus:border-blue-600 transition placeholder-gray-600"
              />

              <textarea 
                rows="4" required placeholder="Message" value={announcementForm.message}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, message: e.target.value })}
                className="w-full bg-[#090d16] border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-300 focus:outline-none focus:border-blue-600 transition resize-none placeholder-gray-600"
              />

              <div className="flex items-center gap-4">
                <select 
                  value={announcementForm.target}
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, target: e.target.value })}
                  className="bg-[#090d16] border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-blue-600 transition w-40"
                >
                  <option value="All">All</option>
                  <option value="Employees">Employees Only</option>
                  <option value="Managers">Managers Only</option>
                </select>

                <button 
                  type="submit" disabled={loadingAnnouncement}
                  className="bg-[#e6194b] hover:bg-[#d01440] text-white font-semibold px-8 py-2.5 rounded-xl text-sm transition-all duration-150 shadow-md shadow-pink-600/20 disabled:opacity-50"
                >
                  {loadingAnnouncement ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 4: ATTENDANCE */}
        {activeTab === 'Attendance' && (
          <div className="bg-[#0e1626]/80 border border-gray-800/80 rounded-2xl p-6 overflow-hidden">
            <h3 className="text-lg font-semibold text-white mb-4">Attendance Records</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                    <th className="py-3 px-4 font-semibold">Employee</th>
                    <th className="py-3 px-4 font-semibold">Date</th>
                    <th className="py-3 px-4 font-semibold">Check In</th>
                    <th className="py-3 px-4 font-semibold">Check Out</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60 text-sm">
                  {attendanceRecords.length === 0 ? (
                    <>
                      <tr className="hover:bg-[#0b1220]/50 transition">
                        <td className="py-4 px-4 text-white font-medium">Pravanshu Samadhiya</td>
                        <td className="py-4 px-4 text-gray-300">11/4/2025</td>
                        <td className="py-4 px-4 text-gray-300">9:24:19 AM</td>
                        <td className="py-4 px-4 text-gray-300">10:07:23 AM</td>
                        <td className="py-4 px-4 text-gray-300">Present</td>
                      </tr>
                      <tr className="hover:bg-[#0b1220]/50 transition">
                        <td className="py-4 px-4 text-white font-medium">Pravanshu Samadhiya</td>
                        <td className="py-4 px-4 text-gray-300">11/3/2025</td>
                        <td className="py-4 px-4 text-gray-300">3:47:43 PM</td>
                        <td className="py-4 px-4 text-gray-300">3:47:54 PM</td>
                        <td className="py-4 px-4 text-gray-300">Present</td>
                      </tr>
                    </>
                  ) : (
                    attendanceRecords.map((att, idx) => (
                      <tr key={att._id || idx} className="hover:bg-[#0b1220]/50 transition">
                        <td className="py-4 px-4 text-white font-medium">{att.user?.name || 'Employee'}</td>
                        <td className="py-4 px-4 text-gray-300">{new Date(att.date).toLocaleDateString()}</td>
                        <td className="py-4 px-4 text-gray-300">{att.checkIn || '--:--'}</td>
                        <td className="py-4 px-4 text-gray-300">{att.checkOut || '--:--'}</td>
                        <td className="py-4 px-4 text-gray-300">{att.status || 'Present'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}