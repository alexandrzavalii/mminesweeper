import { Template } from 'meteor/templating';


import './main.html';
Template.gameBoard.onRendered(function helloOnCreated() {
  rows = 10;
  cols = 10;
  lost = false;
  clickedPlaces=[];
  placeToCheck = [[-1,-1],[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0]];
  Meteor.call('createGrid',rows, cols, function(error, result){
    Meteor.call('populateBombs', 'easy', function (error, result) {
        placeBombs = result;
    });
  });

});


Template.gameBoard.helpers({
  categories: function(){
      return ["easy", "medium", "hard"]
  }
});

Template.gameBoard.events({
  "change #category-select": function (event) {
      var category = $(event.currentTarget).val();
      Meteor.call('createGrid',rows, cols, function(error, result){
        Meteor.call('populateBombs', category, function (error, result) {
            placeBombs = result;
            for(var i = 0; i<placeBombs.length; i++){
                console.log(placeBombs[i]);
            }
        });
      });

  },
  'click td'(event){
if(lost) return ;

  //check if the place has been clicked already
  if(event.target.className.indexOf("hasBomb") > -1 || event.target.className.indexOf("noBomb") > -1){
    return;
  }
//clicked cell coordinates
       var x = event.target.cellIndex;
       var y = parseInt(event.target.className);
//check if the user clicked on a bomb
       for(var i = 0; i<placeBombs.length; i++){

         if(x == placeBombs[i][0] && y == placeBombs[i][1]){
             event.target.innerHTML = "X";
             event.target.className ="bomb"
             lost = true;
          }
       }
    if(!lost){
        clickNext(x,y);
        displayResult();
      }else{
        var r= $('<center><a href="">Refresh</a></center>');
        $("body").append(r);
         }

         function clickNext(x,y){
//count the number of bombs arround cell
           var bombsArround = 0;
            for(i in placeToCheck){
              for(var n = 0; n<placeBombs.length; n++){
                if(checkArround(n,x + placeToCheck[i][0],y+ placeToCheck[i][1])){
                  bombsArround++;
                }
              }
            }
//save to the array of clicked cells;
        clickedPlaces[(clickedPlaces.length)] =  [x,y,bombsArround];
//if no bombs are arround
        if(bombsArround == 0){
           for(var i in placeToCheck){
//check if we are not exceeding the size of the table
             if(x + placeToCheck[i][0] >= 0 &&
                x + placeToCheck[i][0] <= cols-1 &&
                y + placeToCheck[i][1] >= 0 &&
                y + placeToCheck[i][1] <= rows-1 ){

                  var x1 = x + placeToCheck[i][0];
                  var y1 = y + placeToCheck[i][1];
                    
                  var alreadyClicked = false;
                    for(n in clickedPlaces){
                      if(clickedPlaces[n][0] == x1 && clickedPlaces[n][1] == y1){
                         alreadyClicked = true;
                      }
                    }
                    if (!alreadyClicked){
                      clickNext(x1, y1);
                    }
                }
           }
        }
      }
   function checkArround(i,x,y){
     if(placeBombs[i][0] == x && placeBombs[i][1] == y){
        return true;
     }else{
       return false;
     }
   }

   function displayResult(){
     console.log("number of clicked places",clickedPlaces.length);
     for(var i=0; i<clickedPlaces.length; i++){
       if(clickedPlaces[i][2] > 0){
         $('table.grid tr:eq(' + clickedPlaces[i][1] + ') td:eq(' + clickedPlaces[i][0] + ')').addClass( "hasBomb" ).text(clickedPlaces[i][2]);
       }else{
        $('table.grid tr:eq(' + clickedPlaces[i][1] + ') td:eq(' + clickedPlaces[i][0] + ')').addClass( "noBomb" );
       }
     }
   }
  }
});
