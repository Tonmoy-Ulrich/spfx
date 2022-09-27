export interface RomanSymbol {
    symbol: string;
    number: number;
}

export function romanToString(val: number): string {
    const roman: RomanSymbol[] = [
        { symbol: "_M", number: 1000000 },
        { symbol: "_D", number: 500000 },
        { symbol: "_C", number: 100000 },
        { symbol: "_L", number: 50000 },
        { symbol: "X̅", number: 10000 },
        { symbol: "V̅", number: 5000 },
        { symbol: "M", number: 1000 },
        { symbol: "D", number: 500 },
        { symbol: "C", number: 100 },
        { symbol: "L", number: 50 },
        { symbol: "X", number: 10 },
        { symbol: "V", number: 5 },
        { symbol: "I", number: 1 },
    ];

    const negative: boolean = val < 0.0;
    if (negative) val = -val;
    let integer: number = Math.floor(val);
    if (integer === 0) return "nihil";
    let sText: string = "";
    if (negative) sText += "minus ";
    if (integer > 10000000 || integer > 80 * roman[0].number)
        return "Sorry, number is too big for Roman Numerals";

    for (let iDigit: number = 0; iDigit < roman.length; iDigit++) {
        const n: number = Math.floor(integer / roman[iDigit].number);
        integer = integer % roman[iDigit].number;
        for (let i: number = 1; i <= n; i++) sText += roman[iDigit].symbol;
        if (
            iDigit % 2 === 0 &&
            iDigit + 2 < roman.length &&
            Math.floor(integer / (roman[iDigit + 2].number * 9)) > 0
        ) {
            sText += roman[iDigit + 2].symbol;
            sText += roman[iDigit].symbol;
            integer -= roman[iDigit + 2].number * 9;
        }
        if (
            iDigit + 1 < roman.length &&
            Math.floor(integer / (roman[iDigit + 1].number * 4)) > 0
        ) {
            sText += roman[iDigit + 1].symbol;
            sText += roman[iDigit].symbol;
            integer -= roman[iDigit + 1].number * 4;
        }
    }
    return sText;
}
