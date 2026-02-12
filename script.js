// 初期
const display = document.getElementById("display");
let currentInput = "0";
let previousInput = "";
let operator = "";
const MAX_LENGTH = 15;
let lastOperator = "";
let lastOperand = "";


// 数値入力
const numberButtons = document.querySelectorAll('.button-title');
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        const start = performance.now(); // 開始時間
        const value = button.getAttribute('data-value') || button.textContent.trim();

        // 数値・小数点の入力
        if ((!isNaN(value) || value === '.') && currentInput.length < MAX_LENGTH) {
            if (value === '.' && currentInput.includes('.')) return;

            // 初期が "0" の場合は置き換える
            if (currentInput === "0" || currentInput === "") {
                currentInput = value === '.' ? "0." : value;
            } else {
                currentInput += value;
            }

            display.value = formatNumber(currentInput);
        }


        // 演算子（+ - * /）
        else if (['＋', 'ー', '×', '÷'].includes(value)) {
            if (currentInput === "") return;

            if (previousInput !== "" && operator !== "") {
                const result = calculate(parseFloat(previousInput), parseFloat(currentInput), operator);
                previousInput = result.toString();
                display.value = formatNumber(previousInput);
                currentInput = "";
            } else {
                previousInput = currentInput;
                currentInput = "";
            }

            operator = value;
        }

        // 計算実行
        else if (value === '＝') {
            let result;
            if (previousInput !== "" && operator !== "") {
                result = calculate(parseFloat(previousInput), parseFloat(currentInput), operator);
                lastOperator = operator;
                lastOperand = currentInput;
                previousInput = "";
                operator = "";
            } else if (lastOperator !== "" && lastOperand !== "") {
                result = calculate(parseFloat(currentInput), parseFloat(lastOperand), lastOperator);
            } else {
                return;
            }

            if (result === "エラー") {
                display.value = "０で割ることはできません";
                currentInput = "";
                previousInput = "";
                operator = "";
                lastOperator = "";
                lastOperand = "";
                return;
            }
            if (typeof result === "number") {
                result = parseFloat(result.toFixed(15));
            }

            display.value = formatNumber(parseFloat(result.toString()).toString());
            currentInput = result.toString();
            previousInput = "";
            operator = "";
        }

        // 全体クリア（C）
        else if (value === 'C') {
            currentInput = "0";
            previousInput = "";
            operator = "";
            lastOperator = "";     
            lastOperand = "";
            display.value = "0";
        }

        // エントリクリア（CE）
        else if (value === 'CE') {
            currentInput = "0";
            display.value = "0";
        }

        // バックスペース（←）
        else if (value === '←') {
            currentInput = currentInput.slice(0, -1) || "0";
            display.value = formatNumber(currentInput);
        }

        // 正負反転（+/-）
        else if (value === '+/-') {
            if (currentInput === "") return;
            if (parseFloat(currentInput) === 0) return;
            if (currentInput.startsWith('-')) {
                currentInput = currentInput.slice(1);
            } else {
                currentInput = '-' + currentInput;
            }
            display.value = formatNumber(currentInput);
        }
        requestAnimationFrame(() => {
            const end = performance.now(); // 描画後の時間
            console.log(`${value} の処理時間: ${end - start} ms`);
        });
    });
});

// 計算処理
function calculate(num1, num2, op) {
    switch (op) {
        case '＋':
            return num1 + num2;
        case 'ー':
            return num1 - num2;
        case '×':
            return num1 * num2;
        case '÷':
            return num2 !== 0 ? num1 / num2 : "エラー";
        default:
            return "エラー";
    }
}

display.value = formatNumber(currentInput);

// 数字フォーマット（3桁区切り）
function formatNumber(str) {
    if (str === "") return "";
    if (str === "エラー") return str;
    const parts = str.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join('.');
}


console.assert(calculate(2, 3, '＋') === 5, "Test 1 Failed");
console.assert(calculate(5, 0, '÷') === "エラー", "Test 2 Failed");
console.assert(calculate(-5, -2, '＋') === -7, "Test 3 Failed");
console.assert(formatNumber("1234567") === "1,234,567", "Test 4 Failed");
console.assert(formatNumber("0") === "0", "Test 5 Failed");