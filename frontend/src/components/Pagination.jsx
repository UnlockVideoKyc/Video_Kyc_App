const Pagination = ({
  currentPage,
  totalItems,
  itemsPerPage = 5,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  return (
    <div className="d-flex justify-content-between align-items-center mt-3">
      {/* Page info */}
      <small className="text-muted">
        Showing {currentPage}-{totalPages} of {totalPages}
      </small>

      <nav>
        <ul className="pagination pagination-sm mb-0">
          {/* Previous */}
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
            >
              ‹
            </button>
          </li>

          {/* Current Page Only */}
          <li className="page-item active">
            <button className="page-link">{currentPage}</button>
          </li>

          {/* Next */}
          <li
            className={`page-item ${currentPage === totalPages ? "disabled" : ""
              }`}
          >
            <button
              className="page-link"
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
            >
              ›
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;
