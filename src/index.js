document.addEventListener('DOMContentLoaded', function () {
    const submitButton = document.querySelector('.submit');
    const clearButton = document.querySelector('.clear');

    let errors = [];

    if (submitButton) {
        submitButton.addEventListener('click', function (e) {
            e.preventDefault();

            const min = Number(document.getElementById('min').value);
            const max = Number(document.getElementById('max').value);
            const amount = Number(document.getElementById('amount').value);

            const vals = {
                min,
                max,
                amount,
            };

            errors = [];

            Object.entries(vals).forEach(([key, value]) => {
                document.getElementById(`item-${key}`).classList.remove('error');

                if (!isNaN(value)) {
                    switch (key) {
                        case 'min':
                            if (value < 0 || value > 1000) {
                                errors.push(key);
                            }

                            break;
                        default:
                            if (value <= 0 || value > 1000) {
                                errors.push(key);
                            }

                            break;
                    }
                } else {
                    errors.push(key);
                }
            });

            errors.forEach(item => {
                document.getElementById(`item-${item}`).classList.add('error');
            });

            if (errors.length === 0) {
                document.querySelector('.output').innerHTML = '';

                for (let i = 0; i < amount; i++) {
                    document.querySelector('.output').innerHTML += Math.floor(Math.random() * (max - min + 1)) + min + ' ';
                }
            }
        });
    }

    if (clearButton) {
        clearButton.addEventListener('click', function (e) {
            e.preventDefault();

            errors = [];

            ['min', 'max', 'amount'].forEach(val => {
                document.getElementById(val).value = '';
                document.getElementById(`item-${val}`).classList.remove('error');
            });

            document.querySelector('.output').innerHTML = '';
        });
    }
});
