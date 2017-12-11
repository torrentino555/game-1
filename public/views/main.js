import Block from './baseview';

import RegistrationValidate from '../blocks/autheficate/registrationAuth';
import LoginValidate from '../blocks/autheficate/loginAuth';

import Router from "../modules/router";

import UserService from '../servises/user-service';
import Mediator from '../modules/mediator'
const userService = new UserService();
const application = new Block(document.getElementById('application'));

const wrapper = new Block('div', ['wrapper']);
const game = new Block('div', ['game']);

const images = "logo";
const imageWall = "wall";


application.appendChildBlock('application', wrapper);
application.appendChildBlock("logo",
    new Block('img', [images]));
application.appendChildBlock("wall",
    new Block('img', [imageWall]));
const logo = document.querySelector('img.logo');
logo.setAttribute('src','../images/logo2.png');

const wall = document.querySelector('img.wall');
wall.setAttribute('src','../images/banner.png');

 function signin(login) {
    login.onSubmit((formdata) => {
        const authValidation = LoginValidate(formdata[0], formdata[1]);
        console.log(formdata[0], formdata[1]);
        if (authValidation === false) {
            return;
        }
        userService.login(formdata[0], formdata[1])
            .then(() => new Router().go('/game'))
            .then (() =>document.querySelector('form.login-form').remove())
            .then(() => {
                let logout = document.querySelector('a.back');
                logout.addEventListener('click', function () {
                    document.querySelector('div.choose').remove();
                    userService.logout()
                    new Router().go('/')
                })
            })
         //   .then (() => new Mediator().publish('VIEW_LOAD'))
    });
}

 function signup(registration) {
     registration.onSubmit((formdata) => {
         const authValidation = RegistrationValidate(formdata[0], formdata[1], formdata[2], formdata[3]);
         if (authValidation === false) {
             return;
         }
         userService.signup(formdata[0], formdata[1], formdata[2])
             .then(() => new Router().go('/game'))
             .then (() =>document.querySelector('form.registration-form').remove())
             .then(() => {
                 let logout = document.querySelector('a.back');
                 logout.addEventListener('click', function () {
                     userService.logout()
                     document.querySelector('div.choose').remove();
                     new Router().go('/')
                 })
             })
        //     .then (() => new Mediator().publish('VIEW_LOAD'))
     });
 }

export {signup,signin};


