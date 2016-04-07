Meteor.methods({
    createGrid: function(rows, cols){
//remove previous board
      $('table.grid').remove();
      grid = simpleGrid(rows,cols);
      document.getElementById("board").appendChild(grid);

      function simpleGrid ( rows, cols ){
        var grid = document.createElement('table');
        grid.className = 'grid';
        for (var r=0;r<rows;++r){
            var tr = grid.appendChild(document.createElement('tr'));
            for (var c=0;c<cols;++c){
                var cell = tr.appendChild(document.createElement('td'));
                  cell.className= r; //row number
            }
        }
        return grid;
      }
    },
    populateBombs:function(category) {
      var bombs;
      var placeBombs = [];

        if(category ==='medium'){
          bombs = 20;
        }else if(category==='hard'){
          bombs = 30;
        }else{
          bombs = 10;
        }

        randomPosition(bombs);
        function randomPosition(bombs) {
                var xposition = [];
                var yposition = [];
                for (var i=0; i<bombs; i++) {
                    var x = Math.floor(Math.random() * 10); //generate new x point
                    var y = Math.floor(Math.random() * 10); //generate new x point

                    var location = xposition.indexOf(x);
                    if (location > -1) { //if newly generated x point is already in the xposition array (if it was    already previously generated
                        if (y == yposition[location]) { //if the newly generated y points equals the same y point in  the same location as x, except in the yposition array
                            while ( y == yposition[location]) {
                                y = Math.floor(Math.random() * 10);
                            }
                        }
                    }
                    xposition.push(x);
                    yposition.push(y);

                    placeBombs[(placeBombs.length)] = [x,y];

                }
            }


            return placeBombs;
    }
});
