import React, { useEffect, useState } from 'react';
import { getAllNews } from '../../firebase/config';

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await getAllNews();
        const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setNews(sorted);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-teal-700 py-14 px-6 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">Latest News</h1>
        <p className="text-teal-200 text-base max-w-xl mx-auto">
          Stay updated with the latest health information and medical advancements
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

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
          </div>
        )}

        {/* Featured + Grid */}
        {!loading && news.length > 0 && (
          <>
            {/* Featured first article */}
            {news[0] && (
              <div
                onClick={() => setSelected(news[0])}
                className="group mb-8 bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row"
              >
                <div className="md:w-1/2 h-64 md:h-auto overflow-hidden bg-teal-50 flex-shrink-0">
                  <img
                    src={news[0].image || 'https://via.placeholder.com/600x400'}
                    alt={news[0].title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 md:p-8 flex flex-col justify-center">
                  <span className="inline-flex items-center gap-1.5 text-teal-600 text-xs font-bold uppercase tracking-widest mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                    Featured
                  </span>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-teal-600 transition-colors leading-snug">
                    {news[0].title}
                  </h2>
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-4">
                    {news[0].content}
                  </p>
                  <div className="flex items-center gap-2 text-gray-400 text-xs font-medium">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {news[0].date}
                  </div>
                </div>
              </div>
            )}

            {/* Rest of news */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.slice(1).map(item => (
                <div
                  key={item.id}
                  onClick={() => setSelected(item)}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="h-48 overflow-hidden bg-teal-50">
                    <img
                      src={item.image || 'https://via.placeholder.com/400x200'}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-1.5 text-teal-600 text-xs font-semibold mb-2">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {item.date}
                    </div>
                    <h3 className="font-bold text-gray-900 text-base leading-snug mb-2 group-hover:text-teal-600 transition-colors">
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
          </>
        )}
      </div>

      {/* Modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative">
              <img
                src={selected.image || 'https://via.placeholder.com/600x300'}
                alt={selected.title}
                className="w-full h-56 object-cover"
              />
              <button
                onClick={() => setSelected(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center text-sm transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 text-teal-600 text-xs font-semibold mb-3">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {selected.date}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 leading-snug">{selected.title}</h2>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{selected.content}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default News;