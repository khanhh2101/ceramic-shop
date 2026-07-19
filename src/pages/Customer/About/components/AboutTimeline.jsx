import React from 'react';

export default function AboutTimeline({ timeline }) {
  if (!timeline || timeline.length === 0) return null;

  // Sắp xếp timeline theo năm tăng dần
  const sortedTimeline = [...timeline].sort((a, b) => a.year - b.year);

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">Dấu Ấn Lịch Sử</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hành trình của chúng tôi qua từng mốc thời gian đáng nhớ.
          </p>
        </div>

        <div className="relative">
          {/* Đường dọc ở giữa */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gray-200 hidden md:block"></div>

          <div className="space-y-12 md:space-y-0">
            {sortedTimeline.map((item, index) => {
              const isEven = index % 2 === 0;
              return (
                <div key={item.id || index} className="relative flex flex-col md:flex-row items-center justify-between md:mb-12 group">
                  
                  {/* Cột trái (Ảnh hoặc Text tùy chẵn lẻ) */}
                  <div className={`w-full md:w-5/12 flex ${isEven ? 'md:justify-end' : 'md:justify-start order-1 md:order-2'} mb-6 md:mb-0`}>
                    {isEven ? (
                      <div className="text-left md:text-right px-4 md:px-0">
                        <span className="text-[#b5624a] font-bold text-xl md:text-2xl block mb-2">{item.year}</span>
                        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                      </div>
                    ) : (
                      item.imageUrl && (
                        <div className="px-4 md:px-0 w-full">
                          <img src={item.imageUrl} alt={item.title} className="w-full h-48 md:h-64 object-cover rounded-xl shadow-sm group-hover:shadow-md transition-shadow" />
                        </div>
                      )
                    )}
                  </div>

                  {/* Cột phải (Ảnh hoặc Text tùy chẵn lẻ) */}
                  <div className={`w-full md:w-5/12 flex ${isEven ? 'md:justify-start order-2' : 'md:justify-end'} px-4 md:px-0`}>
                    {isEven ? (
                      item.imageUrl && (
                        <div className="w-full">
                          <img src={item.imageUrl} alt={item.title} className="w-full h-48 md:h-64 object-cover rounded-xl shadow-sm group-hover:shadow-md transition-shadow" />
                        </div>
                      )
                    ) : (
                      <div className="text-left">
                        <span className="text-[#b5624a] font-bold text-xl md:text-2xl block mb-2">{item.year}</span>
                        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                      </div>
                    )}
                  </div>

                  {/* Nút mốc thời gian ở giữa */}
                  <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[#b5624a] rounded-full border-4 border-white shadow-sm z-10 md:block hidden group-hover:scale-125 transition-transform"></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
