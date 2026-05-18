let form = document.getElementById('transaction-details');
let description = document.getElementById('description');
let amount = document.getElementById('amount');
let date = document.getElementById('date');
let editId = null;

let incExpBtn = document.getElementById('inc-exp-btn');

let arr = JSON.parse(localStorage.getItem('transactions')) || [];

let add = document.querySelector('#add');

let select = document.getElementById('select');

let filterType = 'All';

form.addEventListener('submit', (e) => {
    e.preventDefault();
    let num = amount.value;

    if (incExpBtn.textContent == 'Expense') {
        num = -num;
    }

    let obj = {
        id: editId || Date.now(),
        description: description.value,
        amount: Number(num),
        type: incExpBtn.textContent,
        date: date.value
    };

    if (editId === null) {
        arr.push(obj);

    }
    else {
        arr = arr.map(val => {
            if (val.id === editId) {
                return obj;
            } else {
                return val
            }
        })

        editId = null;
        add.textContent = 'Add Transaction';

    }

    localStorage.setItem('transactions', JSON.stringify(arr))
    incExpBtn.textContent = 'Income';
    amount.value = '';
    description.value = '';

    show()
    calculation()

});

select.addEventListener('change', (e) => {
    filterType = e.target.value;
    show();
})

function show() {
    let filteredArr = [];
    const transactionHistory = document.querySelector('.transactionHistory');

    // reset
    transactionHistory.innerHTML = "";

    const ul = document.createElement('ul');
    ul.classList.add('historyListContainer')


    filteredArr = arr.filter((data) => {

        return data.description.toLowerCase().includes(searched) || String(data.amount).includes(searched);
    });

    if (filterType === 'Income') {
        filteredArr = filteredArr.filter((data) => {
            return data.type === 'Income';
        })
    }
    else if (filterType === 'Expense') {
        filteredArr = filteredArr.filter((data) => {
            return data.type === 'Expense';
        })
    }




    if (filteredArr.length === 0) {
        const li = document.createElement('li');
        li.innerHTML = 'No records';
        ul.appendChild(li);
    }

    filteredArr = filteredArr.sort((amount, b) => {
        return new Date(b.date) - new Date(amount.date);
    })


    filteredArr.forEach((i) => {
        const li = document.createElement('li');

        li.classList.add('historyList');
        // li.style.color = i.amount < 0 ? 'red': 'green';

        li.innerHTML = `
            <span>${i.date}</span>
            <span class='desc'>${i.description}</span>
           <span style='color: ${i.amount < 0 ? 'red' : 'green'}' class='amt
           '>${i.amount}</span>
           <button class='deleteHistoryRow' data-id='${i.id}'>Delete</button>
           <button class='editTransaction' data-id='${i.id}'>Edit</button>
        `;

        ul.appendChild(li);

    });
    transactionHistory.appendChild(ul);

    let deleteBtn = document.querySelectorAll('.deleteHistoryRow');
    transactionHistory.addEventListener('click', (event) => {
        const btn = event.target.closest('.deleteHistoryRow');

        if (!btn) return;

        let id = btn.dataset.id;

        arr = arr.filter(val => val.id !== Number(id));

        localStorage.setItem('transactions', JSON.stringify(arr));

        show();
        calculation();
    });
   
    transactionHistory.addEventListener('click', (event) => {
        let btn = event.target.closest('.editTransaction');
        if (!btn) return;

        let id = btn.dataset.id;
        editId = Number(id);
        let editData = arr.find(val => val.id === Number(id))
        description.value = editData.description;
        amount.value = Math.abs(editData.amount);
        incExpBtn.textContent = editData.type;
        add.textContent = 'Update Transaction'

    })
}

let search = document.querySelector('#search');
let searched = '';
search.addEventListener('input', (e) => {
    searched = e.target.value.toLowerCase().trim();
    show();
})


incExpBtn.addEventListener('click', () => {
    if (incExpBtn.textContent == 'Income') {
        incExpBtn.textContent = 'Expense';

    }
    else {
        incExpBtn.textContent = 'Income';

    }
})



let incomeAmt = document.getElementById('income-amt');
let expenseAmt = document.getElementById('expense-amt');
let balanceAmt = document.getElementById('balance');

// Trying to calculate balance, income, expense using reduce
function calculation() {
    let balance = arr.reduce((acc, curr) => acc + curr.amount, 0);
    balanceAmt.textContent = balance;

    let income = arr.filter(val => val.amount > 0)
        .reduce((acc, curr) => {
            return acc + curr.amount;
        }, 0)

    console.log(income);
    incomeAmt.textContent = income;

    let expense = arr.filter(val => val.amount < 0)
        .reduce((acc, curr) => {
            return acc + curr.amount;
        }, 0)

    console.log(expense);
    expenseAmt.textContent = Math.abs(expense);
}



show()
calculation()









