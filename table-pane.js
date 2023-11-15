const easyComp = (params) => {
    return `<ion-icon class="difficulty-icon icon-easy" name="ellipse-sharp"></ion-icon>`;
}
const intComp = (params) => {
    return `<ion-icon class="difficulty-icon icon-intermediate" name="square-sharp"></ion-icon>`;
}
const advComp = (params) => {
    return `<ion-icon class="difficulty-icon icon-advanced-outline" name="square-outline"></ion-icon>`;
}
      
// let the grid know which columns and what data to use
var mainGridOptions = {
  domLayout: 'autoHeight',
  suppressCellFocus: true,
  columnDefs: [
      {
          width: 0,
          headerName: "", 
          field: "piste:difficulty", 
          initialSort: "asc", // TODO create custom sort order for difficulty
          comparator: (valueA, valueB, nodeA, nodeB, isInverted) => {
            // Define your custom sort order
            const customSortOrder = ['easy', 'intermediate', 'advanced'];
        
            // Find the index of each value in the custom sort order array
            const indexA = customSortOrder.indexOf(valueA);
            const indexB = customSortOrder.indexOf(valueB);
        
            // Compare the indices to determine the sort order
            if (indexA < indexB) {
              return -1;
            } else if (indexA > indexB) {
              return 1;
            } else {
              return 0;
            }
          },
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
      // {
      //   field: "name",
      //   // suppressSizeToFit: true,
      //   initialSort: "asc",
      //   cellRenderer: params => {
      //     const name = params.data.name;
      //     const dog = params.data.dog;
      
      //         // Include dog content in the name column if it's not empty
      //     const displayName = dog
      //       ? `<div style="display: flex; justify-content: space-between;"><span>${name}</span><ion-icon class="difficulty-icon" name="paw"></ion-icon></div>`
      //       : name;

      //     return displayName;
      //   }
      // },
      {
        field: "name",
        initialSort: "asc"
      },
      {
          field:"dog",
          width: 0,        
          cellRenderer: params => {
            const dog = params.value;
            if (dog === true){
              return `<ion-icon class="difficulty-icon" name="paw"></ion-icon>`;
            } 
        }
      },
      {
          field: "distance",
          cellRenderer: params => {
              const meters = params.value;
              const kilometers = (meters / 1000).toFixed(1); // Convert to kilometers and round to 1 decimal place
              if (kilometers > 0) {
                return `${kilometers} km`;
              }
          },
      },
      // {
      //     field:"open",
      //     headerName: "",
      //     width: 0,
      // },
      // {field:"hazard"}, // TODO only show hazard content if true and show in "open" field?
      {
          headerName: 'Last Groomed',
          field: 'lastGroomedManual',
          cellRenderer: params => {
              // determine if lastGroomed or lastGroomedManual is more recent and use that for date
              let lastGroomed;
              let lastGroomedClass = '';
              if (params.data.open){
                if(params.data.manual) { // check manual (non-gps) mode
                  lastGroomed = params.data.lastGroomedManual;
                  lastGroomedClass = params.data.lastGroomedManualClass;
                } else { // default to gps time
                  lastGroomed = params.data.lastGroomed;
                  lastGroomedClass = params.data.lastGroomedClass;
                }
                } else {
                  return 'Closed 🚫';
                }
              
              const date = new Date(lastGroomed)
          
              return `
                <div class="grooming-cell">
                  <div>${convertToLocaleTimeString(date)}</div>
                  <div class="grooming-icon ${lastGroomedClass}">O</div>
                </div>
              `;
            },
      },   
  ],

  rowData: ""
  };

var mainGridOptions1 = { ...mainGridOptions };
var mainGridOptions2 = { ...mainGridOptions };
var biathlonGridOptions1 = { ... mainGridOptions };
var biathlonGridOptions2 = { ... mainGridOptions };
  
let fullReport;
let trails;

  // setup the grid after the page has finished loading
  document.addEventListener('DOMContentLoaded', function() {
      var reportDiv = document.querySelector('#report');  
      var mainGridDiv1 = document.querySelector('#mainGrid1');
      new agGrid.Grid(mainGridDiv1, mainGridOptions1);
      var mainGridDiv2 = document.querySelector('#mainGrid2');
      new agGrid.Grid(mainGridDiv2, mainGridOptions2);
      var biathlonGridDiv1 = document.querySelector('#biathlonGrid1');
      new agGrid.Grid(biathlonGridDiv1, biathlonGridOptions1);
      var biathlonGridDiv2 = document.querySelector('#biathlonGrid2');
      new agGrid.Grid(biathlonGridDiv2, biathlonGridOptions2);

      fetch("https://np-express.onrender.com/report")
        .then(response => response.text())
        .then(result => {
          fullReport = result;
          const reportDataParsed = JSON.parse(fullReport);
          const latestReport = reportDataParsed["ski-area"]["reportLatest"]
          var latestReportContent = document.createElement("p")
          latestReportContent.innerHTML = latestReport["reportContent"]
          reportDiv.append(latestReportContent)
          console.log(reportDataParsed)
          console.log(latestReport)
          const reportDate = convertToLocaleTimeString(new Date(latestReport["reportTimestamp"]))  
          const reportBylineDiv = document.createElement('div');
          reportBylineDiv.innerHTML = `
            <div style="text-align: right;">
              Reported <span style="font-weight: bold;">${reportDate}</span> by <span style="text-transform: capitalize;">${latestReport["reportAuthor"]}</span>
            </div>
          `;
          reportDiv.appendChild(reportBylineDiv)
          
          // TODO check if length of noticeData is >0
          const horizontalLine = document.createElement('hr');
          reportDiv.appendChild(horizontalLine);
          var noticeData = reportDataParsed["ski-area"]["reportNotices"]
          var notice = document.createElement("p")
          notice.innerHTML = noticeData[0]["content"]["en"]
          reportDiv.append(notice)
          const noticeDate = convertToLocaleTimeString(new Date(latestReport["reportTimestamp"]))  
          const noticeBylineDiv = document.createElement('div');
          noticeBylineDiv.innerHTML = `
            <div style="text-align: right; font-size: smaller">
              Notice updated <span style="font-weight: bold;">${reportDate}</span>
            </div>
          `;
          reportDiv.appendChild(noticeBylineDiv)

          const trails = reportDataParsed.trails.filter(item => item.hide != true);
          // Split data for main and biathlon areas
          const mainAreaData = trails.filter(item => item.group === "BlackJackMainNetwork");
          // cut each area's data in half for each column
          const { firstHalf: mainFirstHalf, secondHalf: mainSecondHalf } = splitDataIntoHalves(mainAreaData);
          mainGridOptions1.api.setRowData(mainFirstHalf);
          mainGridOptions2.api.setRowData(mainSecondHalf);

          const biathlonAreaData = trails.filter(item => item.group === "HannaCreekBiathlon");
          const { firstHalf: biathlonFirstHalf, secondHalf: biathlonSecondHalf } = splitDataIntoHalves(biathlonAreaData);
          biathlonGridOptions1.api.setRowData(biathlonFirstHalf);
          biathlonGridOptions2.api.setRowData(biathlonSecondHalf);

          gridsOptionsList = [mainGridOptions1, mainGridOptions2, biathlonGridOptions1, biathlonGridOptions2];
          gridsOptionsList.forEach(gridOptions => {
            sizeToFit(gridOptions);
          });
          
        })
        .catch(error => console.log('error', error));
  });
  
function splitDataIntoHalves(data) {
  const customSortOrder = ['easy', 'intermediate', 'advanced'];

  // Sort the data based on the custom sort order
  const sortedData = data.slice().sort((a, b) => {
    const indexA = customSortOrder.indexOf(a['piste:difficulty']);
    const indexB = customSortOrder.indexOf(b['piste:difficulty']);

    // First, sort by difficulty
    if (indexA !== indexB) {
      return indexA - indexB;
    }

    // If difficulty is the same, sort by name alphabetically
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();

    if (nameA < nameB) {
      return -1;
    } else if (nameA > nameB) {
      return 1;
    } else {
      return 0;
    }
    });

  // Calculate the midpoint of the sorted data
  const midpoint = Math.ceil(sortedData.length / 2);

  // Split the sorted data into two halves
  const firstHalf = sortedData.slice(0, midpoint);
  const secondHalf = sortedData.slice(midpoint);

  // Return an object containing the first and second halves
  return { firstHalf, secondHalf };
}
  
function sizeToFit(gridOptions) {
  gridOptions.api.sizeColumnsToFit({
    // defaultMinWidth: 100,
    columnLimits: [
      { key: 'name', minWidth: 10 },
      { key: 'distance', maxWidth: 110 },
      { key: 'open', maxWidth: 0 },
      { key: 'lastGroomedManual', minWidth: 160 }
    ],
  });
};