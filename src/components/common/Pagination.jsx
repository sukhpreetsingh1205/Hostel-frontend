import React from 'react';

const Pagination = ({ page = 1, pages = 1, onPageChange }) => {
  if (!pages || pages <= 1) return null;

  const safeChange = (next) => {
    if (!onPageChange) return;
    const bounded = Math.max(1, Math.min(pages, next));
    onPageChange(bounded);
  };

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="text-sm text-gray-600">
        Page <span className="font-semibold">{page}</span> of <span className="font-semibold">{pages}</span>
      </div>
      <div className="join">
        <button
          type="button"
          className="btn btn-sm join-item"
          onClick={() => safeChange(page - 1)}
          disabled={page <= 1}
        >
          Prev
        </button>
        <button
          type="button"
          className="btn btn-sm join-item"
          onClick={() => safeChange(page + 1)}
          disabled={page >= pages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
