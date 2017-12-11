import Block from '../baseview';
import './main-page.scss';
import ChangeTheme from './mainStyle';
const imageWall = "wall";

export const buttons = [
    {
        name: 'First',
        text: 'New Game',
        value: '/login'

    },
    {
        name: 'Second',
        text: 'Singleplayer',
        value:'/singleplayer'

    },
    {
        name: 'Third',
        text: 'Registration',
            value: '/signup'
    },
    {
        name: 'Four',
        text: 'Information',
        value:'/info'

    }
];

const blockClass = 'button';

export class MainPage extends Block {
    constructor() {
        super('div', ['main-menu'], {});
        this.createChildren();
        return this;
    }

    createChildren() {
        buttons.forEach((button) => {
            this.appendChildBlock(button.name,
                new Block('a', [blockClass + button.name]).setText(button.text))
        });
    }
    creation() {
        if (document.querySelector('img.wall') === null){
            const application = document.getElementById('application');
            this.appendChildBlock('wall',new Block ('img',['wall']))
            application.appendChild(this._element);
        }
      const wrape = document.querySelector('div.wrapper');
        if (wrape.childNodes[0] !== undefined) {
            wrape.removeChild(wrape.childNodes[0])
        }
         wrape.appendChild(this._element);

        const linkFirst = document.querySelector('a.buttonFirst');
        linkFirst.setAttribute('value','/login');

        const linkSecond = document.querySelector('a.buttonSecond');
        linkSecond.setAttribute('value','/singleplay');

        const linkThird= document.querySelector('a.buttonThird');
        linkThird.setAttribute('value','/signup');
        const linkFour = document.querySelector('a.buttonFour');
        linkFour.setAttribute('value','/info');

        const logo = document.querySelector('img.logo');
        logo.setAttribute('src','../images/logo2.png');
    }
 }
export default MainPage;

