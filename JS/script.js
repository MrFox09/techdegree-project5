/*jshint esversion: 8 */



/***

a function to make an API request. Takes a url as input and return a promise,
parse it to an JS object,
logs an error when something goes wron

***/

const fetchUser = async (url) => {

  const response = await fetch(url);
  if (checkStatus(response)) {

    const data = await response.json();
    const results = await data.results;


    return results;

  }


};


/***

Check the status of the response, if its ok, then return the resolved promise if not,
reject it and creates an Error object with the error text inside

 ***/

function checkStatus(response) {
  if (response.ok) {
    return Promise.resolve(response);

  }else {
    return Promise.reject(new Error(response.statusText));
  }
}


/***

Takes a user(object) as a paramter.
Builds the HTML to show every user in his own card.

 ***/

const galleryHTML = (user) => {
  const galleryDiv = document.getElementById('gallery');


  const parentCardDiv = document.createElement('div');
  parentCardDiv.setAttribute('class', 'card');

  const imgDiv = document.createElement('div');
  imgDiv.setAttribute('class','card-img-container');

  parentCardDiv.appendChild(imgDiv);

  const img = document.createElement('img');

  img.setAttribute('class','card-img');
  img.setAttribute('src',`${user.picture.large}`);
  img.setAttribute('alt','profile picture');

  imgDiv.appendChild(img);

  const infoDiv = document.createElement('div');
  infoDiv.setAttribute('class','card-info-container');

  infoDiv.innerHTML = `<h3 id="name" class="card-name cap">${user.name.first} ${user.name.last}</h3>
                      <p class="card-text">${user.email}</p>
                      <p class="card-text cap">${user.location.city}, ${user.location.state}</p>`;


  parentCardDiv.appendChild(infoDiv);
  galleryDiv.appendChild(parentCardDiv);

  parentCardDiv.addEventListener('click', () => {

    modalHTML(user);

  });




};


const modalHTML = (user) => {

      const modalDiv = document.createElement('div');
        modalDiv.setAttribute('class', 'modal-container');

        // convert birthdate from JSON to JS
        const birthdayJSON = user.dob.date;
        const birthdayJS = new Date(birthdayJSON);

        modalDiv.innerHTML = `<div class="modal">
            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            <div class="modal-info-container">
                <img class="modal-img" src= ${user.picture.large} alt="profile picture">
                <h3 id="name" class="modal-name cap">${user.name.first} ${user.name.last}</h3>
                <p class="modal-text">${user.email}</p>
                <p class="modal-text cap">${user.location.city}</p>
                <hr>
                <p class="modal-text">${user.phone}</p>
                <p class="modal-text">${user.location.street}, ${user.location.state} ${user.location.postcode}</p>
                <p class="modal-text">Birthday: ${birthdayJS}</p>
            </div>`;

      document.body.appendChild(modalDiv);



};

/***

triggers the fetchUser function and iterates through the array of objects -->
call galleryHTML function for every user

 ***/



fetchUser('https://randomuser.me/api/?results=12')

  .then((data) => {

    data.forEach(user => {
      galleryHTML(user);

    });


  });
