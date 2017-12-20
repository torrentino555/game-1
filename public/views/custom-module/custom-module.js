'use strict'

export default class Custom extends Block {
    constructor() {
        super('div', ['win'], {});
    }

    creation() {
        const wrape = document.querySelector('div.wrapper');

        wrape.appendChild(this._element);
        const overlay  = new Block('div','overlay');
        const visible  = new Block('div','visible');
        this.appendChildBlock('div',overlay);
        this.appendChildBlock('div',visible);
        document.querySelector('visible').innerHTML = `<h3>Sorry, it is game only for laptop view !</h3>`;
        visible.appendChildBlock('p',new Block('p','link'));
        const button = document.getElementsByTagName('p');
        button.innerHTML = `<a class = "">Close</a>`
         // visible.appendChildBlock()
        // authors.forEach((i) => {
        //     this.appendChildBlock('li',new Block('li', [i.name]));
        //     let but  =  document.querySelector('li.' + i.name);
        //     but.innerHTML = `<a>${i.name}</a>`;
        //     but.querySelector('a').setAttribute('href',i.link);
        // });
    }

}
export default Info;

