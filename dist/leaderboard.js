const apiUrl = 'leaderboard.json';

fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
        }
        
        return response.json();
    })
    .then(data => {
        let element = document.querySelector(".container");
        let places = data.myArray.sort((a, b) => b.score - a.score);
        places.forEach((rank, key) => {
            let r;
            if(key == 0)
                r = "1st 🥇";
            else if (key == 1)
                r = "2nd 🥈";
            else if (key == 2)
                r = "3rd 🥉";
            else 
                r = (key + 1) + "th";

            element.innerHTML += `
            <div class="place">
                <span class="name">${key + 1}- ${rank.name} : ${rank.score}%</span>
                <span class="rank">${r} place</span>
            </div>            
            `;
        });
    })
    .catch(error => {
        console.error('Fetch error:', error);
    });
