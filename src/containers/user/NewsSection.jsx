// src/components/NewsSection.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllNews } from "../../firebase/config";

const NewsSection = () => {
  const [news, setNews] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await getAllNews();
        const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setNews(sorted.slice(0, 3));
      } catch (err) {
        console.error("Error fetching news:", err);
      }
    };
    fetchNews();
  }, []);

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-12">

        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
            Latest News
          </h2>
          <div className="w-12 h-1 bg-teal-600 mx-auto rounded-full" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedNews(item)}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 border border-gray-100"
            >
              <div className="relative h-70 overflow-hidden bg-teal-50">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/15 group-hover:bg-black/5 transition-colors" />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-1.5 text-teal-600 text-sm font-semibold mb-2.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {item.date}
                </div>
                <h3 className="font-bold text-gray-900 text-2xl leading-snug mb-2 group-hover:text-teal-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                  {item.content}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <Link
            to="/news"
            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-xl font-semibold text-base shadow-md shadow-teal-600/20 transition-all duration-200 hover:-translate-y-0.5"
          >
            View All News
            
          </Link>
        </div>
      </div>

      {/* Modal */}
      {selectedNews && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setSelectedNews(null)}
        >
          <div
            className="bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-lg relative animate-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedNews(null)}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 text-white flex items-center justify-center text-sm transition-colors"
            >
              ✕
            </button>
            <img
              src={selectedNews.image || "https://via.placeholder.com/600"}
              alt={selectedNews.title}
              className="w-full h-52 object-cover"
            />
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3">{selectedNews.title}</h2>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                {selectedNews.content}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default NewsSection;