// Get all companies

const getCompanies = () => {
    const url = 'https://recruitment.hal.skygate.io/companies';

    const table = document.querySelector('.table');

    fetch(url)
        .then(res => res.json())
        .then(res => {
            res.forEach(item => {
                const row = document.createElement('tr');
                row.classList.add('table__row');

                table.appendChild(row);

                addTdToRow(item, row);
            })
        })
        .catch(err => { throw err })

}

getCompanies();

// Add td to table

const addTdToRow = (item, row) => {
    for (let i = 0; i < Object.keys(item).length; i++) {
        const td = document.createElement('td');
        td.classList.add('table__item')

        if (i === 0) {
            td.innerHTML = item.id
        } else if (i === 1) {
            td.innerHTML = item.name
        } else if (i === 2) {
            td.innerHTML = item.city
        }
        row.appendChild(td);
    }
}

// getCompany

fetch('https://recruitment.hal.skygate.io/incomes/1')
    .then(res => res.json())
    .then(res => console.log(res))