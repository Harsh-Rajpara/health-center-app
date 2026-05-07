import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addDoctor, updateDoctor, fetchDoctors } from '../../redux/slices/doctorSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { uploadImage } from "../../utils/uploadImage";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/config";

const Field = ({ label, required, children }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    {children}
  </div>
);

const inputClass = "w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all";

const AddDoctor = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { doctors } = useSelector(s => s.doctors);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [departments, setDepartments] = useState([]);
  const [fetchingDepartments, setFetchingDepartments] = useState(true);
  
  const [formData, setFormData] = useState({
    name: '', email: '', department: '', phone: '',
    address: '', experience: '', qualification: '', bio: '', img: ''
  });

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setFetchingDepartments(true);
        const snap = await getDoc(doc(db, "settings", "appointmentConfig"));
        if (snap.exists()) {
          const data = snap.data();
          setDepartments(data.departments || []);
        }
      } catch (err) {
        console.error("Error fetching departments:", err);
      } finally {
        setFetchingDepartments(false);
      }
    };
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (id) {
      const doc = doctors.find(d => d.id === id);
      if (doc) { 
        setFormData(doc); 
        setImagePreview(doc.img); 
      }
    }
  }, [id, doctors]);

  const handleChange = e => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setImagePreview(URL.createObjectURL(file));
    try {
      const url = await uploadImage(file);
      setFormData(p => ({ ...p, img: url }));
      setImagePreview(url);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (uploading) { alert("Image still uploading..."); return; }
    if (!formData.img) { alert("Please upload a doctor image"); return; }
    setLoading(true);
    try {
      if (id) await dispatch(updateDoctor({ id, ...formData }));
      else await dispatch(addDoctor(formData));
      navigate('/admin/doctors');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-7 space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/doctors')}
          className="w-9 h-9 flex items-center justify-center bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{id ? 'Edit Doctor' : 'Add New Doctor'}</h1>
          <p className="text-gray-500 text-sm mt-0.5">{id ? 'Update doctor information' : 'Fill in the details to add a new doctor'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Personal Information</h2>
        </div>
        <div className="p-6 grid grid-cols-2 gap-5">
          <Field label="Doctor Name" required>
            <input type="text" name="name" required value={formData.name} onChange={handleChange}
              placeholder="John Doe (without Dr.)" className={inputClass} />
          </Field>
          <Field label="Email Address" required>
            <input type="email" name="email" required value={formData.email} onChange={handleChange}
              placeholder="doctor@healthcenter.com" className={inputClass} />
          </Field>
          <Field label="Department" required>
            <select 
              name="department" 
              required 
              value={formData.department} 
              onChange={handleChange}
              disabled={fetchingDepartments}
              className={inputClass + " appearance-none cursor-pointer bg-white"}
            >
              <option value="">
                {fetchingDepartments ? "Loading departments..." : "Select Department"}
              </option>
              {departments.map((dept, index) => (
                <option key={index} value={dept}>{dept}</option>
              ))}
            </select>
            {departments.length === 0 && !fetchingDepartments && (
              <p className="text-amber-600 text-xs mt-1">No departments found. Please add departments in settings.</p>
            )}
          </Field>
          <Field label="Phone Number">
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
              placeholder="+91 98765 43210" className={inputClass} />
          </Field>
          <Field label="Years of Experience">
            <input type="text" name="experience" value={formData.experience} onChange={handleChange}
              placeholder="e.g. 10+ years" className={inputClass} />
          </Field>
          <Field label="Qualification">
            <input type="text" name="qualification" value={formData.qualification} onChange={handleChange}
              placeholder="MBBS, MD, PhD" className={inputClass} />
          </Field>
          <div className="col-span-2">
            <Field label="Address">
              <input type="text" name="address" value={formData.address} onChange={handleChange}
                placeholder="Clinic/Hospital Address" className={inputClass} />
            </Field>
          </div>
          <div className="col-span-2">
            <Field label="Bio / Description">
              <textarea name="bio" rows={4} value={formData.bio} onChange={handleChange}
                placeholder="Doctor's professional background and expertise..."
                className={inputClass + " resize-none"} />
            </Field>
          </div>

          <div className="col-span-2">
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">
              Profile Photo <span className="text-red-400">*</span>
            </label>
            <div className="flex items-start gap-5">
              {imagePreview ? (
                <div className="relative">
                  <img src={imagePreview} alt="preview" className="w-20 h-20 rounded-xl object-cover border border-gray-200" />
                  {uploading && (
                    <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-20 h-20 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center bg-gray-50">
                  <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              <div>
                <label className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  {imagePreview ? 'Change Photo' : 'Upload Photo'}
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
                {uploading && <p className="text-teal-600 text-xs mt-2 font-medium">Uploading...</p>}
                <p className="text-gray-400 text-xs mt-2">JPG, PNG up to 5MB</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 px-6 py-5 bg-gray-50 border-t border-gray-100">
          <button type="submit" disabled={loading || uploading}
            className="flex items-center gap-2 px-6 py-2.5 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 disabled:opacity-50 text-sm transition-colors shadow-sm">
            {loading
              ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
            }
            {id ? 'Update Doctor' : 'Add Doctor'}
          </button>
          <button type="button" onClick={() => navigate('/admin/doctors')}
            className="px-6 py-2.5 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 text-sm transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDoctor;