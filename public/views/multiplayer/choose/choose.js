import './choose.scss'
import Custom from '../../custom-module/custom-module'
const classes  = [`single`,`multi`]

export default class GameType {
    creation() {
        let variant = wrape.appendChild(document.createElement("div"));
        variant.setAttribute('class', 'variant')

        for (let i = 0; i < 2; ++i) {
            variant.appendChild(document.createElement("a"));
        }
        let buttons = document.getElementsByTagName('a');

        for (let i = 0; i < 2; ++i) {
            buttons[i].setAttribute('class', classes[i])
            buttons[i].innerHTML = button[i];
        }
        document.querySelector('a.multi').addEventListener('click',() =>{
            new Custom().creation('Coming soon....')
        })
    }
}
