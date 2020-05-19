// Sum total income

const sumTotalIncome = (incomes) => {
    let sumIncome = 0;

    incomes.forEach(income => {
        sumIncome += Number(income.value);
    })

    return sumIncome.toFixed(2);
}

// // Add td to table

const addTdToRow = (company, row) => {
    for (let i = 0; i < Object.keys(company).length; i++) {
        const td = document.createElement('td');
        td.classList.add('table__item')

        if (i === 0) {
            td.innerHTML = company.id;
        } else if (i === 1) {
            td.innerHTML = company.name;
        } else if (i === 2) {
            td.innerHTML = company.city;
        } else if (i === 3) {
            td.innerHTML = company.totalIncomes;
        } else if (i === 4) {
            td.innerHTML = company.averageIncomes;
        } else if (i === 5) {
            td.innerHTML = company.lastMonthIncome;
        }

        row.appendChild(td);
    }
}

// Get companies data

const getCompanies = async () => {
    const url = 'https://recruitment.hal.skygate.io/companies';

    let response = await fetch(url);
    let data = await response.json();

    return data;
}

// Get companies with incomes

const getCompaniesIncome = async (company) => {
    let response = await fetch(`https://recruitment.hal.skygate.io/incomes/${company.id}`);
    let data = await response.json();

    return data;
}

// Get last month incomes

const getLastMonthIncome = (company) => {
    const allDatas = company.map(data => {
        return data.date.slice(0, 7)
    })

    allDatas.sort().reverse();

    let lastMonthIncome = 0;

    company.forEach(data => {
        if (data.date.includes(allDatas[0])) {
            lastMonthIncome += Number(data.value)
        }
    });

    return lastMonthIncome.toFixed(2);
}

// Display companies in table

const showCompaniesInTable = async () => {
    const table = document.querySelector('.table');

    let companies = await getCompanies();

    companies.forEach(async (company) => {
        const row = document.createElement('tr');
        row.classList.add('table__row');
        table.appendChild(row);

        let companyIncomes = await getCompaniesIncome(company);

        company.totalIncomes = sumTotalIncome(companyIncomes.incomes);
        company.averageIncomes = sumTotalIncome(companyIncomes.incomes) / 50;
        company.lastMonthIncome = getLastMonthIncome(companyIncomes.incomes);

        addTdToRow(company, row);
    })

}

showCompaniesInTable();

// Function to sort table by header click

function sortTable(n, type) {
    let switching,
        i,
        x,
        y,
        shouldSwitch,
        dir,
        switchcount = 0;

    const table = document.querySelector('.table')
    switching = true;
    dir = "asc";

    while (switching) {
        switching = false;

        const rows = table.querySelectorAll('.table__row');

        for (i = 1; i < rows.length - 1; i++) {
            shouldSwitch = false;

            x = rows[i].querySelectorAll('.table__item')[n];
            y = rows[i + 1].querySelectorAll('.table__item')[n];

            if (dir == "asc") {
                if (type === 'N' && Number(x.innerHTML) > Number(y.innerHTML)) {

                    shouldSwitch = true;
                    break;

                } else if (type === 'S' && x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {

                    shouldSwitch = true;
                    break;
                }
            } else if (dir == "desc") {
                if (type === 'N' && Number(x.innerHTML) < Number(y.innerHTML)) {

                    shouldSwitch = true;
                    break;

                }
                if (type === 'S' && x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {

                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;

            switchcount++;
        } else {
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}

// Filter table

function myFunction() {
    const input = document.querySelector('.wrapper__input');
    const filter = input.value.toUpperCase();
    const table = document.querySelector('.table');
    const tr = table.getElementsByTagName("tr");

    for (let i = 1; i < tr.length; i++) {

        tr[i].style.display = "none";

        const td = tr[i].getElementsByTagName("td");
        for (var j = 0; j < td.length; j++) {
            cell = tr[i].getElementsByTagName("td")[j];
            if (cell) {
                if (cell.innerHTML.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                    break;
                }
            }
        }
    }
}