class Display{
    constructor(display){
        this.displayNumber = display.querySelector('.number');
        this.decimal = display.querySelector('.decimal');
        this.sign = display.querySelector('.sign');
        this.numberClasses = this.displayNumber.classList;
    }

    setNumber(character){
        character = (character === '')? '0' : character;
        this.numberClasses.remove('one');
        if(character.toString() === "0"){
            character = "O";
        } else if(character.toString() === "1"){
            character = "I";
            this.numberClasses.add('one');
        }
        if(character === '-'){
            this.setSign(true);
        } else{
            this.displayNumber.innerHTML = character;
            this.setSign(false);
        }
        
    }

    setDecimal(bool){
        this.decimal.innerHTML = (bool) ? "." : "";
    }

    setSign(bool){
        if(this.sign !== null){
            this.sign.innerHTML = (bool) ? "-" : "";
        }
    }

    clear(){
        this.displayNumber.innerHTML = "";
        this.setDecimal(false);
        this.setSign(false);
    }

}

class Screen{
    constructor(displayCount = 10){
        this.displayCount = displayCount;
        this.displays = this.getDisplays(this.displayCount);
        this.number = "0";
    }

    display(number){
        number = (number === '')? '0' : number;
        this.clearDisplay();
        let numberString = number.toString();
        numberString = (numberString.toString().length > this.displayCount)? numberString.substring(0, this.displayCount + 1) : numberString;
        let lengthWithDecimal = numberString.length;
        let decimalPlace = lengthWithDecimal - numberString.indexOf('.'); //get display that should show decimal
        
        if(decimalPlace - 1 === 0 && numberString.length === this.displayCount + 1){
            numberString = 'Err';
        }

        numberString = numberString.replace('.', '');

        if(numberString.length > this.displayCount){
            numberString = "Err";
        }
        if(decimalPlace >= 0 && decimalPlace < lengthWithDecimal && numberString !== 'Err'){
            this.displays[decimalPlace - 1].setDecimal(true); //set decimal at place if string contains decimal
        } else {
            this.displays[0].setDecimal(true) //otherwise rightmost display should have decimal
        }
        for(let i = 0; i < numberString.length; i++ ){
            this.displays[numberString.length - 1 - i].setNumber(numberString.charAt(i));
        }
    }

    clearDisplay(){
        this.displays.forEach(function (display){
            display.clear();
        });
    }

    clearSign(){
        this.displays[this.displayCount - 1].clearSign();
    }

    getDisplays(number) {
        let displays = [];
        let screen = document.querySelector('.screen');
        for(let i = 0; i < number; i++){
            displays.push(new Display(screen.querySelector('#\\3' + i + ' ')));
        }

        return displays;
    }
}

class Calculator{
    constructor(screen){
        this.screen = screen;
        this.clearAll();
    }

    pushDigit(digit){
        if(digit.length > 1) throw new Error('Cannot push more than one digit at a time');
        
        if(this.inputEmpty()  && this.operationsRegistersFull()){
            this.clearOperationsRegisters();
        }
        //Check if inputRegister is empty, and remove leading zero if it is
        if(this.inputEmpty() && digit !== "."){
            this.inputRegister = "";
        }
        if(this.inputRegister.includes(".") && digit === "."){
            digit = "";
        }
        if(this.inputRegister.replace('.', '').length  >= this.screen.displayCount){
            digit = "";
        }
        this.inputRegister += digit;
        this.screen.display(this.inputRegister);
    }

    inputEmpty(){
        return this.inputRegister === '0' || this.inputRegister === '';
    }

    operationsRegistersFull(){
        return this.registerA !== '' && this.registerB !== '';
    }

    clearOperationsRegisters(){
        this.registerA = '';
        this.registerB = '';
    }

    recallMemory(){
        this.inputRegister = this.memoryRegister;
        this.screen.display(this.inputRegister);
    }

    incrementMemory(){
        if(this.inputRegister !== ''){
            this.memoryRegister += this.inputRegister;
        } else{
            this.memoryRegister += (this.registerA === '') ? 0 : this.registerA;
        }
    }

    decrementMemory(){
        if(this.inputRegister !== ''){
            this.memoryRegister -= this.inputRegister;
        } else{
            this.memoryRegister -= (this.registerA === '') ? 0 : this.registerA;
        }
    }

    setOperator(operator){
        this.inputRegister = (this.inputRegister === '')? '0' : this.inputRegister;

        if(this.registerA === ''){
            this.registerA = this.inputRegister;
            this.inputRegister = '';
        } else if(this.registerB === ''){
            this.registerB = this.inputRegister;
            this.inputRegister = '';
        } else{
            this.registerB = '';
        }
        if(this.operator !== ''){
            this.calculateResult();
        } 

        this.lastOperator = this.operator;
        this.operator = operator;

    }

    equalsPressed(){
        if(this.operator === ''){
            this.operator = this.lastOperator;
        }

        if(this.registerA === ''){
            this.registerA = this.inputRegister;
        } else if(this.registerB === ''){
            this.registerB = this.inputRegister;
        }
        this.inputRegister = '';

        this.calculateResult();
        this.lastOperator = this.operator;
        this.operator = '';
    }

    calculateResult(){
        this.registerA = (this.registerA === '') ? 0 : this.registerA;
        this.registerB = (this.registerB === '') ? 0 : this.registerB;

        let A = Number(this.registerA);
        let B = Number(this.registerB);
        let result = 'Err'
        switch (this.operator) {
            case '+':
                result = A + B;
                break;
            case '-':
                result = A - B;
                break;
            case '*':
                result = A * B;
                break;
            case '/':
                if (B !== 0)
                    result = A / B;
                break;
            case '':
                result = A;
                break;
            default:
                result = 'Err';
                break;
        }
        this.registerA = result.toString();
        this.screen.display(this.registerA);
    }

    squareRoot(){
        if(!this.inputEmpty()){
            this.inputRegister = Math.sqrt(Number(this.inputRegister)).toString();
            this.screen.display(this.inputRegister);
        } else{
            this.registerA = Math.sqrt(Number(this.registerA)).toString();
            this.screen.display(this.registerA);
        }
    }

    percent(){
        if(!this.inputEmpty()){
            if(this.operator === '*' || this.operator === "/"){
                this.inputRegister = this.inputRegister / 100;
            } else if(this.operator === '-' || this.operator === '+'){
                this.inputRegister = this.registerA * this.inputRegister / 100;
            } else{
                this.inputRegister = '';
            }
        } else{
            this.inputRegister = '';
        }
        this.screen.display(this.inputRegister);
    }

    transferInputRegistertoRegisterA(){
        this.registerA = this.inputRegister;
        this.inputRegister = "";
    }

    transferResultToInputRegister(){
        this.inputRegister = this.registerA;
    }

    clearInput(){
        this.inputRegister = "";
        this.operator = "";
        this.lastOperator = "";
        this.screen.display(this.inputRegister);
    }

    clearAll(){
        this.inputRegister = "";
        this.registerA = "";
        this.registerB = ""
        this.memoryRegister = "";
        this.operator = "";
        this.lastOperator = "";
        this.screen.display(this.inputRegister);
    }


}

document.addEventListener("DOMContentLoaded", function(){
    let screen = new Screen(10);
    let calculator = new Calculator(screen);

    registerNumberEvents(calculator);
    registerMemoryEvents(calculator);
    registerOperatorEvents(calculator);
    registerFunctionEvents(calculator);

    html = document.getElementsByTagName('html')[0];
    html.style.fontSize = '1px';
});

function registerNumberEvents(calculator){
    keyboard = document.querySelector('.grid-container');
    keyboard.querySelector('#period').addEventListener("mousedown", function(){
        calculator.pushDigit('.');
    });
    for(let i = 0; i < 10; i++){
        keyboard.querySelector('#\\3' + i + ' ').addEventListener("mousedown", function(){
            calculator.pushDigit(i);
        });
    }
}

function registerMemoryEvents(calculator){
    keyboard = document.querySelector('.grid-container');
    keyboard.querySelector('#C').addEventListener("mousedown", function(){
        calculator.clearInput();
    });
    keyboard.querySelector('#AC').addEventListener("mousedown", function(){
        calculator.clearAll();
    });

    keyboard.querySelector('#MR').addEventListener("mousedown", function(){
        calculator.recallMemory()
    });
    keyboard.querySelector('#M-minus').addEventListener("mousedown", function(){
        calculator.decrementMemory();
    });
    keyboard.querySelector('#M-plus').addEventListener("mousedown", function(){
        calculator.incrementMemory();
    });
}

function registerOperatorEvents(calculator){
    keyboard = document.querySelector('.grid-container');
    keyboard.querySelector('#plus').addEventListener("mousedown", function(){
        calculator.setOperator('+');
    });
    keyboard.querySelector('#minus').addEventListener("mousedown", function(){
        calculator.setOperator('-');
    });
    keyboard.querySelector('#multiply').addEventListener("mousedown", function(){
        calculator.setOperator('*');
    });
    keyboard.querySelector('#divide').addEventListener("mousedown", function(){
        calculator.setOperator('/');
    });
    keyboard.querySelector('#equals').addEventListener("mousedown", function(){
        calculator.equalsPressed();
    });
}

function registerFunctionEvents(calculator){
    keyboard = document.querySelector('.grid-container');
    keyboard.querySelector('#square-root').addEventListener("mousedown", function(){
        calculator.squareRoot();
    });
    keyboard.querySelector('#percent').addEventListener("mousedown", function(){
        calculator.percent();
    });
}