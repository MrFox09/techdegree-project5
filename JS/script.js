/*jshint esversion: 6 */

const fetchUser = (url) => {

  return fetch(url)
    .then(checkStatus)
    .then(response => response.json())
    .catch(error => console.log('Looks like there was a problem',error));
};

function checkStatus(response) {
  if (response.ok) {
    return Promise.resolve(response);

  }else {
    return Promise.reject(new Error(response.statusText));
  }
}

const galleryHTML = (user) => {
  





};


fetchUser('https://randomuser.me/api/?results=12')
  .then(data => console.log(data.results));
