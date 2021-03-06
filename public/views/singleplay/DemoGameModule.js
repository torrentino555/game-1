import InitiativeLine from './InitiativeLine';
import Unit from './Unit';
import Pathfinding from './Pathfinding';
import Background from './Background';
import GameManager from './GameManager';

/*export default */
export default class DemoGameModule {
    constructor() {
        this.gameManager = new GameManager();
        this.WIDTH = 16;
        this.HEIGHT = 12;
        this.PARTYSIZE = 4;
        this.ENEMIESSIZE = 5;
        this.kek = 3;
        this.NOTWALL = 0;
        this.WALL = 1;
        this.players = [];
        this.enemies = [];
        this.initiativeLine = new InitiativeLine();
        this.activeUnit = null;
        this.timer = 600000000;
        this.intervalId = 0;
        this.interval = 100;
    }

    gameStart() {
        this.gamePrepare();
        this.startGameLoop();
    }

    gamePreRender() {
        let numberSchene = 0;
        this.back = new Background(numberSchene);
        this.back.render();
        this.gameManager.startGameRendering(this.gameStart.bind(this));
    }

    gamePrepare() {
        this.players = this.generatePlayers();
        this.enemies = this.generateEnemies();
        this.initiativeLine.PushEveryone(this.players, this.enemies);
        this.setPlayersPositions(this.players);
        this.setEnemiesPositions(this.enemies);
        GameManager.log('Everyone on positions!', 'green');

        for (let i = 0; i < this.PARTYSIZE + this.ENEMIESSIZE; i++) {
            this.gameManager.unitManager.addUnit(this.initiativeLine.queue[i]);
        }

        this.activeUnit = this.initiativeLine.CurrentUnit();
        GameManager.log(this.activeUnit.name + ' - let\'s start with you!');
        this.gameManager.unitManager.activeUnit(this.activeUnit);
        this.sendPossibleMoves();
    }


    gameLoop() {
        if (!this.isPartyDead() && !this.isEnemiesDead()) {
            this.timer -= this.interval;
            let sec = Math.ceil(this.timer/1000);
            if (sec < 10) {
                sec = '0' + sec;
            }
            document.getElementById('time').innerHTML = 'Skip';
            //где-то здесь есть работа с АИ
            //отрисовка скилов для каждого персонажа, информация для dropdown и позиций
            if (global.actionDeque.length > 0) {
                let action = global.actionDeque.shift();
                if (action.isAbility() && this.activeUnit.isCooldown(action.ability.name) > 0) {
                    GameManager.log("YOU CAN'T USE SKILLS WITH CURRENT COOLDOWN > 0", 'red');
                } else {
                    GameManager.log('ACTION!', 'green');
                    this.activeUnit.actionPoint--;
                    this.activeUnit.cooldownDecrement();
                    if (action.isMovement() && !action.target.isOccupied()) {
                        this.makeMove(action);
                        // } else if (action.isPrepareAbility()) {
                        //     this.makePrepareAbility(action);
                    } else if (action.isAbility()) {
                        this.activeUnit.setCooldown(action.ability.name);
                        GameManager.log('this is ability: ' + action.ability.name);
                        if (action.ability.damage[1] < 0) {
                            this.makeHill(action);
                        } else if (action.ability.damage[1] > 0) {
                            this.makeDamage(action);
                        }
                    } else if (action.isSkip()) {
                        this.skipAction();
                    }

                    if (this.activeUnit.actionPoint === 1) {
                        this.sendPossibleMoves();
                    }
                }
            }

            if (this.activeUnit.actionPoint === 0 || Math.ceil(this.timer / 1000) === 0 || this.activeUnit.isDead()){
                this.skipAction();
            }
        } else {
            if (this.isPartyDead()) {
                this.loseGame();
            }

            if (this.isEnemiesDead()) {
                this.winGame();
            }
        }
    }

    // makePrepareAbility(action) {
    //     if (action.ability.typeOfArea === "circle") {
    //     }
    // }

    makeMove(action) {
        GameManager.log(action.sender.getInhabitant().name + ' make move from [' + action.sender.xpos + ',' + action.sender.ypos + ']' + ' to [' + action.target.xpos + ',' + action.target.ypos + ']');
        let toMove = action.sender.getInhabitant();
        let pathfinding = new Pathfinding(action.sender, global.tiledMap);
        let allMoves = pathfinding.possibleMoves();
        let path = [];
        let currentTile = action.target;
        while (allMoves.get(currentTile) !== null) {
            path.push(currentTile);
            //GameManager.log('current tile - [' + currentTile.xpos + ']' + '[' + currentTile.ypos + ']');
            currentTile = allMoves.get(currentTile);
        }
        this.gameManager.animtaionManager.movingTo(action.sender, path);
        action.sender.unoccupy();
        action.target.occupy(toMove);
        this.activeUnit.xpos = action.target.xpos;
        this.activeUnit.ypos = action.target.ypos;
        //GameManager.log('check on unoccupy: ' + action.sender.isOccupied());
        //GameManager.log('check on occupy: ' + action.target.isOccupied());
    }

    makeHill(action) {
        let healedAllies = [];
        //AOE HILL
        if(action.ability.typeOfArea === 'circle') {
            GameManager.log('THIS IS AOE HILL');
            for(let i = action.target.xpos-action.ability.area; i <= action.target.xpos + action.ability.area; i++) {
                for(let j = action.target.ypos-action.ability.area; j <= action.target.ypos + action.ability.area; j++) {
                    if(i >= 0 && j >= 0 && i < this.WIDTH && j < this.HEIGHT) {
                        //GameManager.log('WTF is ' + i + ' ' + j);
                        if(global.tiledMap[i][j].isOccupied() && global.tiledMap[i][j].getInhabitant().type === action.sender.getInhabitant().type) {
                            // GameManager.log('this is AOE hill on someone: ' + i + ' ' + j);
                            healedAllies.push(global.tiledMap[i][j].getInhabitant());
                            // GameManager.log('health before: ' +global.tiledMap[i][j].getInhabitant().healthpoint);
                            action.sender.getInhabitant().useHealSkill(global.tiledMap[i][j].getInhabitant(), action.ability);
                            // GameManager.log('health after: ' +global.tiledMap[i][j].getInhabitant().healthpoint);
                        }
                    }
                }
            }
        } else {
            GameManager.log('health before: ' + action.target.getInhabitant().healthpoint[0]);
            action.sender.getInhabitant().useHealSkill(action.target.getInhabitant(), action.ability);
            healedAllies.push(action.target.getInhabitant());
            GameManager.log('health after: ' + action.target.getInhabitant().healthpoint[0]);
        }
        this.gameManager.unitManager.unitAttack(action.ability.name, action.sender, action.target, healedAllies);
    }

    makeDamage(action) {
        let woundedEnemies = [];
        let deadEnemies = [];
        GameManager.log(action.sender.getInhabitant().name + ' make damage');
        GameManager.log('this is damage skill: ' + action.ability.name);

        //AOE DAMAGE
        if(action.ability.typeOfArea === 'circle') {
            GameManager.log('THIS IS AOE DAMAGE');
            GameManager.log('target on ' + action.target.xpos + ' ' + action.target.ypos);
            for(let i = action.target.xpos-action.ability.area; i <= action.target.xpos + action.ability.area; i++) {
                for(let j = action.target.ypos-action.ability.area; j <= action.target.ypos + action.ability.area; j++) {
                    // GameManager.log("i: " + i + " j: " + j);
                    if(i >= 0 && j >= 0 && i < this.WIDTH && j < this.HEIGHT) {
                        if(global.tiledMap[i][j].isOccupied() && global.tiledMap[i][j].getInhabitant().deadMark === false) {
                            // GameManager.log(global.tiledMap[i][j].getInhabitant().name + " IS WOUNDED");
                            action.sender.getInhabitant().useDamageSkill(global.tiledMap[i][j].getInhabitant(), action.ability);
                            if (global.tiledMap[i][j].getInhabitant().isDead()) {
                                deadEnemies.push(global.tiledMap[i][j].getInhabitant());
                                global.tiledMap[i][j].getInhabitant().deadMark = true;
                            } else {
                                woundedEnemies.push(global.tiledMap[i][j].getInhabitant());
                            }
                        }
                    }

                }
            }

        } else {
            GameManager.log("health before: " + action.target.getInhabitant().healthpoint[0]);
            action.sender.getInhabitant().useDamageSkill(action.target.getInhabitant(), action.ability);
            GameManager.log('health after: ' + action.target.getInhabitant().healthpoint[0]);
            if(action.target.getInhabitant().isDead()) {
                deadEnemies.push(action.target.getInhabitant());
            } else {
                woundedEnemies.push(action.target.getInhabitant());
            }
        }

        if (deadEnemies.length > 0) {

            this.gameManager.unitManager.unitAttackAndKill(action.ability.name, action.sender, action.target, deadEnemies, woundedEnemies);
            for(let i = 0; i < deadEnemies.length; i++) {
                // GameManager.log(deadEnemies[i].name + ' IS DEAD! ', 'red');
                this.initiativeLine.RemoveUnit(deadEnemies[i]);
            }
        } else {
            // GameManager.log('SOMEONE GET WOUNDED: ', woundedEnemies);
            this.gameManager.unitManager.unitAttack(action.ability.name, action.sender, action.target, woundedEnemies);
        }
    }

    loseGame() {
        setTimeout(function() {
            this.stopGameLoop();
            document.getElementsByClassName('container')[0].setAttribute('class', 'blur container');
            document.getElementById('lose').removeAttribute('style');
            this.gameManager.stop();
        }.bind(this), 1500);
        //createoverlaylose
    }

    winGame() {
        setTimeout(function() {
            this.stopGameLoop();
            document.getElementsByClassName('container')[0].setAttribute('class', 'blur container');
            document.getElementById('win').removeAttribute('style');
            this.gameManager.stop();
        }.bind(this), 1500);
        //createoverlaywin
    }

    generatePlayers() {
        let newPlayers = [];
        let Roderick = new Unit();
        Roderick.makeWarrior('Roderick');
        let Gendalf = new Unit();
        Gendalf.makeMage('Gendalf');
        let Garreth = new Unit();
        Garreth.makeThief('Garreth');
        let Ethelstan = new Unit();
        Ethelstan.makePriest('Ethelstan');

        newPlayers.push(Roderick);
        newPlayers.push(Gendalf);
        newPlayers.push(Garreth);
        newPlayers.push(Ethelstan);

        return newPlayers;
    }

    generateEnemies() {
        let newEnemies = [];
        for (let i = 0; i < this.ENEMIESSIZE; i++) {
            // GameManager.log(i);
            let Skeleton = new Unit();
            let texture;
            if (i % 2 === 0) {
                texture = 'skeleton1';
            } else {
                texture = 'skeleton2';
            }
            Skeleton.makeSkeleton(texture);
            newEnemies.push(Skeleton);
        }
        return newEnemies;
    }

    setPlayersPositions(players) {
        for (let i = 0; i < this.PARTYSIZE; i++) {
            let randRow;
            let randCol;
            while (true) {
                randRow = Math.floor(Math.random() * this.HEIGHT);
                randCol = Math.floor(Math.random() * 3); //первые три столбца поля
                if (global.tiledMap[randCol][randRow].isWall === this.NOTWALL && !global.tiledMap[randCol][randRow].isOccupied()) {
                    break;
                }
            }
            players[i].xpos = randCol;
            players[i].ypos = randRow;
            global.tiledMap[randCol][randRow].occupy(players[i]);
        }
    }

    setEnemiesPositions(enemies) {
        for (let i = 0; i < this.ENEMIESSIZE; i++) {
            let randRow;
            let randCol;
            while (true) {
                randRow = Math.floor(Math.random() * this.HEIGHT);
                randCol = Math.floor(Math.random() * 3) + this.WIDTH - 3; //последние три столбца поля
                if (global.tiledMap[randCol][randRow].isWall === this.NOTWALL && !global.tiledMap[randCol][randRow].isOccupied()) {
                    break;
                }
            }
            enemies[i].xpos = randCol;
            enemies[i].ypos = randRow;
            global.tiledMap[randCol][randRow].occupy(enemies[i]);
        }
    }

    isPartyDead() {
        for (let i = 0; i < this.PARTYSIZE; i++) {
            if (!this.players[i].isDead()) {
                return false;
            }
        }
        return true;
    }

    isEnemiesDead() {
        for (let i = 0; i < this.ENEMIESSIZE; i++) {
            if (!this.enemies[i].isDead()) {
                return false;
            }
        }
        return true;

    }

    startGameLoop() {
        global.intervalId = this.intervalId = setInterval(() => this.gameLoop(), this.interval);
    }

    stopGameLoop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }

    skipAction() {
        this.timer = 60000000;
        this.beginTurn();
    }

    sendPossibleMoves() {
        let pathfinding = new Pathfinding(global.tiledMap[this.activeUnit.xpos][this.activeUnit.ypos], global.tiledMap);
        let allMoves = pathfinding.possibleMoves();
        let path = [];
        for(let key of allMoves.keys()){
            path.push(key);
        }
        path.shift();
        this.gameManager.unitManager.setCurrentSkill(0, path);
    }

    beginTurn() {
        this.activeUnit = this.initiativeLine.NextUnit();
        GameManager.log('This turn: ');
        GameManager.log(this.activeUnit.name + ' = now your move!');
        this.activeUnit.actionPoint = 2;
        this.gameManager.unitManager.activeUnit(this.activeUnit);
        this.sendPossibleMoves();
        //изменяем LowerBar
        //изменяем activeEntity
    }
}
