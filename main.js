const easyComp = (params) => {
    return `🟢`;
}
const intComp = (params) => {
    return `🟦`;
}
const advComp = (params) => {
    return `<div style="transform: rotate(-45deg); display:inline-block;")>⬛</div>`;
}
      
// let the grid know which columns and what data to use
var gridOptions = {
columnDefs: [
    {
        width: 10,
        headerName: "", 
        field: "piste:difficulty", 
        cellRendererSelector: (p) => {
            if (p.value === "easy") {
                return {component: easyComp}
            }
            if (p.value === "intermediate") {
                return {component: intComp}
            }
            if (p.value === "advanced") {
                return {component: advComp}
            }
        }
    },
    {field: "name"},
    {field:"open"},
    {
        field:"group",
        cellRenderer: p => `${p.value.toUpperCase()}`
    },
],
// rowData: trails
rowData: ""
};
  
var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
  "apiKey": "BoRTlpW3Wh0C"
});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
}; 

let fullReport;
let trails;

fetch("https://api.nordic-pulse.com/v3/ski-areas/BC-BlackJack/full-report/", requestOptions)
  .then(response => response.text())
  .then(result => {
    fullReport = result;
    const reportDataParsed = JSON.parse(fullReport);
    const trails = reportDataParsed.trails;

    // Now you can work with the "trails" data
    gridOptions.api.setRowData(trails);
  })
  .catch(error => console.log('error', error));

  // setup the grid after the page has finished loading
  document.addEventListener('DOMContentLoaded', function() {
      var gridDiv = document.querySelector('#myGrid');
      new agGrid.Grid(gridDiv, gridOptions);
  });
  
