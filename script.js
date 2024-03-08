let level = 1;

const levelsInfo = {
    "1": {
        "spheres": 5,
        "shining": 2,
        "timer": 3
    },
    "2": {
        "spheres": 6,
        "shining": 3,
        "timer": 3
    },  
    "3": {
        "spheres": 8,
        "shining": 5,
        "timer": 3
    },
    "4": {
        "spheres": 10,
        "shining": Math.random() > 0.5 ? 5 : 6,
        "timer": 4
    },
    "5": {
        "spheres": 12,
        "shining": Math.random() > 0.5 ? 5 : 6,
        "timer": 4
    },
    "6": {
        "spheres": 12,
        "shining": Math.random() > 0.5 ? 6 : 7,
        "timer": 4
    },
    "7": {
        "spheres": 14,
        "shining": Math.random() > 0.5 ? 7 : 9,
        "timer": 5
    },
    "8": {
        "spheres": 15,
        "shining": Math.random() > 0.5 ? 6 : 8,
        "timer": 5
    },
    "9": {
        "spheres": 15,
        "shining": Math.random() > 0.5 ? 9 : 11,
        "timer": 6
    },
    "10": {
        "spheres": 16,
        "shining": Math.random() > 0.5 ? 9 : 11,
        "timer": 6
    },
    "11": {
        "spheres": 16,
        "shining": Math.random() > 0.5 ? 10 : 11,
        "timer": 5
    },
    "12": {
        "spheres": 16,
        "shining": Math.random() > 0.5 ? 11 : 13,
        "timer": 5
    },
    "13": {
        "spheres": 18,
        "shining": Math.random() > 0.5 ? 12 : 15,
        "timer": 5
    },
    "14": {
        "spheres": 18,
        "shining": Math.random() > 0.5 ? 11 : 13,
        "timer": 5
    },
    "15": {
        "spheres": 18,
        "shining": Math.random() > 0.5 ? 11 : 13,
        "timer": 5
    },
    "16": {
        "spheres": 18,
        "shining": Math.random() > 0.5 ? 15 : 18,
        "timer": 5
    },
    "17": {
        "spheres": 18,
        "shining": Math.random() > 0.5 ? 16 : 19,
        "timer": 5
    },
    "18": {
        "spheres": 18,
        "shining": Math.random() > 0.5 ? 12 : 14,
        "timer": 4
    },
    "19": {
        "spheres": 18,
        "shining": Math.random() > 0.5 ? 13 : 15,
        "timer": 4
    },
    "20": {
        "spheres": 18,
        "shining": Math.random() > 0.5 ? 14 : 16,
        "timer": 3
    }
}

function fillSlider(seconds) {
    const fill = document.getElementById('fill');
    const slider = document.getElementById('time-slider');

    // Display the slider
    slider.style.display = 'block';

    // Reset the fill width immediately without transition
    fill.style.transition = 'none';
    fill.style.width = '0';

    // Force a reflow to make sure the above changes are applied before adding the transition
    void fill.offsetWidth;

    // Add the transition and start filling
    fill.style.transition = `width ${seconds}s linear`;
    fill.style.width = '100%';

    // Create the event listener function
    const onTransitionEnd = () => {
        // Once the transition ends, reset the fill width and hide the slider
        fill.style.width = '0';
        slider.style.display = 'none';

        // Remove the event listener
        fill.removeEventListener('transitionend', onTransitionEnd);
    };

    // Add the event listener for the transitionend event
    fill.addEventListener('transitionend', onTransitionEnd);
}

function showInstructions1(time){
    document.getElementById("instructions").style.display = "block";
    document.getElementById("instructions").innerText = `You have ${time} seconds to memorize the shining spheres`;
    setTimeout(() => {
        document.getElementById("instructions").style.display = "none";
    }, 2000);
}

function showInstructions2(time){
    document.getElementById("instructions").style.display = "block";
    document.getElementById("instructions").innerText = `Click on the spheres that were shining`;
    setTimeout(() => {
        document.getElementById("instructions").style.display = "none";
    }, 2000);
}


function startGame(){

    // hide the #contentarea 
    document.getElementById("contentarea").style.display = "none";

    // check if the user has played before and if so, load the previous level
    if(localStorage.getItem("level") !== null){
        level = localStorage.getItem("level");
    }else{
        localStorage.setItem("level", level);
    }

    const levelInfo = levelsInfo[level];

    setupLevel(levelInfo);


}

function setupLevel(levelInfo){

    document.getElementById("leaderboard").style.display = "none";
    document.getElementById("scorearea").innerText = "Level: " + level;
    window.setupScene(levelInfo.spheres);
    let instructions = document.getElementById("instructions");
    instructions.style.display = "block";
    instructions.style.top = "40vh";
    instructions.innerText = `You have ${levelInfo.timer} seconds to memorize all the shining spheres`;
    setTimeout(() => {
        
        document.getElementById("instructions").style.display = "none";

        // display the level
        window.toggleShine(levelInfo.shining, true)
        fillSlider(levelInfo.timer);
        document.getElementById("scorearea").style.display = "block";

        setTimeout(() => {
    
            document.getElementById("instructions").style.display = "block";
            document.getElementById("instructions").innerText = `Choose all the spheres that were shining`;
            window.toggleShine(levelInfo.shining, false);
            
            setTimeout(() => {

                document.getElementById("instructions").style.display = "none";
                fillSlider(levelInfo.shining < 6 ? 4 : 8);
                document.addEventListener('pointerdown', window.togglePointerDown);
                
                setTimeout(() => {
                    let result = window.checkLevel();

                    if(result){
                        
                        level++;
                        document.getElementById("confetti").style.display = "block";
                        setTimeout(() => {
                            document.getElementById("confetti").style.display = "none";
                        }, 1300);
                        setupLevel(levelsInfo[level]);

                    } else {

                        document.removeEventListener('pointerdown', window.togglePointerDown);

                        window.toggleShine(levelInfo.shining, true);

                        let instructions = document.getElementById("instructions");

                        instructions.style.display = "flex";
                        instructions.innerHTML = `<p>Nice try! You messed up on level ${level}!</>`;
              
                        if(localStorage.getItem('username') === null){

                            instructions.style.top = "25vh";
                            instructions.innerHTML += `<p>Submit your score on the <a href="/tradeoff">leaderboard</a>.</P>`;
                            // add a input field for user to enter their name
                            instructions.innerHTML += `<input type="text" id="name" placeholder="username">`;
                            // add a button to submit the score
                            instructions.innerHTML += `<button onclick="submitScore()">Submit</button></br>`;	

                            instructions.innerHTML += `<p>or just play again maybe?</p>`;
                        }
                        else{
                            const name = localStorage.getItem("username");
                            
                            instructions.style.top = "25vh";
                            instructions.innerHTML += `<p>Submitting rank...</p>`;

                            window.saveScore(name, level).then(() => {
                                instructions.innerHTML = `<p>Nice try! You messed up on level ${level}!</>`;
                                instructions.innerHTML += `<p>You are ranked <span style="color: #ffc400">${window.rank}</span> on the <a href="/tradeoff">leaderboard</a>!</p>`;
                                instructions.innerHTML += `<button onclick="startGame()">Play Again</button>`;
                    
                            });
                        }

                        if(localStorage.getItem("level") == undefined ||  level > parseInt(localStorage.getItem("level"))){	
                            localStorage.setItem("level", level);
                        }
            
                        // add a button to play again
                        instructions.innerHTML += `<button onclick="startGame()">Play Again</button>`;

                    }
                }, levelInfo.shining < 6 ? 4000 : 8000);

            }, 1000);
    
        }, levelInfo.timer * 1000);

    }, 3000);

}

const submitScore = () => {
	var name = document.getElementById("name").value;
	localStorage.setItem("username", name);

    let instructions = document.getElementById("instructions");
    instructions.style.top = "25vh";
	// show a loading message
	instructions.innerHTML = `<p>Submitting...</p>`;

	window.saveScore(name, localStorage.getItem('level')).then(() => {
		
		instructions.innerHTML += `<p>You are ranked <span style="color: #ffc400">${window.rank}</span> on the <a href="/tradeoff">leaderboard</a>!</p>`;
		instructions.innerHTML += `<button onclick="startGame()">Play Again</button>`;

	});
}