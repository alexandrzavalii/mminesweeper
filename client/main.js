import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import './main.html';

Template.gameBoard.onRendered(function OnCreated() {
  rows = 10;
  cols = 10;
  lost = false;
  clickedPlaces=[];
  placeToCheck = [[-1,-1],[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0]];
  createGrid(rows,cols);
  placeBombs=populateBombs('easy');
  console.log(placeBombs.length);

});

Template.gameBoard.helpers({
  categories: function(){
      return ["easy", "medium", "hard"]
  }
});

Template.gameBoard.events({
  "change #category-select": function (event) {
      var category = $(event.currentTarget).val();
      lost = false;
      clickedPlaces=[];
      createGrid(rows,cols);
      placeBombs=populateBombs(category);
      console.log(placeBombs.length);
  },
  "click .refresh": function(){
    lost = false;
    clickedPlaces=[];
    createGrid(rows,cols);
    placeBombs=populateBombs('easy');
  },
  'click td'(event){
  if(lost) return;

  //check if the place has been clicked already
  if(event.target.className.indexOf("hasBomb") > -1 || event.target.className.indexOf("noBomb") > -1){
    return;
  }
//clicked cell coordinates
       var x = event.target.cellIndex;
       var y = parseInt(event.target.className);

//check if the user clicked on a bomb
      lost = checkClick(x,y);


    if(!lost){
        clickedPlacesThisTurn=[];
        clickedPlacesThisTurn=clickNext(x,y);
        displayResult(clickedPlacesThisTurn);
      }else{
        gameover();
         }
  }
});
