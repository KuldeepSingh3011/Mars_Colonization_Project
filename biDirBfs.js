async function bdbfs(state, diagonalMovement = false){
    var visited1 = new Array(state.rows);
    var visited2 = new Array(state.rows);
    var parent1 = new Array(state.rows);
    var parent2 = new Array(state.rows); 
    for(let i=0;i<state.rows;i++){
        visited1[i] = new Array(state.cols);
        visited2[i] = new Array(state.cols);
        parent1[i] = new Array(state.cols);
        parent2[i] = new Array(state.cols);
    }
    for(let i=0;i<state.rows;i++){
        for(let j=0;j<state.cols;j++){
            visited1[i][j] = 0;
            visited2[i][j] = 0;
            parent1[i][j] = [-1, -1];
            parent2[i][j] = [-1, -1];
        }
    } 
    var q1 = [];
    var q2 = [];
    q1.push([state.start.x, state.start.y]);
    q2.push([state.end.x, state.end.y]);
    visited1[state.start.y][state.start.x] = 1;
    visited2[state.end.y][state.end.x] = 1;
    let foundDest = false;
    while((q1.length)&&(q2.length)){
        await state.sleep(0)
        var [x1, y1] = q1.shift();
        var [x2, y2] = q2.shift(); 
        visited1[y1][x1] = 2;
        visited2[y2][x2] = 2;
        if(!(((x1 === state.start.x)&&(y1 === state.start.y))||((x1 === state.end.x)&&(y1 === state.end.y)))){
            state.context.fillStyle = "rgb(0,255,255)"; 
            state.fillRect(x1, y1);
        }
        if(!(((x2 === state.start.x)&&(y2 === state.start.y))||((x2 === state.end.x)&&(y2 === state.end.y)))){
            state.context.fillStyle = "rgb(0,255,255)"; 
            state.fillRect(x2, y2);
        }
        var neighbour1 = getNeighbours(state, [x1, y1], diagonalMovement);
        var neighbour2 = getNeighbours(state, [x2, y2], diagonalMovement);
        for(let i=0;i<neighbour1.length;i++){
            var [nx1, ny1] = neighbour1[i]; 
            if(state.matrix[ny1][nx1]===1){
                continue;
            }
            if(visited1[ny1][nx1] === 0){
                visited1[ny1][nx1] = 1;
                parent1[ny1][nx1] = [y1, x1];
                if(!((nx1 === state.end.x)&&(ny1 === state.end.y))){
                    state.context.fillStyle = "rgb(0,255,0,0.7)";  
                    state.fillRect(nx1, ny1);
                }
                q1.push([nx1, ny1]);
            }
        }
        for(let i=0;i<neighbour2.length;i++){
            var [nx2, ny2] = neighbour2[i]; 
            if(state.matrix[ny2][nx2]===1){
                continue;
            }
            if(visited2[ny2][nx2] === 0){
                visited2[ny2][nx2] = 1;
                parent2[ny2][nx2] = [y2, x2];
                if(!((nx2 === state.start.x)&&(ny2 === state.start.y))){
                    state.context.fillStyle = "rgb(0,255,0,0.7)";
                    state.fillRect(nx2, ny2);
                }
                q2.push([nx2, ny2]);
            }
        }
        var intersect = [-1,-1];
        for(let i=0;i<state.rows;i++){
            for(let j=0;j<state.cols;j++){
                if((visited1[i][j] === 2)&&(visited2[i][j] === 2)){
                    intersect[0] = i;
                    intersect[1] = j;
                    break;
                }
            }
            if(!((intersect[0] === -1)||(intersect[1] === -1))){
                foundDest = true;
                break;
            }
        } 
        if(!((intersect[0] === -1)||(intersect[1] === -1)))
        break;
    }
    if(foundDest){
        let flag = 0;
        var lis = [];
        getPathtb(state, intersect[1], intersect[0], parent1,lis,flag);
        flag = 1;
        getPathtb(state, intersect[1], intersect[0],parent2,lis,flag);
        var Distance = shortestPath(lis);
        return Distance;
    }
    else{
        return -1;
    }

    // HELPERS
    function getNeighbours(state, curNode, diagonalMovement){
        var neighbours = [];
        let dx = [1,0,-1,0];
        let dy = [0,-1,0,1];
        let dx1 = [1,1,0,-1,-1,-1,0,1];
        let dy1 = [0,-1,-1,-1,0,1,1,1];
        if(diagonalMovement){ 
            for(let i=0;i<8;i++){
                let neighborX = curNode[0] + dx1[i];
                let neighborY = curNode[1] + dy1[i];
                if((neighborX>=0)&&(neighborX<state.cols)&&(neighborY>=0)&&(neighborY<state.rows)){
                    neighbours.push([neighborX,neighborY]);
                }
            }
        }
        else{
            for(let i=0;i<4;i++){
                let neighborX = curNode[0] + dx[i];
                let neighborY = curNode[1] + dy[i];
                if((neighborX>=0)&&(neighborX<state.cols)&&(neighborY>=0)&&(neighborY<state.rows)){
                    neighbours.push([neighborX,neighborY]);
                }
            }
        }
        return neighbours;
    }

    function getPathtb(state, ex, ey,parent,lis,flag) {
        curr = [ey, ex];
        state.context.beginPath();
        state.moveTo(curr[1], curr[0]);
        if(flag === 0)
        lis.push(curr);
        while (!(curr[0] === -1 && curr[1] === -1)) {
            console.log(curr);
            curr = parent[curr[0]][curr[1]];
            if((curr[0]<0)||(curr[1]<0)){
                break;
            }
            state.lineTo(curr[1], curr[0]);
            if(flag === 0)
            lis.unshift(curr);
            else 
            lis.push(curr);
        }
        console.log(curr);
        state.context.strokeStyle="yellow";
        state.context.lineWidth = 3;
        state.context.stroke();
    }
    function shortestPath(lis){
        shortestDist = 0;
        //console.log(lis[0]);
        for(let i=1;i<lis.length;i++){
            //console.log(lis[i]);
            shortestDist+=1;
        }
        console.log(shortestDist);
        return shortestDist;
    }
}
