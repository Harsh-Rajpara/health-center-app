import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllNews } from "../../firebase/config";

const NewsModal = ({ item, onClose, current, total }) => {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
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

          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, transparent 30%, rgba(26,26,26,0.85) 100%)",
            }}
          />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-white transition-colors"
            style={{ background: "rgba(255,255,255,0.15)" }}
            aria-label="Close modal"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Bottom badges */}
          <div className="absolute bottom-0 left-0 right-0 px-6 pb-4 flex items-end justify-between gap-3">
            <span
              className="inline-flex items-center gap-2 text-white text-xs font-medium px-4 py-2 rounded-full"
              style={{
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <svg
                className="w-3.5 h-3.5 opacity-80"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
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
          <div
            className="w-full h-px mb-5"
            style={{ background: "rgba(255,255,255,0.1)" }}
          />
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

const NewsSection = () => {
  const [news, setNews] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const data = await getAllNews();
        const sorted = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
        setNews(sorted.slice(0, 3));
      } catch (err) {
        console.error("Error fetching news:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []); // Empty dependency array is fine here

  const selected = selectedIndex !== null ? news[selectedIndex] : null;
  const handleOpen = (i) => setSelectedIndex(i);
  const handleClose = () => setSelectedIndex(null);
  const handlePrev = () => setSelectedIndex((i) => Math.max(0, i - 1));
  const handleNext = () =>
    setSelectedIndex((i) => Math.min(news.length - 1, i + 1));

  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 text-center">
          <div className="inline-block w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-88xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
            Latest News
          </h2>
          <div className="w-12 h-1 bg-teal-600 mx-auto rounded-full" />
        </div>

        {/* Grid */}
        {news.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item, i) => (
              <div
                key={item.id || i}
                onClick={() => handleOpen(i)}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 border border-gray-100"
              >
                <div className="relative h-56 overflow-hidden bg-teal-50">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title || "News image"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.parentElement.style.background =
                          "linear-gradient(135deg, #b2f0e0 0%, #7dd9c0 40%, #4aab8a 100%)";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-teal-100 to-teal-200" />
                  )}
                  <div className="absolute inset-0 bg-black/15 group-hover:bg-black/5 transition-colors" />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-1.5 text-teal-600 text-xs font-semibold mb-2.5">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
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
                    <svg
                      className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            No news articles available at the moment.
          </div>
        )}

        {news.length > 0 && (
          <div className="text-center mt-10">
            <Link
              to="/news"
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-xl font-semibold text-base shadow-md shadow-teal-600/20 transition-all duration-200 hover:-translate-y-0.5"
            >
              View All News
              
            </Link>
          </div>
        )}
      </div>

      <NewsModal
        item={selected}
        onClose={handleClose}
        current={selectedIndex + 1}
        total={news.length}
      />
    </section>
  );
};

export default NewsSection;
