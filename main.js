let exchangeRates = {};
        let lastUpdateTime = null;

        const fromAmount = document.getElementById('fromAmount');
        const toAmount = document.getElementById('toAmount');
        const fromCurrency = document.getElementById('fromCurrency');
        const toCurrency = document.getElementById('toCurrency');
        const swapBtn = document.getElementById('swapBtn');
        const resultValue = document.getElementById('resultValue');
        const resultText = document.getElementById('resultText');
        const rateInfo = document.getElementById('rateInfo');
        const errorDiv = document.getElementById('error');
        const successDiv = document.getElementById('success');
        const loadingDiv = document.getElementById('loading');
        const lastUpdateDiv = document.getElementById('lastUpdate');

        async function fetchExchangeRates() {
            try {
                loadingDiv.style.display = 'block';
                errorDiv.textContent = '';
                swapBtn.disabled = true;

                const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
                
                if (!response.ok) {
                    throw new Error('Ошибка при загрузке курсов валют');
                }

                const data = await response.json();
                exchangeRates = data.rates;
                lastUpdateTime = new Date().toLocaleString('ru-RU');

                loadingDiv.style.display = 'none';
                successDiv.textContent = '✓ Курсы валют обновлены';
                lastUpdateDiv.textContent = `Последнее обновление: ${lastUpdateTime}`;
                
                setTimeout(() => {
                    successDiv.textContent = '';
                }, 3000);

                swapBtn.disabled = false;
                convert();

            } catch (error) {
                loadingDiv.style.display = 'none';
                errorDiv.textContent = '⚠ ' + error.message + '. Попробуйте обновить страницу.';
                resultText.textContent = 'Ошибка загрузки данных';
                swapBtn.disabled = false;
            }
        }

        function convert() {
            const amount = parseFloat(fromAmount.value);
            const from = fromCurrency.value;
            const to = toCurrency.value;

            if (isNaN(amount) || amount < 0) {
                errorDiv.textContent = 'Введите корректную сумму';
                return;
            }

            if (Object.keys(exchangeRates).length === 0) {
                return;
            }

            errorDiv.textContent = '';

            const amountInUSD = amount / exchangeRates[from];
            const result = amountInUSD * exchangeRates[to];

            toAmount.value = result.toFixed(2);
            resultValue.textContent = result.toFixed(2);
            resultText.textContent = `${amount} ${from} = ${result.toFixed(2)} ${to}`;

            const rate = (exchangeRates[to] / exchangeRates[from]).toFixed(4);
            rateInfo.textContent = `Курс: 1 ${from} = ${rate} ${to}`;
        }

        function swap() {
            const tempCurrency = fromCurrency.value;
            fromCurrency.value = toCurrency.value;
            toCurrency.value = tempCurrency;
            convert();
        }

        fromAmount.addEventListener('input', convert);
        fromCurrency.addEventListener('change', convert);
        toCurrency.addEventListener('change', convert);
        swapBtn.addEventListener('click', swap);

        fetchExchangeRates();