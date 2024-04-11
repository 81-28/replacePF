// 
console.log('extention');

function escapeHTML(text){
    const box = document.createElement('p');
    box.textContent = text;
    return box.innerHTML;
}
// 0から指定された整数までのランダムな整数を返す関数
function getRandomInt(max) {
    return Math.floor(Math.random() * (max + 1));
}

// 素数判定する関数
function isPrime(n) {
    if (n <= 1) {
        return false;
    } else if (n <= 3) {
        return true;
    } else if (n % 2 === 0 || n % 3 === 0) {
        return false;
    }
    let i = 5;
    while (i * i <= n) {
        if (n % i === 0 || n % (i + 2) === 0) {
            return false;
        }
        i += 6;
    }
    return true;
}
// 素因数分解する関数
function primeFactors(n) {
    // 文字列を数値として扱う
    n = Number(n);
    const factors = [];
    // デカい素数を入れたときに、これだと時間かかる。例:33550337
    // でも、素因数がデカい合成数はなぜか速い。例:67100674
    // if (n < 2) {
    if (n < 2 || isPrime(n)) {
        factors.push(n);
    }else{
        let divisor = 2;
        while (n >= 2) {
            if (n % divisor === 0) {
                factors.push(divisor);
                n /= divisor;
            } else {
                divisor++;
            }
        }
    }
    return factors;
}
// 素因数分解結果をΠn^mで表す関数（HTML表示）
function primeFactorProductHTML(factors) {
    const product = {};

    for (let i = 0; i < factors.length; i++) {
        const factor = factors[i];
        product[factor] = (product[factor] || 0) + 1;
    }

    let result = '';
    for (const factor in product) {
        if (product.hasOwnProperty(factor)) {
            if (result !== '') {
                result += '*';
            }
            if (product[factor] === 1) {
                result += factor;
            } else {
                result += `${factor}<sup>${product[factor]}</sup>`;
            }
        }
    }
    return result;
}
// ランダムな合成数を返す関数
function generateRandomNumber(factors) {
    if (factors.length === 1) {
        // 素数等の場合、その数を返す
        return factors[0];
    } else {
        let result = 1;
        while (result == 1) {
            const product = {};
            for (let i = 0; i < factors.length; i++) {
                const factor = factors[i];
                product[factor] = (product[factor] || 0) + 1;
            }
            for (const factor in product) {
                if (product.hasOwnProperty(factor)) {
                    const exponent = getRandomInt(product[factor]);
                    result *= Math.pow(factor, exponent);
                }
            }
        }
        return result;
    }
}


function markText(num, pf = -1){
    if (pf == -1) {
        return `<mark class="PF_highlight_P">${num}</mark>`;
    } else {
        return `
            <div class="PF_container">
                <mark class="PF_hover-text PF_highlight">${num}</mark>
                <div class="PF_description">${pf}</div>
            </div>
        `;
    }
}
const regexNum = new RegExp('[0-9]+', 'g');
// HTMLテキストの数字をマークアップする関数
function markNumbers() {
    const body = document.body;
    const text = body.innerHTML;
    const newText = text.replace(/(^[^<]+<)|(>[^><]+<)|(>[^>]+$)/g, (_, group1, group2, group3) => {
        if (group1 !== undefined) {
            return group1.replace(regexNum, match => {
                const pf = primeFactorProductHTML(primeFactors(match));
                if (pf == Number(match)) {
                    return markText(match);
                } else {
                    return markText(match, pf);
                }
            });
        } else if (group2 !== undefined) {
            return group2.replace(regexNum, match => {
                const pf = primeFactorProductHTML(primeFactors(match));
                if (pf == Number(match)) {
                    return markText(match);
                } else {
                    return markText(match, pf);
                }
            });
        } else if (group3 !== undefined) {
            return group3.replace(regexNum, match => {
                const pf = primeFactorProductHTML(primeFactors(match));
                if (pf == Number(match)) {
                    return markText(match);
                } else {
                    return markText(match, pf);
                }
            });
        }
    });
    body.innerHTML = newText;
}
markNumbers();