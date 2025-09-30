import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

const TableComponent = ({
    data,
    columns,
    onRowClick,
    isLoading,
}) => {
    return <TableContainer>
        <Table>
            <TableHead sx={{ backgroundColor: "#e1f5fe" }}>
                <TableRow>
                    {columns.map((column) => (
                        <TableCell
                            sx={{
                                fontWeight: "bold",
                            }}
                            key={column.id}
                        >
                            {column.label}
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {data.length > 0 ? data.map((row, rowIndex) => (
                    <TableRow
                        key={row.id}
                        onClick={() => onRowClick && onRowClick(row)}
                    >
                        {columns.map((column) =>
                            column.render ? (
                                <TableCell key={column.id}>
                                    {column.render(row, rowIndex)}
                                </TableCell>
                            ) : (
                                <TableCell key={column.id}>{row[column.id]}</TableCell>
                            )
                        )}
                    </TableRow>
                )) :
                    !isLoading && <TableRow>
                        <TableCell colSpan={columns.length} align="center">
                            ไม่มีข้อมูล
                        </TableCell>
                    </TableRow>
                }
            </TableBody>
        </Table>
    </TableContainer>
}
export default TableComponent;