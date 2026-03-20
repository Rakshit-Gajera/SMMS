// ==============================================
// DATA TABLE COMPONENT - ENHANCED WITH ANIMATIONS
// ==============================================
// Reusable table with:
// - Row hover animations with slide effect
// - Skeleton loading placeholders
// - Animated pagination
// - Staggered row entrance

import { useState } from 'react';

// ==============================================
// SKELETON ROW COMPONENT
// ==============================================
function SkeletonRow({ columns, selectable }) {
    return (
        <tr>
            {selectable && (
                <td style={{ width: '48px' }}>
                    <div className="skeleton" style={{ width: '18px', height: '18px', borderRadius: '4px' }} />
                </td>
            )}
            {columns.map((col, i) => (
                <td key={i}>
                    <div
                        className="skeleton"
                        style={{
                            height: '16px',
                            width: i === 0 ? '60%' : '40%',
                            borderRadius: '4px',
                        }}
                    />
                </td>
            ))}
        </tr>
    );
}

// ==============================================
// DATA TABLE COMPONENT
// ==============================================
function DataTable({
    columns = [],
    data = [],
    onRowClick,
    selectable = false,
    loading = false,
    emptyIcon = 'inbox',
    emptyMessage = 'No data available'
}) {
    // State
    const [selectedRows, setSelectedRows] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [hoveredRow, setHoveredRow] = useState(null);
    const [hoveredPage, setHoveredPage] = useState(null);
    const rowsPerPage = 10;

    // Pagination calculations
    const totalPages = Math.ceil(data.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const currentData = data.slice(startIndex, endIndex);

    // Selection handlers
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const allIndexes = currentData.map((_, index) => startIndex + index);
            setSelectedRows(allIndexes);
        } else {
            setSelectedRows([]);
        }
    };

    const handleSelectRow = (index) => {
        if (selectedRows.includes(index)) {
            setSelectedRows(selectedRows.filter(i => i !== index));
        } else {
            setSelectedRows([...selectedRows, index]);
        }
    };

    const allSelected = currentData.length > 0 &&
        currentData.every((_, index) => selectedRows.includes(startIndex + index));

    return (
        <div
            className="card animate-fadeIn"
            style={{
                overflow: 'hidden',
                borderRadius: 'var(--radius-xl)',
            }}
        >
            {/* Table wrapper */}
            <div style={{ overflowX: 'auto' }}>
                <table className="table">
                    {/* Table Header */}
                    <thead>
                        <tr>
                            {selectable && (
                                <th style={{ width: '48px' }}>
                                    <input
                                        type="checkbox"
                                        checked={allSelected}
                                        onChange={handleSelectAll}
                                        style={{
                                            cursor: 'pointer',
                                            width: '18px',
                                            height: '18px',
                                            accentColor: 'var(--primary)',
                                        }}
                                    />
                                </th>
                            )}
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    style={{
                                        ...column.width ? { width: column.width } : {},
                                        transition: 'background-color 0.2s ease',
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 'var(--space-1)',
                                        }}
                                    >
                                        {column.label}
                                        {column.sortable && (
                                            <span
                                                className="material-symbols-outlined"
                                                style={{
                                                    fontSize: '16px',
                                                    opacity: 0.5,
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease',
                                                }}
                                            >
                                                unfold_more
                                            </span>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody>
                        {/* Loading skeleton */}
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <SkeletonRow key={i} columns={columns} selectable={selectable} />
                            ))
                        ) : currentData.length === 0 ? (
                            /* Empty state */
                            <tr>
                                <td
                                    colSpan={columns.length + (selectable ? 1 : 0)}
                                    style={{ textAlign: 'center', padding: 'var(--space-8)' }}
                                >
                                    <div
                                        className="animate-fadeIn"
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: 'var(--space-3)',
                                        }}
                                    >
                                        <span
                                            className="material-symbols-outlined"
                                            style={{
                                                fontSize: '48px',
                                                color: 'var(--text-muted)',
                                                opacity: 0.5,
                                            }}
                                        >
                                            {emptyIcon}
                                        </span>
                                        <span className="text-secondary">{emptyMessage}</span>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            /* Data rows with animations */
                            currentData.map((item, index) => {
                                const actualIndex = startIndex + index;
                                const isSelected = selectedRows.includes(actualIndex);
                                const isHovered = hoveredRow === actualIndex;

                                return (
                                    <tr
                                        key={item.id || actualIndex}
                                        className="animate-fadeInUp"
                                        onClick={() => onRowClick && onRowClick(item)}
                                        onMouseEnter={() => setHoveredRow(actualIndex)}
                                        onMouseLeave={() => setHoveredRow(null)}
                                        style={{
                                            animationDelay: `${index * 30}ms`,
                                            cursor: onRowClick ? 'pointer' : 'default',
                                            backgroundColor: isSelected
                                                ? 'var(--primary-light)'
                                                : isHovered
                                                    ? 'var(--bg-hover)'
                                                    : 'transparent',
                                            transition: 'all 0.2s ease',
                                            transform: isHovered ? 'scale(1.005)' : 'scale(1)',
                                        }}
                                    >
                                        {/* Checkbox cell */}
                                        {selectable && (
                                            <td onClick={(e) => e.stopPropagation()}>
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => handleSelectRow(actualIndex)}
                                                    style={{
                                                        cursor: 'pointer',
                                                        width: '18px',
                                                        height: '18px',
                                                        accentColor: 'var(--primary)',
                                                        transition: 'transform 0.2s ease',
                                                        transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                                                    }}
                                                />
                                            </td>
                                        )}

                                        {/* Data cells */}
                                        {columns.map((column) => (
                                            <td
                                                key={column.key}
                                                style={{
                                                    transition: 'all 0.2s ease',
                                                }}
                                            >
                                                {column.render
                                                    ? column.render(item, isHovered)
                                                    : item[column.key]}
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Footer */}
            {totalPages > 1 && !loading && (
                <div
                    className="animate-fadeIn"
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: 'var(--space-4) var(--space-6)',
                        borderTop: '1px solid var(--border-light)',
                        backgroundColor: 'var(--bg-main)',
                    }}
                >
                    {/* Results count */}
                    <span className="text-sm text-secondary">
                        Showing <strong>{startIndex + 1}</strong> to{' '}
                        <strong>{Math.min(endIndex, data.length)}</strong> of{' '}
                        <strong>{data.length}</strong> results
                    </span>

                    {/* Page navigation */}
                    <div className="flex gap-2">
                        {/* Previous button */}
                        <button
                            className="btn btn-secondary"
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            style={{
                                opacity: currentPage === 1 ? 0.5 : 1,
                                padding: 'var(--space-2)',
                                transition: 'all 0.2s ease',
                            }}
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                                chevron_left
                            </span>
                        </button>

                        {/* Page buttons */}
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                                pageNum = i + 1;
                            } else if (currentPage <= 3) {
                                pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                            } else {
                                pageNum = currentPage - 2 + i;
                            }

                            const isActive = pageNum === currentPage;
                            const isPageHovered = hoveredPage === pageNum;

                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => setCurrentPage(pageNum)}
                                    onMouseEnter={() => setHoveredPage(pageNum)}
                                    onMouseLeave={() => setHoveredPage(null)}
                                    style={{
                                        width: '36px',
                                        height: '36px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.875rem',
                                        fontWeight: '600',
                                        borderRadius: 'var(--radius-md)',
                                        border: isActive ? 'none' : '1px solid var(--border-light)',
                                        backgroundColor: isActive
                                            ? 'var(--primary)'
                                            : isPageHovered
                                                ? 'var(--bg-hover)'
                                                : 'white',
                                        color: isActive ? 'white' : 'var(--text-secondary)',
                                        cursor: 'pointer',
                                        transition: 'all 0.25s ease',
                                        transform: isPageHovered && !isActive ? 'scale(1.1)' : 'scale(1)',
                                    }}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}

                        {/* Next button */}
                        <button
                            className="btn btn-secondary"
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            style={{
                                opacity: currentPage === totalPages ? 0.5 : 1,
                                padding: 'var(--space-2)',
                                transition: 'all 0.2s ease',
                            }}
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                                chevron_right
                            </span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DataTable;
