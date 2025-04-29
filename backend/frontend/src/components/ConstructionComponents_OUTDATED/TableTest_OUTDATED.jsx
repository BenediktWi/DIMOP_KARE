import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { APIContext } from "../../APIContext";
import { useContext } from "react";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";

import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

import TreeData from "../../files/table_tree_test.json";

function Row(props) {
    const { row, level } = props;
    const [open, setOpen] = useState(false);

    const handleRowClick = (e) => {
        console.log(e);
    };

    const fillRowWithData = (elem, depth, isParent = false) => {
        return (
            <TableRow
                style={{
                    backgroundColor: `rgb(${(122 + depth * 42) % 255}, ${
                        (112 + depth * 32) % 255
                    },${(136 + depth * 12) % 255})`,
                }}
            >
                <TableCell style={{ paddingLeft: 16 + 16 * depth }}>
                    {isParent ? (
                        <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => setOpen(!open)}
                            // onClick={(e) => handleRowClick(e)}
                        >
                            {open ? (
                                <KeyboardArrowUpIcon />
                            ) : (
                                <KeyboardArrowDownIcon />
                            )}
                        </IconButton>
                    ) : (
                        ""
                    )}
                </TableCell>
                <TableCell>{elem.id}</TableCell>
                <TableCell>{elem.mara_id}</TableCell>
                <TableCell>{elem.mara_nr}</TableCell>
                <TableCell>{elem.mat_desc}</TableCell>
                <TableCell>{elem.pos}</TableCell>
                <TableCell>{elem.height_erp}</TableCell>
                <TableCell>{elem.width_erp}</TableCell>
                <TableCell>{elem.depth_erp}</TableCell>
                <TableCell>{elem.unit_erp}</TableCell>
                <TableCell>{elem.volume_cad}</TableCell>
                <TableCell>{elem.unit_cad}</TableCell>
                <TableCell>{elem.weight_ui}</TableCell>
                {/* <TableCell>{elem.qr_relevant}</TableCell> */}
                {/* <TableCell>{elem.recycle_val}</TableCell> */}
            </TableRow>
        );
    };

    let parent = fillRowWithData(row, level, true);

    let childRows;
    //if children available
    if (row.children.length > 0) {
        //for child in children

        // <TableRow>
        //     <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
        //         <Collapse in={open} timeout="auto" unmountOnExit>
        //             <Typography variant="h6" gutterBottom component="div">
        //                 History
        //             </Typography>
        //         </Collapse>
        //     </TableCell>
        // </TableRow>;

        childRows = row.children.map((e) => {
            // return (
            //     <Collapse
            //         in={open}
            //         component="tr"
            //         timeout="auto"
            //         unmountOnExit
            //         style={{ display: "block" }}
            //     >
            //         <Row key={e.id} row={e} />
            //     </Collapse>
            // );
            return <Row key={e.id} level={level + 1} row={e} />;
            // return getRow(e, level + 1);
        });
    } else {
        return fillRowWithData(row, level); // remove level because its irrelevant without children
    }

    return open ? [parent, childRows] : [parent];
}

function TableTest() {
    // get debugging API variable

    const { use_API, API_Host } = useContext(APIContext);
    const [useAPI, setUseAPI] = use_API;

    const [loading, setLoading] = useState(true);
    const [tableData, setTableData] = useState(TreeData);

    // async function fetchData() {
    //     const res = await fetch("/bomitem/4");
    //     res.json()
    //         .then((res) => setTableData(res))
    //         .then((r) => setLoading(false))
    //         .catch((err) => console.log(err));
    // }

    // useEffect(() => {
    //     fetchData();
    // });

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
            console.log("API data loaded true");
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div>
            {/* <h1>
                USE API: <span>{useAPI ? "true" : "false"}</span>
            </h1> */}
            {!loading && (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Expand</TableCell>
                            {tableData.Table_Tree_Columns.map((elem) => {
                                return (
                                    <TableCell component="th" scope="row">
                                        {elem.title}
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    </TableHead>
                    {tableData.Table_Tree_Data.map((elem) => {
                        return <Row key={elem.id} level={0} row={elem} />;
                    })}
                </Table>
            )}
        </div>
    );
}

export default TableTest;
