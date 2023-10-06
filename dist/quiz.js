let answers = document.querySelectorAll(".answer");
let questions = document.querySelectorAll(".question:not(.score)");

let rightAnswers = [
    1,
    2,
    1,
    1,
    1,
    1,
    2
];

let score = 0;
let _name = "";

answers.forEach((answer, key) => {
    let k = (questions.length - 1/4 - key / 4) * 4;
    answer.addEventListener("click", (e) => {
        if(!questions[Math.floor(key / 4)].classList.contains("done")) {
            e.stopPropagation();
            console.log((key / 4 - Math.floor(key / 4)) * 4);
            console.log((rightAnswers[questions.length - Math.floor(key / 4) - 1] - 1));
            if((key / 4 - Math.floor(key / 4)) * 4 == 
            (rightAnswers[questions.length - Math.floor(key / 4) - 1] - 1)) {
                answer.classList.add("right");
                score += 10;
                if(Math.floor(key / 4) == 6) {
                    score += 10;
                }
            } else {
                answer.classList.add("wrong");
            }
            setTimeout(() => {
                questions[Math.floor(key / 4)].classList.add("done");
                if(Math.floor(key / 4) == 0) {
                    document.querySelector(".score .number").innerHTML = (score / 80 * 100) + "%";

                    const phpScriptUrl = 'http://localhost/nasa/public/add.php?name=' + _name + "&score=" + score / 80 * 100;
                    fetch(phpScriptUrl, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    })
                    .then(response => {
                        if (!response.ok) {
                        throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log(data);
                    })
                    .catch(error => {
                        console.error('Fetch error:', error);
                    });
                }
            }, 500);
        }
    });
});

document.querySelector(".start.btn").addEventListener("click", () => {
    let n = document.querySelector("input").value;
    if(n) {
        _name = n;
        document.querySelector(".nameInput").classList.add("done");
    }
})