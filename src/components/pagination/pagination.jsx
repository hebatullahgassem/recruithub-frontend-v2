import { RiArrowLeftCircleFill, RiArrowRightCircleFill } from "react-icons/ri";

export default function CustomPagination({
  page,
  setPage,
  pageSize,
  setPageSize,
  total,
}) {
  return (
    <div
      className="d-flex gap-3 mt-3 mb-5 justify-content-center align-items-center"
      style={{
        border: "1px solidrgb(0, 0, 0)",
        borderRadius: "10px",
        padding: "10px",
        visibility: page === 1 && page * pageSize >= total ? "hidden" : "visible",
      }}
    >
      <RiArrowLeftCircleFill
        disabled={page === 1}
        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        style={{ scale: "2", color: page === 1?'black':"#901b20" }}
      />
      <select
        value={pageSize}
        onChange={(e) => setPageSize(Number(e.target.value))}
      >
        {[10, 20, 30].map((size) => (
          <option key={size} value={size}>
            {size} per page
          </option>
        ))}
      </select>
      <RiArrowRightCircleFill
        disabled={page * pageSize >= total}
        onClick={() => setPage((prev) => prev + 1)}
        style={{
          scale: "2",
          color: page * pageSize >= total ? "black" : "#901b20",
        }}
      />
    </div>
  );
}
