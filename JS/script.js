/*jshint esversion: 6 */
const galleryDiv = document.getElementById('gallery');

/***

a function to make an API request. Takes a url as input and return a promise,
parse it to an JS object,
logs an error when something goes wron

***/

const fetchUser = (url) => {

  return fetch(url)
    .then(checkStatus)
    .then(response => response.json())
    .catch(error => console.log('Something goes wrong',error));
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


  const parentCardDiv = document.createElement('div');
  parentCardDiv.setAttribute('class', 'card');

  const imgDiv = document.createElement('div');
  imgDiv.setAttribute('class','card-img-container');

  parentCardDiv.appendChild(imgDiv);

  const img = document.createElement('img');

  img.setAttribute('class','card-img');
  img.setAttribute('src',`${user.picture.medium}`);
  img.setAttribute('alt','profile picture');

  imgDiv.appendChild(img);

  const infoDiv = document.createElement('div');
  infoDiv.setAttribute('class','card-info-container');

  infoDiv.innerHTML = `<h3 id="name" class="card-name cap">${user.name.first} ${user.name.last}</h3>
                      <p class="card-text">${user.email}</p>
                      <p class="card-text cap">${user.location.city}, ${user.location.state}</p>`;


  parentCardDiv.appendChild(infoDiv);
  galleryDiv.appendChild(parentCardDiv);

};

/***

triggers the fetchUser function and iterates through the array of objects -->
call galleryHTML function for every user

 ***/

fetchUser('https://randomuser.me/api/?results=12')
  .then(data => {
    const userAll = data.results;

    userAll.forEach(user => {
      galleryHTML(user);
    });
  });
