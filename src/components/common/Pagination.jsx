// ── Pagination Component ──────────────────────────────────────────────────────
export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const range = 2;

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 || i === totalPages ||
      (i >= currentPage - range && i <= currentPage + range)
    ) {
      pages.push(i);
    } else if (
      i === currentPage - range - 1 ||
      i === currentPage + range + 1
    ) {
      pages.push('...');
    }
  }

  // Deduplicate '...'
  const deduped = pages.filter(
    (p, i) => p !== '...' || (i > 0 && pages[i - 1] !== '...')
  );

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded-xl text-sm border border-gray-200
                   hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed
                   transition-colors duration-200"
      >
        ←
      </button>

      {deduped.map((p, i) =>
        p === '...' ? (
          <span key={`dot-${i}`} className="px-2 text-gray-400">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-10 h-10 rounded-xl text-sm font-medium transition-colors duration-200
              ${p === currentPage
                ? 'bg-primary-600 text-white shadow-sm'
                : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded-xl text-sm border border-gray-200
                   hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed
                   transition-colors duration-200"
      >
        →
      </button>
    </div>
  );
}
