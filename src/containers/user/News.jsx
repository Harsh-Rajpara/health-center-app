import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllNews } from '../../firebase/config';

const NewsModal = ({ item, onClose, current, total }) => {
  useEffect(() => {
    const handler = (e) => { 
      if (e.key === 'Escape') onClose(); 
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl overflow-hidden flex flex-col shadow-2xl"
        style={{ maxHeight: "90vh", background: "#1a1a1a" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hero Image */}
        <div
          className="relative flex-shrink-0"
          style={{
            height: "260px",
            background: item.image
              ? undefined
              : "linear-gradient(135deg, #b2f0e0 0%, #7dd9c0 40%, #4aab8a 100%)",
          }}
        >
          {item.image ? (
            <img
              src={item.image}
              alt={item.title || "News image"}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.style.background = "linear-gradient(135deg, #b2f0e0 0%, #7dd9c0 40%, #4aab8a 100%)";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg
                className="w-16 h-16 opacity-50"
                style={{ color: "#0f766e" }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
            </div>
          )}

          {/* Gradient */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to bottom, transparent 30%, rgba(26,26,26,0.85) 100%)",
            }}
          />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-white transition-colors"
            style={{ background: "rgba(255,255,255,0.15)" }}
            aria-label="Close modal"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Bottom badges */}
          <div className="absolute bottom-0 left-0 right-0 px-6 pb-4 flex items-end justify-between gap-3">
            <span
              className="inline-flex items-center gap-2 text-white text-xs font-medium px-4 py-2 rounded-full"
              style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}
            >
              <svg className="w-3.5 h-3.5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {item.date || "Recent"}
            </span>
          </div>
        </div>

        {/* Scrollable content */}
        <div
          className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-6"
          style={{ background: "#ffffff" }}
        >
          <h2 className="text-xl sm:text-2xl font-bold text-black leading-snug mb-4">
            {item.title}
          </h2>
          <div className="w-full h-px mb-5" style={{ background: "rgba(255,255,255,0.1)" }} />
          <p
            className="text-sm leading-relaxed break-words whitespace-pre-line"
            style={{ color: "#000000" }}
          >
            {item.content}
          </p>
        </div>
      </div>
    </div>
  );
};

const News = () => {
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await getAllNews();
        const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setNews(sorted);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const selected = selectedIndex !== null ? news[selectedIndex] : null;
  const handleOpen = (index) => setSelectedIndex(index);
  const handleClose = () => setSelectedIndex(null);
  const handlePrev = () => setSelectedIndex((i) => Math.max(0, i - 1));
  const handleNext = () => setSelectedIndex((i) => Math.min(news.length - 1, i + 1));

  // Function to handle image errors
  const handleImageError = (e) => {
    e.target.style.display = 'none';
    const parent = e.target.parentElement;
    if (parent) {
      parent.style.background = "linear-gradient(135deg, #b2f0e0 0%, #7dd9c0 40%, #4aab8a 100%)";
      parent.classList.add('flex', 'items-center', 'justify-center');
      
      // Add fallback icon
      const icon = document.createElement('div');
      icon.innerHTML = `<svg class="w-12 h-12 opacity-50" style="color: #0f766e" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>`;
      parent.appendChild(icon);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner with Back Button */}
      <div className="relative bg-teal-700 py-14 px-6 text-center">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-lg px-3 py-2 sm:px-4 sm:py-2 transition-all duration-200 flex items-center gap-2 backdrop-blur-sm"
          aria-label="Go back"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="hidden sm:inline text-sm font-medium">Back</span>
        </button>
        
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">Latest News</h1>
        <p className="text-teal-200 text-base max-w-xl mx-auto">
          Stay updated with the latest health information and medical advancements
        </p>
      </div>

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-12 py-12">
        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-24">
            <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
          </div>
        )}

        {/* Empty */}
        {!loading && news.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-teal-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">No news available yet</p>
            <p className="text-gray-400 text-sm mt-2">Check back later for updates</p>
          </div>
        )}

        {/* Content */}
        {!loading && news.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {news.slice(0).map((item, i) => (
              <div
                key={item.id || i}
                onClick={() => handleOpen(i)}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-lg transition-all duration-300"
              >
                <div className="h-48 overflow-hidden bg-teal-50 relative">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title || "News image"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={handleImageError}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center">
                      <svg className="w-12 h-12 opacity-40" style={{ color: "#0f766e" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-1.5 text-teal-600 text-xs font-semibold mb-2">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {item.date || "Recent"}
                  </div>
                  <h3 className="font-bold text-gray-900 text-base leading-snug mb-2 group-hover:text-teal-600 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                    {item.content}
                  </p>
                  <div className="mt-3 flex items-center gap-1 text-teal-600 text-xs font-semibold">
                    Read more
                    <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <NewsModal
        item={selected}
        onClose={handleClose}
        current={selectedIndex + 1}
        total={news.length}
      />
    </div>
  );
};

export default News;