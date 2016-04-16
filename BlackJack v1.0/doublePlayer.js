
var Player={
	createNew: function () {
		var player={};
		player.cards=['noCard', 'noCard'];
		player.value=[0,0];
		player.result="PLAYING";
		player.bet=10;
		player.betLeft=90;
		//reset player's bets
		player.reset=function(){			
			player.bet=10;
			player.betLeft -= 10;
		}
		//distribute one card
		player.distributeCard=function(i) {   //i-th card to player
			if(remainCards.length==0){
				window.alert('No cards left! Click DEAL!');
			}
			cardNumber=Math.floor(Math.random()*remainCards.length);
			player.cards[i]=remainCards[cardNumber];
			player.value[i]=getValue(player.cards[i]);
			remainCards.splice(cardNumber, 1);
		};
		//show all cards of player
		player.showCards=function(pokerElements) {
			for (var i = 0; i < player.cards.length; i++) {
				var imagePath="pokers/images/"+player.cards[i]+".jpg";
				if (i>pokerElements.children.length-1) {
					var newPoker=document.createElement('img');
					newPoker.alt="card"+ (i+1).toString();
					pokerElements.appendChild(newPoker);
				}
				pokerElements.children[i].src=imagePath;
			}
		}
		//get total value of all cards
		player.totalValue=function () {
			var total=0;			
			for (var i = 0; i < player.value.length; i++) {
				total +=player.value[i];
			}
			/*if total value is larger than 21, 
			search for A-card and change it's value to 1*/
			if (total>21) {
				for (var i = 0; i < player.value.length; i++) {
					if(player.value[i]==11){
						player.value[i]=1;
						total=total-10;
						break;
					}
				}
			}		
			return total;
		}
		//if player has black-jack(an A-card and a 10-card)
		player.hasBlackJack=function () {
			if (player.value.length==2) {
				if (player.totalValue()==21) {
					if (player.value[0]==11 || player.value[1]==11) {
						return true;
					}
				}
			}
			return false;
		}

		return player;
	}
}

var player1=Player.createNew();
var player2=Player.createNew();

var cardsAll=['heartA', 'heart2','heart3','heart4','heart5','heart6','heart7','heart8','heart9','heart10','heartJ','heartQ','heartK',
'spadeA','spade2','spade3','spade4','spade5','spade6','spade7','spade8','spade9','spade10','spadeJ','spadeQ','spadeK',
'clubA', 'club2','club3','club4','club5','club6','club7','club8','club9','club10','clubJ','clubQ','clubK',
'diamondA', 'diamond2','diamond3','diamond4','diamond5','diamond6','diamond7','diamond8','diamond9','diamond10','diamondJ','diamondQ','diamondK']

var remainCards=[];
for (var i = 0; i < cardsAll.length; i++) {
		remainCards[i]=cardsAll[i];
	}


var pokerElements1=document.getElementById('poker1');
var pokerElements2=document.getElementById('poker2');
var hitButtons=document.getElementsByClassName('hit');
var standButtons=document.getElementsByClassName('stand');
var raiseButtons=document.getElementsByClassName('raise_btn');
var betElements=document.getElementsByClassName('bet');
var betLeftElements=document.getElementsByClassName('bet_left');

for (var i = 0; i < raiseButtons.length; i++) {
	raiseButtons[i].disabled=true;
	hitButtons[i].disabled=true;
	standButtons[i].disabled=true;
}

//get value of card
function getValue(card) {	
	if (card.match('A')){return 11;}	//A-card's value is 11 as defualt
	if (card.match('2')) {return 2;}
	if (card.match('3')) {return 3;}
	if (card.match('4')) {return 4;}
	if (card.match('5')) {return 5;}
	if (card.match('6')) {return 6;}
	if (card.match('7')) {return 7;}
	if (card.match('8')) {return 8;}
	if (card.match('9')) {return 9;}
	//if (card.match('10')) {return 10;}
	if (card.match(/[JQK10]/)) {return 10;}	
}

//remove extra cards so each player has 2 cards
function removeExtraCards(pokerElements) {		
	while(pokerElements.children.length>2){	
		pokerElements.removeChild(pokerElements.children[2]);		
	}
}

//show result when game over
function showResult() {
	document.getElementById('result1').innerHTML=player1.result;	
	document.getElementById('result2').innerHTML=player2.result;
	document.getElementById('result1').style.color='#8B0000';
	document.getElementById('result2').style.color='#8B0000';
	document.getElementById('value1').children[0].innerHTML=player1.totalValue();
	document.getElementById('value2').children[0].innerHTML=player2.totalValue();
	
	betElements[0].children[0].innerHTML=player1.bet;
	betLeftElements[0].children[0].innerHTML=player1.betLeft;
	betElements[1].children[0].innerHTML=player2.bet;
	betLeftElements[1].children[0].innerHTML=player2.betLeft;
	

	for (var i = 0; i < 2; i++) {
		hitButtons[i].disabled=true;
		standButtons[i].disabled=true;
		raiseButtons[i].disabled=true;
	}
}

//click on DEAL button
function deal() {
	for (var i = 0; i < cardsAll.length; i++) {
		remainCards[i]=cardsAll[i];
	}
	//reset players bets
	if (player1.bet==0) {
		player1.reset();
		player2.reset();
	}	
	betElements[0].children[0].innerHTML=player1.bet;
	betLeftElements[0].children[0].innerHTML=player1.betLeft;
	betElements[1].children[0].innerHTML=player2.bet;
	betLeftElements[1].children[0].innerHTML=player2.betLeft;

	//reset buttons	
	for (var i = 0; i < 2; i++) {
		raiseButtons[i].disabled=false;
		hitButtons[i].disabled=false;
		standButtons[i].disabled=false;
	}
	
	//reset results
	player1.result="PLAYING";
	player2.result="PLAYING";
	document.getElementById('result1').innerHTML=player1.result;
	document.getElementById('result2').innerHTML=player2.result;
	document.getElementById('result1').style.color= 'black';
	document.getElementById('result2').style.color= 'black';

	//if player has more than 2 cards, delete extra cards 	
	if (pokerElements1.children.length>2) {
		removeExtraCards(pokerElements1);
		player1.cards.splice(2);
		player1.value.splice(2);
		
	}
	
	if (pokerElements2.children.length>2) {
		removeExtraCards(pokerElements2);
		player2.cards.splice(2);
		player2.value.splice(2);
		
	}
	
	//distribute 2 cards for each player at beginning
	for (var i = 0; i < 2; i++) {
		player1.distributeCard(i);
		player2.distributeCard(i);	
	}	

	player1.showCards(pokerElements1);
	player2.showCards(pokerElements2);

	//show total value
	document.getElementById('value1').children[0].innerHTML=player1.totalValue();
	document.getElementById('value2').children[0].innerHTML=player2.totalValue();
}

//click on RAISE button
function raise(player) {
	switch(player){
		case 'player1':
			if (player1.betLeft) {
				player1.bet+=10;
				player1.betLeft-=10;
				betElements[0].children[0].innerHTML=player1.bet;
				betLeftElements[0].children[0].innerHTML=player1.betLeft;
			}else{  //raise to max, return to initial
				player1.betLeft=player1.bet-10;
				player1.bet=10;
				betElements[0].children[0].innerHTML=player1.bet;
				betLeftElements[0].children[0].innerHTML=player1.betLeft;
			}
			break;
		case 'player2':
			if (player2.betLeft) {
				player2.bet+=10;
				player2.betLeft-=10;
				betElements[1].children[0].innerHTML=player2.bet;
				betLeftElements[1].children[0].innerHTML=player2.betLeft;
			}else{  //raise to max, return to initial
				player2.betLeft=player2.bet-10;
				player2.bet=10;
				betElements[1].children[0].innerHTML=player2.bet;
				betLeftElements[1].children[0].innerHTML=player2.betLeft;
			}
			break;
		default:
			window.alert("Wrong raise!");
	}
}

//compare two player's total value
function compareHit(player1, player2) {
	if (player1.totalValue()>21) {
		player1.result="Lose!";
		player2.result="WIN!"
		player2.betLeft=player2.betLeft + player2.bet + player1.bet;
		player1.bet=0;
		player2.bet=0;
	}else if (player2.totalValue()>21) {
		player1.result="WIN!";
		player2.result="Lose!";
		player1.betLeft=player1.betLeft + player1.bet +player2.bet;
		player1.bet=0;
		player2.bet=0;
	}
}

//click on HIT button
function hit(player) {
	
	if(remainCards.length==52){     //if game has not started
		window.alert("Click DEAL!");
	}else{
		switch(player){
			case 'player1':
				if (pokerElements1.children.length>pokerElements2.children.length) {
					if (hitButtons[1].disabled==false) {
						window.alert("Player2's turn!");
						break;
					}										
				}
				if (raiseButtons[0].disabled==false) {
					raiseButtons[0].disabled=true;
				}				
				player1.distributeCard(player1.cards.length);
				player1.showCards(pokerElements1);
				document.getElementById('value1').children[0].innerHTML=player1.totalValue();				
				break;
			case 'player2':
				if (pokerElements1.children.length==2 && hitButtons[0].disabled==false) {
					window.alert("Start from Player1!");
					break;
				}
				if (pokerElements2.children.length>=pokerElements1.children.length) {
					if (hitButtons[0].disabled==false) {
						window.alert("Player1's turn!");
						break;
					}						
				}
				if (raiseButtons[1].disabled==false) {
					raiseButtons[1].disabled=true;
				}
				player2.distributeCard(player2.cards.length);
				player2.showCards(pokerElements2);
				document.getElementById('value2').children[0].innerHTML=player2.totalValue();				
				break;
			default:
				window.alert('Wrong!');
		}
		compareHit(player1, player2);
		//if game over
		if (player1.result!="PLAYING") {
			showResult();
			if(player1.betLeft==0){
				var startAgain=window.confirm('Player1 ran out of money! Play again?');
				if(startAgain){
					player1.bet=10;
					player1.betLeft=90;
					player2.bet=10;
					player2.betLeft=90;
					deal();
				}else{
					document.getElementById('deal').disabled=true;
				}
			}else if (player2.betLeft==0) {
				var startAgain=window.confirm('Player2 ran out of money! Play again?');
				if(startAgain){
					player1.bet=10;
					player1.betLeft=90;
					player2.bet=10;
					player2.betLeft=90;
					deal();
				}else{
					document.getElementById('deal').disabled=true;
				}
			}
		}
	}	
}

function compareStand(player1, player2) {
	if (player1.totalValue()==player2.totalValue()) {        // two player's value equals
		if (player1.hasBlackJack() && (!player2.hasBlackJack())) {
			player1.result="WIN!";
			player2.result="Lose!";
			player1.betLeft=player1.betLeft + player1.bet +player2.bet;			
			player1.bet=0;
			player2.bet=0;
		}else if ((!player1.hasBlackJack()) && player2.hasBlackJack()) {
			player1.result="Lose!";
			player2.result="WIN!";
			player2.betLeft=player2.betLeft + player2.bet + player1.bet;
			player1.bet=0;
			player2.bet=0;
		}else{
			player1.result="DRAW!";
			player2.result="DRAW!";
			player1.betLeft+=player1.bet;			
			player2.betLeft+=player2.bet;
			player1.bet=0;
			player2.bet=0;
		}
	}else{
		if (player1.totalValue()>player2.totalValue()) {
			player1.result="WIN!";
			player2.result="Lose!";
			player1.betLeft=player1.betLeft + player1.bet +player2.bet;
			player1.bet=0;
			player2.bet=0;
		}else{
			player1.result="Lose!";
			player2.result="WIN!";
			player2.betLeft=player2.betLeft + player2.bet + player1.bet;
			player1.bet=0;
			player2.bet=0;
		}
	}
}


function stand(player) {
	
	if(remainCards.length==52){     //if game has not started
		window.alert("Click DEAL!");
	}else{
		switch(player){
			case 'player1':
				if (hitButtons[1].disabled==false) {
					if (pokerElements1.children.length>pokerElements2.children.length) {
						window.alert("Player2's turn!");
						break;
					}else{
						if (raiseButtons[0].disabled==false) {
							raiseButtons[0].disabled=true;
						}	
					}
				}else{
					if (raiseButtons[0].disabled==false) {
						raiseButtons[0].disabled=true;
					}	
					compareStand(player1, player2);
				}
				
				document.getElementById('hit1').disabled=true;				
				document.getElementById('stand1').disabled=true;
				break;
			case 'player2':
				if (pokerElements1.children.length==2 && hitButtons[0].disabled==false) {
					window.alert("Start from Player1!");
					break;
				}
				if (hitButtons[0].disabled==false) {
					if (pokerElements2.children.length>=pokerElements1.children.length) {
						window.alert("Player1's turn!");
						break;
					}else{
						if (raiseButtons[1].disabled==false) {
							raiseButtons[1].disabled=true;
						}	
					}
				}else{
					if (raiseButtons[1].disabled==false) {
						raiseButtons[1].disabled=true;
					}	
					compareStand(player1, player2);
				}
				
				document.getElementById('hit2').disabled=true;				
				document.getElementById('stand2').disabled=true;				
				break;
			default:
				window.alert('Wrong!');
		}
		
		//if game over
		if (player1.result!="PLAYING") {
			showResult();
			if(player1.betLeft==0){
				var startAgain=window.confirm('Player1 ran out of money!Start again?');
				if(startAgain){
					player1.bet=10;
					player1.betLeft=90;
					player2.bet=10;
					player2.betLeft=90;
					deal();
				}else{
					document.getElementById('deal').disabled=true;
				}
			}else if (player2.betLeft==0) {
				var startAgain=window.confirm('Player2 ran out of money!Start again?');
				if(startAgain){
					player1.bet=10;
					player1.betLeft=90;
					player2.bet=10;
					player2.betLeft=90;
					deal();
				}else{
					document.getElementById('deal').disabled=true;
				}
			}
		}
	}
}