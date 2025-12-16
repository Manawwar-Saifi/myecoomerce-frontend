import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";

const AdminTable = ({
  rows = [],
  columns = [],
  pageSizeOptions = [5, 10, 20, 100],
  checkboxSelection = false,
}) => {
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 5,
  });

  const paginatedRows = rows.slice(
    paginationModel.page * paginationModel.pageSize,
    paginationModel.page * paginationModel.pageSize + paginationModel.pageSize
  );

  return (
    <Paper sx={{ width: "99%", p: 1 }}>
      <DataGrid
        rows={rows}
        columns={columns}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={pageSizeOptions}
        checkboxSelection={checkboxSelection}
        sx={{ border: 0 }}
        paginationMode="client" // let DataGrid manage the pagination
        // autoHeight
      />
    </Paper>
  );
};

export default AdminTable;
