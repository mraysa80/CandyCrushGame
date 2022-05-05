document.addEventListener('DOMContentLoaded', () =>  {
    const grid = document.querySelector('.grid')
    const scoreDisplay = document.getElementById('score')
    const width = 8
    const squares = []
    let score = 0
// creating a color pallete
const candyColors = [
    'url(images/red-candy.png)',
    'url(images/blue-candy.png)',
    'url(images/green-candy.png)',
    'url(images/orange-candy.png)',
    'url(images/purple-candy.png)',
    'url(images/yellow-candy.png)'
]
//create the board
function createBoard() {
    for (let i = 0; i <width*width; i++) {
        const square = document.createElement('div')
        // make the candy items draggable so the candy can go to different locations on the grid
        square.setAttribute('draggable', true)
        // give every square an id so we know which square we are moving
        // everytime we loop over this attribute it'll give a # 0-63
        square.setAttribute('id', i)
        let randomColor = Math.floor(Math.random() * candyColors.length) //using the math.random library to pick a random set of colors from the arrary above
        square.style.backgroundImage = candyColors[randomColor]
        grid.appendChild(square)
        squares.push(square)
    } 
}
createBoard()

// Drag the candy 
let colorBeingDragged
let colorBeingReplaced
let squareIdBeingDragged
let squareIdBeingReplaced

    squares.forEach(square => square.addEventListener('dragstart', dragStart))
    squares.forEach(square => square.addEventListener('dragend', dragEnd))
    squares.forEach(square => square.addEventListener('dragover', dragOver))
    squares.forEach(square => square.addEventListener('dragenter', dragEnter))
    squares.forEach(square => square.addEventListener('dragleave', dragLeave))
    squares.forEach(square => square.addEventListener('drop', dragDrop))


    function dragStart() {
        colorBeingDragged = this.style.backgroundImage
        squareIdBeingDragged = parseInt(this.id)
        console.log(colorBeingDragged)
        console.log(this.id, 'dragstart')
    }

    function dragOver(e) {
        e.preventDefault()
        console.log(this.id,'dragover')
    }

    function dragEnter(e) {
        e.preventDefault()
        console.log(this.id,'dragenter')
    }

    function dragLeave() {
        console.log(this.id,'dragleave') 
    }

    function dragDrop() {
        console.log(this.id,'dragdrop')
        colorBeingReplaced = this.style.backgroundImage
        squareIdBeingReplaced = parseInt(this.id)
        // makes the color of the square change into the color being dragged
        this.style.backgroundImage = colorBeingDragged
        // will give the orginal square being dragged this color after a new color was dropped in that square
        squares[squareIdBeingDragged].style.backgroundImage = colorBeingReplaced
    }

    function dragEnd() {
        console.log(this.id,'dragend')
        // what is a valid move?
        let validMoves = [
            squareIdBeingDragged -1, 
            squareIdBeingDragged -width,
            squareIdBeingDragged +1,
            squareIdBeingDragged +width
        ]
        let validMove = validMoves.includes(squareIdBeingReplaced)

        // if the id of the square exists and not off the grid and its also valid then we execute and clear the value for a fresh start or new move
        if (squareIdBeingReplaced && validMove) {
            squareIdBeingReplaced = null
            // if the square can be dropped but not a valid move (too far from the orginal square)
        } else if (squareIdBeingReplaced && !validMove) {
            // return the square being replaced to its orignal place by giving its its orignal color
            squares[squareIdBeingReplaced].style.backgroundImage = colorBeingReplaced
            squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged

            // if none of the statments are true and our square has no where to go and outside the grid 
            // we put it back to its orginal place.
        } else squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged
    }


    // drop candies once some have been cleared 
    function moveDown() {
        for (i = 0; i< 55; i++) {
            if (squares[i + width].style.backgroundImage == '') {
                squares[i + width].style.backgroundImage = squares[i].style.backgroundImage
                squares[i].style.backgroundImage = ''
                const firstRow = [0, 1, 2 ,3, 4, 5, 6, 7]
                const isFirstRow = firstRow.includes(i)
                if (isFirstRow && squares[i].style.backgroundImage == '') {
                    let randomColor = Math.floor(Math.random() * candyColors.length)
                    squares[i].style.backgroundImage = candyColors[randomColor]
                }
            }
        }
    }



    //checking for matching colums and rows

        // 1. check for row of four

        function checkRowForFour() {
            for (i = 0; i < 60; i++) {
                let rowOfFour = [i, i+1, i+2, i+3]
                let decidedColor = squares[i].style.backgroundImage
                const isBlank = squares[i].style.backgroundImage == ''
    
                const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55]
                if (notValid.includes(i)) continue
    
                if (rowOfFour.every(index => squares[index].style.backgroundImage == decidedColor && !isBlank)) {
                    score += 4
                    scoreDisplay.innerHTML = score
                    rowOfFour.forEach(index => {
                        squares[index].style.backgroundImage = ''
                    })
                }
                    
            }
        }
        checkRowForFour()
    
    
         
        // 2. check for columns of four
    
        function checkColumnForFour() {
            for (i = 0; i < 47; i++) {
                let columnOfFour = [i, i+width, i+width*2, i+width*3]
                let decidedColor = squares[i].style.backgroundImage
                const isBlank = squares[i].style.backgroundImage == ''
    
                if (columnOfFour.every(index => squares[index].style.backgroundImage== decidedColor && !isBlank)) {
                    score += 4
                    scoreDisplay.innerHTML = score
                    columnOfFour.forEach(index => {
                        squares[index].style.backgroundImage = ''
                    })
                }
                    
            }
        }
        checkColumnForFour()
     
    // 3. check for row of three

    function checkRowForThree() {
        for (i = 0; i < 61; i++) {
            let rowOfThree = [i, i+1, i+2]
            let decidedColor = squares[i].style.backgroundImage
            const isBlank = squares[i].style.backgroundImage == ''

            const notValid = [6, 7, 14, 15, 22, 23, 30, 21, 38, 39, 46, 47, 54, 55]
            if (notValid.includes(i)) continue

            if (rowOfThree.every(index => squares[index].style.backgroundImage == decidedColor && !isBlank)) {
                score += 3
                scoreDisplay.innerHTML = score
                rowOfThree.forEach(index => {
                    squares[index].style.backgroundImage = ''
                })
            }
                
        }
    }
    checkRowForThree()


     
    // 4. check for columns of three

    function checkColumnForThree() {
        for (i = 0; i < 47; i++) {
            let columnOfThree = [i, i+width, i+width*2]
            let decidedColor = squares[i].style.backgroundImage
            const isBlank = squares[i].style.backgroundImage == ''

            if (columnOfThree.every(index => squares[index].style.backgroundImage == decidedColor && !isBlank)) {
                score += 3
                scoreDisplay.innerHTML = score
                columnOfThree.forEach(index => {
                    squares[index].style.backgroundImage = ''
                })
            }
                
        }
    }
    checkColumnForThree()



window.setInterval(function() {
    moveDown()
    checkRowForFour()
    checkColumnForFour()
    checkRowForThree()
    checkColumnForThree()
}, 100)


















    })
    