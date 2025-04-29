import React from "react";
import {
    Table,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@material-ui/core";

export const DataTable = (props) => {
    const { data, columns, rowClick } = props;

    return (
        <Table>
            <TableHead>
                <TableRow>
                    {columns.map((e) => {
                        return <TableCell>{e.label}</TableCell>;
                    })}
                </TableRow>
            </TableHead>
            <TableBody>
                {data.map((r) => {
                    return (
                        <TableRow hover onClick={() => rowClick(r.id)}>
                            {columns.map((c) => {
                                return <TableCell>{r[c.col_id]}</TableCell>;
                            })}
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
};
