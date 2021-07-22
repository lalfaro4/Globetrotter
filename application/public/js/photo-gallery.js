const addButton = document.getElementById("add-img-btn");
const grid = document.getElementById("images-container");
const saveButton = document.getElementById("save-btn");

// Everytime a user click the "+" button, the getRandomDogURL function gets called.
addButton.addEventListener("click", getRandomDogURL);

saveButton.addEventListener('click', (event) => { window.location.href = '/public/html/purchasedtrips.html'});

// This function gets called anytime the user hits the "+" button in the photo gallery. It displays an image of a puppy
// for now. Will be made so that it will actually upload an image later on.
function getRandomDogURL(){  
    


    const image = document.createElement("img");
    
    fetch('https://random.dog/woof.json')
        .then(res => res.json())
        .then(data => {
            if(data.url.includes('.jpg') || data.url.includes('.mp4') || data.url.includes('.gif')){
                getRandomDogURL();
            }else{
                image.src = data.url;
                grid.appendChild(image);
                    
            }
                    
        })



}

// function createImage(event){
   

// }

