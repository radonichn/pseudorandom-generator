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
                            if (value < 0 || value > 10000) {
                                errors.push({ [key]: 'The min value should be number in range from 0 to 10000', });

                                break;
                            }
                            if (value >= max) {
                                errors.push({ [key]: 'The min value should be less than the max value', });
                            }

                            break;

                        case 'max':
                            if (value <= 0 || value > 10000) {
                                errors.push({ [key]: 'The value should be number in range from 1 to 10000', });

                                break;
                            }
                            if (value <= min) {
                                errors.push({ [key]: 'The max value should be greater than the min value', });
                            }


                        default:
                            if (value <= 0 || value > 10000) {
                                errors.push({ [key]: 'The value should be number in range from 1 to 10000', });
                            }

                            break;
                    }
                } else {
                    errors.push({ [key]: 'The value should be number', });
                }
            });

            console.log(errors);

            errors.forEach(err => {
                Object.entries(err).forEach(([key, value]) => {
                    document.getElementById(`item-${key}`).classList.add('error');
                    document.querySelector(`.err-${key}`).innerHTML += `${value}<br />`;
                });
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
