export const paginate = (
  pageNumber: number,
  currentPage: number,
  totalPages: number,
  setCurrentPage: (page: number) => void
) => {
  if (pageNumber < 1 || pageNumber > totalPages) return;
  setCurrentPage(pageNumber);
};
