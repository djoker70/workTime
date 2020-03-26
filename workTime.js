document.addEventListener('DOMContentLoaded', function(){
    let nowDate = new Date();
    document.getElementById('dateStart').value = '1970-01-01';
    document.getElementById('dateEnd').value = nowDate.getFullYear()+'-'+("0" + (nowDate.getMonth() + 1)).slice(-2)+'-'+nowDate.getDate();
    let data = getJsonData();
    let virtualRows = data['virtual'];
    let table = document.getElementById('virtualTable');
    let switcher = document.getElementById('switcher');

    drawRows(table, virtualRows, switcher.value);

    document.getElementById('table').onclick = function () {
        switcherChange();
        drawRows(table, data[switcher.value], switcher.value);
    }
});

function getJsonData() {
    let json = '{' +
        '  "virtual":[' +
        '    ["Vlad","Kremlin","president","1999-08-16T08:00:00.511Z","1999-08-16T18:00:00.211Z"],' +
        '    ["Vlad","Kremlin","president","2019-11-04T08:00:00.000Z","2019-11-04T18:00:00.000Z"]' +
        '  ],' +
        '  "actual":[' +
        '    ["Vlad","Kremlin","president","1999-08-16T18:25:43.511Z","1999-08-17T01:25:12.711Z"],' +
        '    ["Vlad","Kremlin","president","",""]' +
        '  ]' +
        '}';
    return JSON.parse(json);
}

function switcherChange() {
    let switcher = document.getElementById('switcher');
    if (switcher.value === 'virtual') {
        switcher.value = 'actual';
    } else {
        switcher.value = 'virtual';
    }
}

function changeDate() {
    let table = document.getElementById('virtualTable');
    let data = getJsonData();
    let switcher = document.getElementById('switcher');
    drawRows(table, data[switcher.value], switcher.value);
}

function removeOldData() {
    let divBody = document.getElementById('body');
    let rowsOld = divBody.querySelectorAll('.row');
    let lengthOldDivs = rowsOld.length;
    for (let z=0; z < lengthOldDivs; z++) {
        rowsOld[z].remove();
    }
}

function filterRowsByDate(rows) {
    let dateStart = new Date(document.getElementById('dateStart').value);
    let dateEnd = new Date(document.getElementById('dateEnd').value);
    let result = [];

    rows.forEach(function (row, i, rows) {
        let dateStartRow = new Date(row[3]);
        let dateEndRow = new Date(row[4]);
        if (dateStart.valueOf() <= dateStartRow.valueOf() && dateEnd.valueOf() >= dateEndRow.valueOf() ) {
            result.push(row);
        }
    });
    return result;
}

function drawRows(table, rows = [], typeWork) {
    let divBody = document.getElementById('body');
    removeOldData();
    rows = filterRowsByDate(rows);
    rows.forEach(function (row, i, rows) {
        let divRow = startRowData(row);
        let oneMinuteLengthPx = 45/60;

        if (row[3] !== '' && row[4]!== '') {
            let dateStart = new Date(row[3]);
            let dateEnd = new Date(row[4]);

            let dayStart = dateStart.getDate();
            let dayEnd = dateEnd.getDate();


            let hourStart = dateStart.getHours();
            let hourEnd = dateEnd.getHours();

            let minutesStart = dateStart.getMinutes();
            let minutesEnd = dateEnd.getMinutes();


            if (dayStart === dayEnd) {
                var minutesBeforeTimeWork = 60 * hourStart + minutesStart;
                var minutesTimeWork = 60 * (hourEnd - hourStart) + Math.abs(minutesEnd - minutesStart);
                var minutesTimeAfterWork = 1440 - minutesBeforeTimeWork - minutesTimeWork;
            } else {
                var minutesBeforeTimeWork = 60 * hourStart + minutesStart;
                var minutesTimeWork = 1440 - minutesBeforeTimeWork;
                var minutesTimeAfterWork = 0;
            }

            let divBeforeTimeWork = document.createElement("div");
            divBeforeTimeWork.className = 'inlineBlock';
            divBeforeTimeWork.style.width = Math.ceil(minutesBeforeTimeWork * oneMinuteLengthPx) + 'px';
            divBeforeTimeWork.style.marginLeft = '35px';
            divBeforeTimeWork.innerHTML = ' ';
            divRow.append(divBeforeTimeWork);

            let divTimeWork = document.createElement("div");
            divTimeWork.className = 'inlineBlock';
            divTimeWork.style.width = Math.ceil(minutesTimeWork * oneMinuteLengthPx) + 'px';
            divTimeWork.innerHTML = ' ';
            if (typeWork == 'virtual') {
                divTimeWork.style.backgroundColor = '#000000';
            } else {
                divTimeWork.style.background = 'repeating-linear-gradient(-45deg, #606dbc, #606dbc 10px, #465298 10px, #465298 20px)';
            }
            divRow.append(divTimeWork);

            let divAfterTimeWork = document.createElement("div");
            divAfterTimeWork.className = 'inlineBlock';
            divAfterTimeWork.style.width = Math.ceil(minutesTimeAfterWork * oneMinuteLengthPx) + 'px';
            divAfterTimeWork.innerHTML = ' ';
            divRow.append(divAfterTimeWork);

        } else {
            divRow = endErrorData(divRow, oneMinuteLengthPx);
        }
        divBody.append(divRow);
    });
}

function startRowData(row) {
    let divRow = document.createElement("div");
    divRow.className = 'row';
    let divName = document.createElement("div");
    divName.className = 'inlineBlock name';
    divName.innerHTML = row[0];
    divRow.append(divName);

    let divPosition = document.createElement("div");
    divPosition.className = 'inlineBlock position';
    divPosition.innerHTML = row[1] +' / '+ row[2];
    divRow.append(divPosition);
    return divRow;
}

function endErrorData(divRow, oneMinuteLengthPx) {
    let divTime = document.createElement("div");
    divTime.className = 'inlineBlock';
    divTime.style.width = (1440*oneMinuteLengthPx) +'px';
    divTime.style.textAlign = 'center';
    divTime.innerHTML = 'error data format';
    divRow.append(divTime);
    return divRow;
}