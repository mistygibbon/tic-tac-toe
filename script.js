const gameBoard = (()=>{
    let data = [["","",""],["","",""],["","",""]]
    const resetData = function(){
        gameBoard.data = [["","",""],["","",""],["","",""]]
    }
    const writeData = function(id, marker){
        row = Math.floor((id-1)/3)
        column = (id-1) % 3
        gameBoard.data[row][column] = marker
    }
    return {data, writeData, resetData}
})();

const displayController = (()=>{
    let cells = document.querySelectorAll(".board div")

    const updateDisplay = function(){
        let cellIndex = 0
        gameBoard.data.forEach(function(row, rowIndex){
            row.forEach((data, columnIndex)=>{
                cells[cellIndex].innerHTML = `<h1>${data}</h1>`
                cellIndex++
            })
        })
    }

    const updateBorder = function(color){
        document.querySelector(".board").style.borderColor = color
    }
    return {updateDisplay, updateBorder}
})();

const Player = (name, marker) => {
    const getMarker = () => marker
    return {name, marker, getMarker}
}

const gameFlow = (()=>{

    let turnCounter
    let player1
    let player2

    messageContainer = document.querySelector(".message")
    cells = document.querySelectorAll(".board div")

    function clicker(e){
        console.log(e.target.innerText)
        if (e.target.innerText == ""){
            gameFlow.recordMove(e.target.className)
        }        
    }

    function shadeCSS(e){
        e.target.style.backgroundColor = "#bfbfbf"
        console.log(e.target)
    }

    function unshadeCSS(e){
        e.target.style.backgroundColor = "gainsboro"
        console.log(e.target)
    }

    function startClick(){
        cells.forEach((cell) => {
            cell.addEventListener("click",clicker)
            cell.addEventListener("pointerenter", shadeCSS)
            cell.addEventListener("pointerleave", unshadeCSS)
        })
    }

    function endClick(){
        cells.forEach((cell) => {
            cell.removeEventListener("click", clicker)
            cell.removeEventListener("pointerenter", shadeCSS)
            // cell.removeEventListener("pointerleave", unshadeCSS)
        })
    }

    const playerTurn = function(){
        if (turnCounter){
            return player1
        }else{
            return player2
        }
    }

    function arrayCompare(array){
        return array.some(function(row){
           result = row.every((item)=> item == player1.marker) || row.every((item)=> item == player2.marker)
           console.log(result)
           return result
        })
    }

    const winCheck = function(){
        let data = gameBoard.data
        function getCol(col){
            return data.map(row => row[col])
        }
        cols = [getCol(0), getCol(1), getCol(2)]
        diag = [[data[0][0], data[1][1], data[2][2]],[data[0][2], data[1][1], data[2][0]]]
        console.log(arrayCompare(gameBoard.data))
        return arrayCompare(gameBoard.data) || arrayCompare(cols) || arrayCompare(diag)
    }

    function tieCheck(){
        let data = gameBoard.data
        return data.every(function(row){
            return row.every((item)=> item != "")})
    }

    function endGame(){
        endClick()
        controls = document.querySelector("div.controls")
        replayButton = document.createElement("button")
        replayButton.innerText = "Restart"
        replayButton.addEventListener("click", replay)
        controls.appendChild(replayButton)
    }

    const recordMove = function(cellID){
        gameBoard.writeData(cellID, playerTurn().marker)
        displayController.updateDisplay()
        if (winCheck()){
            console.log(`${playerTurn().name} wins`)
            messageContainer.innerText = `${playerTurn().name} wins`
            endGame();
        }else if (tieCheck()){
            messageContainer.innerText = `It's a tie`
            endGame();
        }
        turnCounter = !turnCounter
    }

    const initializeGame = function(){
        
        startButton = document.querySelector("button.start")
        startButton.addEventListener("click", (e)=>{
            inputs = document.querySelectorAll("input")
            console.log(inputs)
            player1Name = inputs[0].value
            player2Name = inputs[1].value
            player1 = Player("Player 1", "X")
            player2 = Player("Player 2", "O")
            if (player1Name!=""){player1.name = player1Name}
            if (player2Name!=""){player2.name = player2Name}
            inputs.forEach((element)=>element.remove())
            startButton.remove()
            turnCounter = 1
            startClick();
        })
    }

    const replay = function(){
        gameBoard.resetData()
        displayController.updateDisplay()
        controls = document.querySelector("div.controls")
        controls.innerHTML = `<input type="text" placeholder="Player 1 name (X)" name="name" id="player1Name">
        <input type="text" placeholder="Player 2 name (O) " name="name" id="player2Name">
        <button type="button" class="start">Start</button>`
        messageContainer.innerHTML = ""
        initializeGame()
    }

    return{recordMove, playerTurn, turnCounter, arrayCompare, initializeGame, tieCheck}
})();

gameFlow.initializeGame()
