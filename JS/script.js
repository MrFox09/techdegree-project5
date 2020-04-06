/*jshint esversion: 8 */

//iniatly stores data of the current users,changes when needed, depends on the search function
let currentUser = [];

//stores the fetched objects to a variable
const initalCurrentUser = [];





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

  } else {
    return Promise.reject(new Error(response.statusText));
  }
}


/***
Takes a user(object) as a paramter.
Iterates through the objects in the array.
Builds the HTML to show every user.
 ***/



const galleryHTML = (user) => {

  user.forEach((user) => {
      const galleryDiv = document.getElementById('gallery');


      const parentCardDiv = document.createElement('div');
      parentCardDiv.setAttribute('class', 'card');

      const imgDiv = document.createElement('div');
      imgDiv.setAttribute('class', 'card-img-container');

      parentCardDiv.appendChild(imgDiv);

      const img = document.createElement('img');

      img.setAttribute('class', 'card-img');
      img.setAttribute('src', `${user.picture.large}`);
      img.setAttribute('alt', 'profile picture');

      imgDiv.appendChild(img);

      const infoDiv = document.createElement('div');
      infoDiv.setAttribute('class', 'card-info-container');

      infoDiv.innerHTML = `<h3 id="name" class="card-name cap">${user.name.first} ${user.name.last}</h3>
                      <p class="card-text">${user.email}</p>
                      <p class="card-text cap">${user.location.city}, ${user.location.state}</p>`;


      parentCardDiv.appendChild(infoDiv);
      galleryDiv.appendChild(parentCardDiv);

      // event listener for each card and calls the modalHTML to create the pop up Windows
      // and findIndex to find out which index the clicked card have, for scrolling through the pop ups

      parentCardDiv.addEventListener('click', () => {

        modalHTML(user);
        findIndex(`${user.name.first} ${user.name.last}`);

      });


      //initaly save/push current (fetched) user objects to a variable, currentUser

      currentUser.push(user);


    });
  };

/***
Takes a user(object) as a paramter.
Builds the modalHTML (Pop-up Windows) to show every user in his own card.
 ***/


const modalHTML = (user) => {


  const modalDiv = document.createElement('div');
  modalDiv.setAttribute('class', 'modal-container');

  // convert birthdate from JSON to JS
  const birthdayJSON = user.dob.date;
  const birthdayJS = new Date(birthdayJSON);
  const year = birthdayJS.getFullYear();
  const date = birthdayJS.getDate();
  const month = birthdayJS.getMonth();

  // create the Pop Up Windows

  modalDiv.innerHTML = `<div class="modal">
            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            <div class="modal-info-container">
                <img class="modal-img" src= ${user.picture.large} alt="profile picture">
                <h3 id="name" class="modal-name cap">${user.name.first} ${user.name.last}</h3>
                <p class="modal-text">${user.email}</p>
                <p class="modal-text cap">${user.location.city}</p>
                <hr>
                <p class="modal-text">${user.phone}</p>
                <p class="modal-text">${user.location.street.number} ${user.location.street.name} , ${user.location.state} ${user.location.postcode}</p>
                <p class="modal-text">Birthday: ${year}/${date}/${month}</p>
            </div>
            <div class="modal-btn-container">
                <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                <button type="button" id="modal-next" class="modal-next btn">Next</button>
            </div>
        </div>`;

  document.body.appendChild(modalDiv);

  // Event listeners

  // X button remove the modalDiv

  document.getElementById('modal-close-btn').addEventListener('click', () => {
    modalDiv.remove();

  });


  // prev button, remove the current modalDiv and call the toggle function with the direction as
  // an argument

  document.getElementById('modal-prev').addEventListener('click', () => {
    modalDiv.remove();
    toggle('prev');

  });

  // next button,remove the current modalDiv and call the toggle function with the direction as
  // an argument

  document.getElementById('modal-next').addEventListener('click', (e) => {
    modalDiv.remove();
    toggle('next');

  });

};


/***
when the user-card is clicked, the findIndex function will run, till the name matches in the currentUser array,
stores the index in the index variable
***/

let index = 0;

function findIndex(input) {


  for (var i = 0; i < currentUser.length; i++) {
    if (`${currentUser[i].name.first} ${currentUser[i].name.last}` === input) {
      index = i;
    }
  }


}

/***
takes the direction from the modalHTML event listener as an input,
calls modalHTML again to move forward or backwards in the currrent user list
***/

function toggle(direction) {
  if (direction === 'next') {
    index += 1;
    if (index === currentUser.length) {
      index = 0;
    }

    modalHTML(currentUser[index]);


  } else if (direction === 'prev') {
    index -= 1;
    if (index < 0) {
      index = currentUser.length - 1;
    }
    modalHTML(currentUser[index]);
  }
}



/***
triggers the fetchUser function and iterates through the array of objects -->
call galleryHTML function for every user and creates the initalCurrentUser array
to save every users object
 ***/



fetchUser('https://randomuser.me/api/?nat=gb&results=12')

  .then((data) => {

    galleryHTML(data);

    data.map(user => {


      initalCurrentUser.push(user);

    });
  });



/***
Search section
 ***/

//add search field to webpage

const searchForm = document.createElement('form');

searchForm.setAttribute('action', '#');

searchForm.setAttribute('method', 'get');

searchForm.innerHTML = `<input type="search" id="search-input" class="search-input" placeholder="Search...">
                           <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">`;

document.getElementsByClassName('search-container')[0].appendChild(searchForm);


/***
create a search function, takes the input from the input field and search through
the array of cards on the page, block every card, show just the matched ones
***/


// every user card on the page
const userCards = document.getElementsByClassName('card');

let searchResultsIndex = [];


//function to filter through the names, to show the results and store the matched index to a variable

const search = (input) => {

  //save the names only

  const userNames = document.getElementsByTagName('h3');


  for (let i = 0; i < userCards.length; i++) {
    userCards[i].style.display = 'none';

    if (input.value.length != 0 && userNames[i].innerText.toLowerCase().includes(input.value.toLowerCase())) {
      userCards[i].style.display = '';

      //push the matched index to a variable
      searchResultsIndex.push(i);


    }


  }

  // call the function to get a new array(objects) which matched the search
  createSearchResultArray(initalCurrentUser, searchResultsIndex);

};

// keyup event listener for the searchfield

searchForm.addEventListener('keyup', (e) => {

//everytime the listener fires the arrays should be empty
  newArray = [];
  searchResultsIndex = [];
  currentUser = newArray;


// call the search function
  search(e.target);


  for (var i = 0; i < userCards.length; i++) {
    if (e.target.value === '') {

      currentUser = initalCurrentUser;

      userCards[i].style.display = '';

    }
  }
});


/***
function who takes an array and and an array with index numbers as an input,
to create a new Array(searchresults)
***/

let newArray = [];

function createSearchResultArray(arrayAll, matchIndex) {


  for (let i = 0; i < matchIndex.length; i++) {

    newArray.push(arrayAll[matchIndex[i]]);


  }
}
