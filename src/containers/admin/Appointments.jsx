import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAppointments, updateAppointmentStatus } from "../../redux/slices/appointmentSlice";
import { getFunctions, httpsCallable } from "firebase/functions";

const STATUS_CONFIG = {
  approved: { label: "Approved", dot: "bg-teal-500", badge: "bg-teal-50 text-teal-700" },
  pending:   { label: "Pending",   dot: "bg-amber-500", badge: "bg-amber-50 text-amber-700" },
  rejected:  { label: "Rejected",  dot: "bg-red-500", badge: "bg-red-50 text-red-700" },
};

function AppointmentsAdmin() {
  const dispatch = useDispatch();
  const { appointments, loading } = useSelector((state) => state.appointments);
  const [showModal, setShowModal] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);

  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  const sendEmailViaCloudFunction = async (appointment, type, customMessage = '', rejectionReason = '') => {
    setSendingEmail(true);
    try {
      const functions = getFunctions();
      const sendEmail = httpsCallable(functions, 'sendAppointmentEmail');
      
      const result = await sendEmail({
        appointment,
        type,
        message: customMessage,
        reason: rejectionReason
      });
      
      return result.data;
    } catch (error) {
      console.error('Error sending email:', error);
      if (error.code === 'unauthenticated') {
        alert('Please log in again to continue');
      } else if (error.code === 'permission-denied') {
        alert('You do not have permission to send emails');
      } else {
        alert(`Failed to send email: ${error.message}`);
      }
      return { success: false, error: error.message };
    } finally {
      setSendingEmail(false);
    }
  };

  const handleApprove = async (appointment) => {
    try {
      const result = await sendEmailViaCloudFunction(appointment, 'approved', message);
      
      if (result.success) {
        await dispatch(updateAppointmentStatus({
          id: appointment.id,
          status: 'approved',
          customMessage: message
        })).unwrap();
        
        alert('✅ Appointment approved and email sent successfully!');
        setShowApproveModal(false);
        setMessage("");
      }
    } catch (error) {
      alert('❌ Failed to process approval. Please try again.');
    }
  };

  const handleReject = async (appointment) => {
    if (!reason) {
      alert('Please provide a reason for rejection');
      return;
    }

    try {
      const result = await sendEmailViaCloudFunction(appointment, 'rejected', '', reason);
      
      if (result.success) {
        await dispatch(updateAppointmentStatus({
          id: appointment.id,
          status: 'rejected',
          reason: reason
        })).unwrap();
        
        alert('❌ Appointment rejected and email sent successfully!');
        setShowModal(false);
        setReason("");
      }
    } catch (error) {
      alert('❌ Failed to process rejection. Please try again.');
    }
  };
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Appointment Management</h1>
        <p className="text-gray-500 text-sm mt-1">Manage appointments and send email notifications</p>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appointment</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {appointments.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                  No appointments found
                </td>
              </tr>
            ) : (
              appointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                        <span className="text-teal-600 font-medium">
                          {apt.fullName?.charAt(0) || 'P'}
                        </span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{apt.fullName}</p>
                        <p className="text-xs text-gray-500">ID: {apt.id?.slice(0, 8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">{apt.email}</p>
                    <p className="text-xs text-gray-500">{apt.phone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">{apt.date}</p>
                    <p className="text-xs text-gray-500">{apt.time}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${STATUS_CONFIG[apt.status]?.badge}`}>
                      {STATUS_CONFIG[apt.status]?.label || apt.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {apt.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedAppt(apt);
                            setShowApproveModal(true);
                          }}
                          disabled={sendingEmail}
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                          ✓ Approve
                        </button>
                        <button
                          onClick={() => {
                            setSelectedAppt(apt);
                            setShowModal(true);
                          }}
                          disabled={sendingEmail}
                          className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                          ✗ Reject
                        </button>
                      </div>
                    )}
                    {apt.status === 'approved' && (
                      <span className="text-green-600 text-sm">✓ Approved</span>
                    )}
                    {apt.status === 'rejected' && (
                      <span className="text-red-600 text-sm">✗ Rejected</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Approve Modal */}
      {showApproveModal && selectedAppt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Approve Appointment</h2>
              <button 
                onClick={() => setShowApproveModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <p className="text-sm"><strong>Patient:</strong> {selectedAppt.fullName}</p>
              <p className="text-sm"><strong>Email:</strong> {selectedAppt.email}</p>
              <p className="text-sm"><strong>Date:</strong> {selectedAppt.date}</p>
              <p className="text-sm"><strong>Time:</strong> {selectedAppt.time}</p>
            </div>
            
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Optional Message (will be included in email):
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add any special instructions or notes for the patient..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 mb-4"
              rows="3"
            />
            
            <div className="flex gap-2">
              <button
                onClick={() => setShowApproveModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleApprove(selectedAppt)}
                disabled={sendingEmail}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {sendingEmail ? 'Sending Email...' : 'Approve & Send Email'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showModal && selectedAppt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Reject Appointment</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <p className="text-sm"><strong>Patient:</strong> {selectedAppt.fullName}</p>
              <p className="text-sm"><strong>Email:</strong> {selectedAppt.email}</p>
              <p className="text-sm"><strong>Date:</strong> {selectedAppt.date}</p>
              <p className="text-sm"><strong>Time:</strong> {selectedAppt.time}</p>
            </div>
            
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Rejection Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please explain why the appointment is being rejected..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 mb-4"
              rows="3"
              required
            />
            
            <div className="flex gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(selectedAppt)}
                disabled={!reason || sendingEmail}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {sendingEmail ? 'Sending Email...' : 'Reject & Send Email'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AppointmentsAdmin;