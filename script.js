const APP_STORE = {
    itemsPerPage: 10,
    page: 1,
    pages: 1,
    loading: false,
    data: [],
    getCompaniesURL: 'https://recruitment.hal.skygate.io/companies',
    getCompaniesIncomeURL: 'https://recruitment.hal.skygate.io/incomes'
};

function renderCompanies() {
    const table = document.querySelector('.table');
    const tableBodyId = 'table-data';
    const oldTbody = document.getElementById(tableBodyId);
    const tbody = document.createElement('tbody');
    tbody.id = tableBodyId;

    const sliceLeftBound = (APP_STORE.page - 1) * APP_STORE.itemsPerPage;
    const sliceRightBound = (APP_STORE.page - 1) * APP_STORE.itemsPerPage + APP_STORE.itemsPerPage;
    const dataPerPage = APP_STORE.data.slice(sliceLeftBound, sliceRightBound);

    dataPerPage.forEach(companyWithIncome => {
        const row = document.createElement('tr');
        row.classList.add('table__row');
        tbody.appendChild(row);

        companyWithIncome.totalIncome = sumTotalIncome(companyWithIncome.incomes);
        companyWithIncome.averageIncome = (sumTotalIncome(companyWithIncome.incomes) / 50).toFixed(2);
        companyWithIncome.lastMonthIncome = getLastMonthIncome(companyWithIncome.incomes);

        addTdToRow(companyWithIncome, row);
    });

    oldTbody.parentNode.replaceChild(tbody, oldTbody);
}

async function getCompaniesAndRender() {
    setLoading(true);
    let companies = await getCompanies();

    Promise.all(companies.map(company => {
        return getCompaniesIncome(company).then(res => ({ ...company, ...res }));
    }))
        .then(companiesWithIncomes => {
            APP_STORE.data = companiesWithIncomes;
            renderCompanies();
            setLoading(false);
        })
        .catch(error => {
            console.error(error);
            setLoading(false);
        });
}


function setLoading(isLoading) {
    const wrapperClass = '.wrapper';
    const loadingClass = '--loading';
    const wrapper = document.querySelector(wrapperClass);

    LOADING = isLoading;
    if (isLoading) {
        wrapper.classList.add(loadingClass);
    } else {
        wrapper.classList.remove(loadingClass);
    }
}


async function getCompanies() {
    let response = await fetch(APP_STORE.getCompaniesURL);
    let data = await response.json();

    const nOfItems = data.length;
    setPaging(nOfItems);

    return data;
}

function setPaging(nOfItems) {
    APP_STORE.pages = Math.ceil(nOfItems / APP_STORE.itemsPerPage);

    document.getElementById('start').addEventListener('click', function () {
        setPageNumber(1, true);
    });
    document.getElementById('previous').addEventListener('click', function () {
        setPageNumber(APP_STORE.page - 1, true);
    });
    document.getElementById('next').addEventListener('click', function () {
        setPageNumber(APP_STORE.page + 1, true);
    });
    document.getElementById('end').addEventListener('click', function () {
        setPageNumber(APP_STORE.pages, true);
    });

    setPageNumber(1);
}


function setPageNumber(page, render = false) {
    try {
        if (typeof page !== 'number') {
            throw new Error('page must be of type number');
        }
        if (page >= 1 && page <= APP_STORE.pages) {
            APP_STORE.page = page;
            document.getElementById("pageNumber").innerHTML = `${page}/${APP_STORE.pages}`;
            if (render) {
                renderCompanies();
            }
        }
    } catch (err) {
        console.error(err);
    }
}


async function getCompaniesIncome(company) {
    let response = await fetch(`${APP_STORE.getCompaniesIncomeURL}/${company.id}`);
    let data = await response.json();

    return data;
}


function sumTotalIncome(incomes) {
    let sumIncome = 0;

    incomes.forEach(income => {
        sumIncome += Number(income.value);
    })

    return sumIncome.toFixed(2);
}


function getLastMonthIncome(incomes) {
    incomes.sort((firstEl, secondEl) => {
        return new Date(firstEl.date) < new Date(secondEl.date) ? 1 : -1;
    });

    const lastDate = new Date(incomes[0].date);
    const lastYear = lastDate.getFullYear();
    const lastMonth = lastDate.getMonth();

    const lastMonthIncomes = incomes.filter(income => {
        const date = new Date(income.date);
        const year = date.getFullYear()
        const month = date.getMonth();

        if (year === lastYear && month === lastMonth) {
            return true;
        } else {
            return false;
        }
    });

    const lastMonthIncomesSum = lastMonthIncomes.reduce((acc, curr) => {
        return acc + Number(curr.value);
    }, 0);

    return lastMonthIncomesSum.toFixed(2);
}


function addTdToRow(company, row) {
    Object.keys(company).forEach(key => {
        const td = document.createElement('td');
        td.classList.add('table__item');
        let innerHTML;

        switch (key) {
            case 'id': {
                innerHTML = company.id;
                break;
            }
            case 'name': {
                innerHTML = company.name;
                break;
            }
            case 'city': {
                innerHTML = company.city;
                break;
            }
            case 'totalIncome': {
                innerHTML = company.totalIncome;
                break;
            }
            case 'averageIncome': {
                innerHTML = company.averageIncome;
                break;
            }
            case 'lastMonthIncome': {
                innerHTML = company.lastMonthIncome;
                break;
            }
            default: {
                break;
            }
        }

        if (innerHTML) {
            td.innerHTML = innerHTML;
            row.appendChild(td);
        }
    });
}


function sortTable(n, type) {
    let switching,
        i,
        x,
        y,
        shouldSwitch,
        dir,
        switchcount = 0;

    const table = document.querySelector('.table');
    const thead = table.childNodes[0];
    switching = true;
    dir = "asc";

    while (switching) {
        switching = false;

        const rows = table.rows;

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


function filterTable() {
    const input = document.querySelector('.nav__input');
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




getCompaniesAndRender();