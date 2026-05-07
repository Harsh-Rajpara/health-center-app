import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNews, addNews, updateNews, deleteNews } from "../../redux/slices/newsSlice";
import { uploadImage } from "../../utils/uploadImage";

function NewsAdmin() {
  const dispatch = useDispatch();
  const { news, loading, error } = useSelector(s => s.news);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({ title: "", content: "", date: "", image: "" });
  
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null, title: "" });

  useEffect(() => { dispatch(fetchNews()); }, [dispatch]);

  const openAdd = () => {
    setEditingNews(null);
    setFormData({
      title: "", content: "",
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      image: ""
    });
    setOpenDialog(true);
  };

  const openEdit = (item) => {
    setEditingNews(item);
    setFormData(item);
    setOpenDialog(true);
  };

  const closeDialog = () => {
    setOpenDialog(false);
    setEditingNews(null);
    setFormData({ title: "", content: "", date: "", image: "" });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setFormData(p => ({ ...p, image: url }));
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = () => {
    if (uploading) { alert("Image still uploading..."); return; }
    if (!formData.title || !formData.content) { alert("Title and content are required"); return; }
    if (!formData.image) { alert("Please upload an image"); return; }
    if (editingNews) dispatch(updateNews({ ...formData, id: editingNews.id }));
    else dispatch(addNews(formData));
    closeDialog();
  };

  const handleDeleteClick = (id, title) => {
    setDeleteConfirm({ open: true, id, title });
  };

  const confirmDelete = () => {
    if (deleteConfirm.id) {
      dispatch(deleteNews(deleteConfirm.id));
    }
    setDeleteConfirm({ open: false, id: null, title: "" });
  };

  const cancelDelete = () => {
    setDeleteConfirm({ open: false, id: null, title: "" });
  };

  if (loading) return (
    <div className="flex justify-center items-center h-96">
      <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <div className="m-7 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">{error}</div>
  );

  return (
    <div className="p-7 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">News Management</h1>
          <p className="text-gray-500 text-sm mt-0.5">Create and manage health news</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2.5 rounded-xl hover:bg-teal-700 font-semibold text-sm transition-colors shadow-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add News
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Image", "Title & Preview", "Date", "Actions"].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {news.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-16 text-center">
                    <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-sm font-medium">No news articles yet</p>
                  </td>
                </tr>
              ) : news.map(item => (
                <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-5 py-4">
                    {item.image
                      ? <img src={item.image} alt={item.title} className="w-14 h-14 object-cover rounded-xl border border-gray-100" />
                      : <div className="w-14 h-14 bg-teal-50 rounded-xl flex items-center justify-center">
                          <svg className="w-6 h-6 text-teal-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                          </svg>
                        </div>
                    }
                  </td>
                  <td className="px-5 py-4 max-w-xs">
                    <p className="font-semibold text-gray-900 text-sm truncate">{item.title}</p>
                    <p className="text-gray-400 text-xs mt-0.5 line-clamp-1">{item.content?.substring(0, 80)}...</p>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 text-gray-500 text-xs font-medium">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {item.date}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(item)}
                        className="p-1.5 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors" title="Edit">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button onClick={() => handleDeleteClick(item.id, item.title)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/*News Modal */}
      {openDialog && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" style={{ margin: 0, padding: '1rem' }}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" style={{ margin: 0, padding: '1rem' }}>
            <div className="p-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="font-bold text-gray-900">{editingNews ? "Edit News" : "Add News"}</h2>
              <button onClick={closeDialog}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">Title *</label>
                <input type="text" placeholder="News title" value={formData.title}
                  onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">Content *</label>
                <textarea rows={5} placeholder="News content..." value={formData.content}
                  onChange={e => setFormData(p => ({ ...p, content: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">Image *</label>
                <div className="flex items-center gap-4">
                  {formData.image && (
                    <img src={formData.image} alt="preview" className="w-16 h-16 object-cover rounded-xl border border-gray-100" />
                  )}
                  <label className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    {formData.image ? 'Change Image' : 'Upload Image'}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                  {uploading && <span className="text-teal-600 text-xs font-medium">Uploading...</span>}
                </div>
              </div>
            </div>
            <div className="flex gap-3 p-5 pt-0">
              <button onClick={handleSubmit}
                className="flex-1 bg-teal-600 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-teal-700 transition-colors">
                {editingNews ? "Save Changes" : "Publish News"}
              </button>
              <button onClick={closeDialog}
                className="px-5 border border-gray-200 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteConfirm.open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4" style={{ margin: 0, padding: '1rem' }}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                
                <h3 className="text-xl font-bold text-gray-900">Delete News</h3>
              </div>
            </div>
            
            {/* Body */}
            <div className="p-8">
              <p className="text-gray-700 text-base text-center leading-relaxed">
                Are you sure you want to delete?
              </p>
              
            </div>
            
            {/* Footer */}
            <div className="flex gap-3 p-5 pt-0">
              <button onClick={confirmDelete}
                className="flex-1 bg-red-500 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-red-600 transition-colors">
                Delete
              </button>
              <button onClick={cancelDelete}
                className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NewsAdmin;