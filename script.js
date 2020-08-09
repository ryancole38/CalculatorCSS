class Display{
    constructor(display){
        this.displayNumber = display.querySelector('.number');
        this.decimal = display.querySelector('.decimal');
        this.sign = display.querySelector('.sign');
        this.numberClasses = this.displayNumber.classList;
    }

    setNumber(character){
        this.numberClasses.remove('one');
        if(character.toString() === "0"){
            character = "O";
        } else if(character.toString() === "1"){
            character = "I";
            this.numberClasses.add('one');
        }
        this.displayNumber.innerHTML = character;
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
        if(this.sign !== null){
            this.sign.innerHTML = "";
        }
    }

}

class Screen{
    constructor(displayCount = 10){
        this.displayCount = displayCount;
        this.displays = this.getDisplays(this.displayCount);
        this.number = "0";
    }

    display(number){
        this.clearDisplay();
        let numberString = number.toString();
        let lengthWithDecimal = numberString.length;
        let decimalPlace = lengthWithDecimal - numberString.indexOf('.'); //get display that should show decimal
        numberString = numberString.replace('.', '');
        if(numberString.length > this.displayCount){
            numberString = "Err";
        }
        if(decimalPlace >= 0 && decimalPlace < lengthWithDecimal){
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
        //Check if inputRegister is empty, and remove leading zero if it is
        if(this.inputEmpty()  && this.operationsRegistersFull()){
            this.clearOperationsRegisters();
        }
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
        return (this.registerA !== '0' && this.registerA !== '') && (this.registerB !== '0' && this.registerB !== '');
    }

    clearOperationsRegisters(){
        this.registerA = '0';
        this.registerB = '0';
        console.log('registers cleared');
    }

    setOperator(operator){
        if(this.registerA === '0' || this.registerA === ''){
            this.registerA = this.inputRegister;
            this.inputRegister = '0';
        } else if(this.registerB === '0' || this.registerB === ''){
            this.registerB = this.inputRegister;
            this.inputRegister = '0';
            console.log('to register b');
        } else{
            this.registerB = '0';
            console.log('emptied register B');
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

        if(this.registerA === '0' || this.registerA === ''){
            this.registerA = this.inputRegister;
            this.inputRegister = '0';
        } else if(this.registerB === '0' || this.registerB === ''){
            this.registerB = this.inputRegister;
            this.inputRegister = '0';
        }
        this.inputRegister = '0';

        this.calculateResult();
        this.lastOperator = this.operator;
        this.operator = '';
    }

    calculateResult(){
        let A = Number(this.registerA);
        let B = Number(this.registerB);
        let result = 'Err'
        switch(this.operator){
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
                if(B !== 0)
                    result = A / B;
                break;
            case '':
                result = A;
                break;
            default:
                result = 'Err';
                break;
        }
        console.log(result);
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

    transferInputRegistertoRegisterA(){
        this.registerA = this.inputRegister;
        this.inputRegister = "0";
    }

    transferResultToInputRegister(){
        this.inputRegister = this.registerA;
    }

    clearInput(){
        this.inputRegister = "0";
        this.operator = "";
        this.lastOperator = "";
        this.screen.display(this.inputRegister);
    }

    clearAll(){
        this.inputRegister = "0";
        this.registerA = "0";
        this.registerB = "0"
        this.memoryRegister = "0";
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
}