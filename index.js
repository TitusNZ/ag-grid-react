import React, { useState, useMemo, useCallback } from 'react';
import { render } from 'react-dom';
import { AgGridReact } from 'ag-grid-react';
import { BINEntries } from './data.json';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const App = () => {
  const CheckboxRenderer = useCallback((props) => {
    const { data } = props;
    const checked = data.cardAllowed;
    let array = rowData;

    const onCheckboxChange = (event) => {
      const updatedRow = { ...data, cardAllowed: event.target.checked };
      const foundIndex = rowData.findIndex(
        (x) => x.BINEntryID == data.BINEntryID
      );
      array[foundIndex] = updatedRow;
      setRowData([...array]);
    };

    return (
      <input type="checkbox" checked={checked} onChange={onCheckboxChange} />
    );
  }, []);

  const onCellValueChanged = useCallback((event) => {
    const updatedRow = { ...event.data, name: event.newValue };
    const updatedData = rowData.map((row) =>
      row.BINEntryID === updatedRow.BINEntryID ? updatedRow : row
    );
    setRowData(updatedData);
  }, []);

  function validInput(params) {
    if (params.value == '') {
      return { backgroundColor: 'red' };
    }
  }

  const defaultColDef = useMemo(() => {
    return {
      // flex: 1,
      sortable: true,
      filter: true,
    };
  }, []);

  const frameworkComponents = {
    checkboxRenderer: CheckboxRenderer,
  };

  const defaultColumn = [
    { field: 'BINEntryID' },
    { field: 'cardName', editable: true, cellStyle: validInput },
    { field: 'cardType', editable: true, cellStyle: validInput },
    { field: 'issuerId', editable: true, cellStyle: validInput },
    {
      field: 'panRangeLow',
      editable: true,
      cellEditor: 'agTextCellEditor',
      valueParser: function (params) {
        return parseInt(params.newValue);
      },
      cellStyle: function (params) {
        if (isNaN(params.value) || params.value == '') {
          return { backgroundColor: 'red' };
        }
      },
      cellRenderer: function (params) {
        if (isNaN(params.value)) {
          return 'Not a number';
        }
        return params.value;
      },
    },
    { field: 'panRangeHigh', editable: true, cellStyle: validInput },
    { field: 'cardAllowed', cellRenderer: 'checkboxRenderer' },
  ];

  const [rowData, setRowData] = useState(BINEntries);
  const [columnDefs] = useState(defaultColumn);

  const handleAddRow = useCallback(() => {
    const newRow = {
      BINEntryID: rowData.length + 1,
      cardName: '',
      cardType: '',
      issuerId: '',
      panRangeLow: '',
      panRangeHigh: '',
      cardAllowed: false,
    };
    setRowData([...rowData, newRow]);
  }, [rowData]);

  return (
    <div>
      <button onClick={handleAddRow}>Add Row</button>
      <div className="ag-theme-alpine" style={{ height: 400, width: '1' }}>
        {console.log(rowData)}
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          frameworkComponents={frameworkComponents}
          onCellValueChanged={onCellValueChanged}
        />
      </div>
    </div>
  );
};

render(<App />, document.getElementById('root'));
