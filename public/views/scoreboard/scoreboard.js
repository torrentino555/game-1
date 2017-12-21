import Block from '../baseview';
import './scoreboard.scss';
import UserService from '../../servises/user-service'

const score= new UserService();
const players = [{

}];

const rowValues = [`Username`,`Frags`,`Sources`]

 const buttons = [`first`,`second`,`third`,`four`];
class Scoreboard extends Block {
    constructor() {
        super('div', ['score'], {});
    }


    creation() {
         score.scores();
        const wrape = document.querySelector('div.wrapper');
         //document.querySelector('div.menu').style.visibility = hidden;

        if (document.querySelector('div.menu') !== undefined) {
            document.querySelector('div.menu').remove();
        }
        wrape.appendChild(this._element);
        this.appendChildBlock('table',new Block('table',['table']));

        const table =  new Block(document.querySelector('table.table'));

        for (let i = 0; i < 6;++i) {
            table.appendChildBlock('data',new Block('tr',['data']))
        }
        const array = document.getElementsByTagName('tr') ;
        let value = array[0];
        for (let i = 0;i<3;++i) {
            value.appendChild(document.createElement('th') );
            document.querySelector('tr.data').childNodes[i].innerHTML = `${rowValues[i]}`;
        }
        for (let i = 0;i<3;++i) {
            value.appendChild(document.createElement('th') );
            document.querySelector('tr.data').childNodes[i].innerHTML = `${rowValues[i]}`;
        }

        for (let i = 0;i<4;++i) {
            for (let j = 0;j<3;++j) {
                array[i].appendChild(document.createElement('td') );
                array[i].childNodes[j].innerHTML = `${rowValues[j]}`;
            }
        }

        //
     //    this.appendChildBlock('scoreboard',new Block('ul', ['scoreboard']));
     //    for (let i = 0 ; i < 4; ++i) {
     //        document.querySelector('ul','scoreboard').appendChild(document.createElement('li'));
     //    }
     //    let allPlayers = document.getElementsByTagName('li');
     // for(let i = 0 ; i < 4; ++i) {
     //        allPlayers[i].appendChild(document.createElement('span')).setAttribute('class','username'+ buttons[i]);
     //        // document.querySelector('span.username').innerHTML = `test`;
     //           allPlayers[i].appendChild(document.createElement('span')).setAttribute('class','points'+ buttons[i]);
     //        // document.querySelector('span.points').innerHTML = `tester`;
     //
     //    }
     //    for (let i = 0; i<4 ;++i) {
     //        let but = document.querySelector(`span.username` + buttons[i]);
     //        but.innerHTML = `${buttons[i]}: `;
     //        let sec = document.querySelector(`span.points` + buttons[i]);
     //        sec.innerHTML = `${buttons[i]}`;
     //    }
    }

}
export default Scoreboard;

