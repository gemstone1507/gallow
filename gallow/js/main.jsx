const app = document.getElementById('app');

class Start extends React.Component {
    constructor(secretWordArr, gameWord, falseLetters) {
        super();
        this.left = 6; // количество прав на ошибку
        this.falseLetters = [] //не верный буквы
        this.gameWord = []; //Слово которое ввели
        this.secretWordArr = []; // массив со * вместо букв
        this.state = { winBlock: false }; // блок при победе
        this.state = { loseBlock: false }; // блок при проиграше
        this.state = { playField: false } //отображение игрового поля
        this.rememberWord = this.rememberWord.bind(this);
        this.letterCheck = this.letterCheck.bind(this);
        this.restart = this.restart.bind(this);
    }
    rememberWord() { //считование введеного слова
        this.gameWord.length = 0;
        this.secretWordArr.length = 0;
        this.falseLetters.length = 0;
        const value = this.refs.gameWord.value.toLowerCase();
        let digits = /([0-9])+/g; //проверка на наличие цыфр в слове
        if(digits.test(value) || value === ''){
            alert('Вы ввели число или отправили пустую строку, пожалуйста, попробуйте ещё раз');
            this.refs.gameWord.value = '';
            return this.setState({ playField: false});
        }
        this.gameWord = value.split('');
        this.setState({ playField: true });
        for (let i = 0; i < this.gameWord.length; i++) {
            this.secretWordArr.push('*');
        }
    }

    letterCheck() { // считование и проверка введой буквы, одна попытка
        let oneLetter = this.refs.letter.value.toLowerCase();
        this.refs.letter.value = '';
        
        let leftStepsCheck = false;// проверка сколько есть ещё попыток
        let unknowLetCheck = false;//проверка на наличие неизвестных букв
        for (let i = 0; i < this.gameWord.length; i++) {
            if (this.gameWord[i] === oneLetter && this.secretWordArr[i] !== oneLetter) {
                this.secretWordArr[i] = oneLetter;
                leftStepsCheck = true;
            }
            if (this.secretWordArr[i] === '*') {
                unknowLetCheck = true;
            }
        }
        if (!unknowLetCheck) {
            this.setState({ playField: false });
            this.setState({ winBlock: true });
        }
        if (!leftStepsCheck) {
            this.left--;
            this.falseLetters.push(oneLetter);

            if (this.left < 1) {
                this.setState({ playField: false });
                this.setState({ loseBlock: true });
            }
        }
        this.setState({ left: this.left });

    }
    restart() {
        this.setState({ playField: false });
        this.setState({ loseBlock: false });
        this.setState({ winBlock: false });
    }
    beforeStart() { //Блок при запуске игры
        return (
            <div>
                <p>Введите слово</p>
                <input type="text" ref='gameWord' placeholder='Введите слово' onKeyPress={this.pressed}/>
                <button className="btn send" onClick={this.rememberWord}>Подтвердить</button>
            </div>
        )
    }
    afterStart() { // Блок после загадоного слова
        return (
            <div>
                <span>Загаданое слово  <p>{this.secretWordArr}</p></span>

                <p>Осталось попыток  <p className='counter'>{this.left}</p></p>
                <p>Введите букву </p>
                <input type="text" ref='letter' placeholder='Введите букву' maxLength="1" />
                <button className="btn send" onClick={this.letterCheck}>Подтвердить</button>
                <div> Отсутствуют в слове буквы <p>{this.falseLetters}</p></div>
            </div>
        )
    }
    winBlock() { // Блок победы
        return (
            <div>
                <p className='success'>YOU WIN!!!!</p>
                <div>Загаданое слово <p>{this.secretWordArr}</p></div>
                <button className="btn restart" onClick={this.restart}>Играть ещё</button>
            </div>
        )
    }
    loseBlock() { // Блок проиграша
        return (
            <div>
                <p className='failure'>YOU LOSE!!!!</p>
                <div>Загаданое слово <p>{this.gameWord}</p></div>
                <button className="btn restart" onClick={this.restart}>Играть ещё</button>
            </div>
        )
    }
    pressed(e){
        let key = e.keyCode || e.which;
        if(key == 13){
         super.letterCheck();
    }
    }

    render() {
        if (this.state.playField) {
            return this.afterStart();
        }
        else if (this.state.winBlock) {
            return this.winBlock();
        }
        else if (this.state.loseBlock) {
            return this.loseBlock();
        }
        else {
            return this.beforeStart();
        }
    }
}

ReactDOM.render(
    <Start />,
    app
);