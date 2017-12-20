import Block from '../baseview';
import './scoreboard.scss';

const players = [{

}];



 const buttons = [`first`,`second`,`third`,`four`];
class Scoreboard extends Block {
    constructor() {
        super('div', ['score'], {});
    }


    creation() {

        const wrape = document.querySelector('div.menu');

        if (document.querySelector('div.menu').childNodes[0] !== undefined) {
            document.querySelector('div.menu').removeChild(document.querySelector('div.menu').childNodes[0]);
        }
        wrape.appendChild(this._element);


        this.appendChildBlock('scoreboard',new Block('ul', ['scoreboard']));
        for (let i = 0 ; i < 4; ++i) {
            document.querySelector('ul','scoreboard').appendChild(document.createElement('li'));
        }
        let allPlayers = document.getElementsByTagName('li');
     for(let i = 0 ; i < 4; ++i) {
            allPlayers[i].appendChild(document.createElement('span')).setAttribute('class','username'+ buttons[i]);
            // document.querySelector('span.username').innerHTML = `test`;
               allPlayers[i].appendChild(document.createElement('span')).setAttribute('class','points'+ buttons[i]);
            // document.querySelector('span.points').innerHTML = `tester`;

        }
        for (let i = 0; i<4 ;++i) {
            let but = document.querySelector(`span.username` + buttons[i]);
            but.innerHTML = `${buttons[i]}: `;
            let sec = document.querySelector(`span.points` + buttons[i]);
            sec.innerHTML = `${buttons[i]}`;
        }
    }

}
export default Scoreboard;

