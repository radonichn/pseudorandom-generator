async function generate(output, amount, min, max) {
  let counter = 0;
  let iterationCounter = 0;
  let prev = null;

  let result = '';

  while (counter < amount) {
    ++iterationCounter;
    const randomValue = Math.floor(Math.random() * (max - min + 1)) + min;

    if (counter && prev === randomValue) {
      continue;
    }

    prev = randomValue;

    ++counter;
    result += `<span class="random-number">${prev} </span>`;
  }

  output.innerHTML = result;
  console.log(`Count of iteration ${iterationCounter}`);
}

document.addEventListener('DOMContentLoaded', function() {
  const submitButton = document.querySelector('.submit');
  const clearButton = document.querySelector('.clear');

  let errors = [];

  function clear() {
    errors = [];

    ['min', 'max', 'amount'].forEach(val => {
      document.getElementById(val).value = '';
      document.getElementById(`item-${val}`).classList.remove('error');
    });

    document.querySelector('.output').innerHTML = '';
  }

  if (submitButton) {
    submitButton.addEventListener('click', function(e) {
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
        document.querySelector(`.err-${key}`).innerHTML = '';

        if (!isNaN(value)) {
          switch (key) {
            case 'min':
              if (value < 0 || value > 10000) {
                errors.push({
                  [key]:
                    'The min value should be number in range from 0 to 10000',
                });

                break;
              }
              if (value >= max) {
                errors.push({
                  [key]: 'The min value should be less than the max value',
                });
              }

              break;

            case 'max':
              if (value <= 0 || value > 10000) {
                errors.push({
                  [key]: 'The value should be number in range from 1 to 10000',
                });

                break;
              }

              if (value <= min) {
                errors.push({
                  [key]: 'The max value should be greater than the min value',
                });
              }

              break;

            default:
              if (value <= 0 || value > 10000) {
                errors.push({
                  [key]: 'The value should be number in range from 1 to 10000',
                });
              }

              break;
          }
        } else {
          errors.push({ [key]: 'The value should be number' });
        }
      });

      errors.forEach(err => {
        Object.entries(err).forEach(([key, value]) => {
          document.getElementById(`item-${key}`).classList.add('error');
          document.querySelector(`.err-${key}`).innerHTML += `${value}<br />`;
        });
      });

      if (errors.length === 0) {
        const output = document.querySelector('.output');
        output.innerHTML = '';

        generate(output, amount, min, max);
      }
    });
  }

  if (clearButton) {
    clearButton.addEventListener('click', function(e) {
      e.preventDefault();

      clear();
    });
  }
});
