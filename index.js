//Imports for app to work
import express  from 'express'
import axios    from 'axios'
import dotenv from 'dotenv'

//Variables for app to work
const
app             = express(),
url             = "yourcompany.co.uk",
apiEndpointURL  = "change me to endpoint API URL",
access_token    = process.ENV.access_token,
client_id       = process.ENV.client_id,
client_secret   = process.ENV.client_secret,
account_id      = process.ENV.account_id,
languages       = []

//config dotenv
dotenv.config();

//FUNCTIONS
//Refresh Token
function refreshToken() {
  return axios({
    method: "post",
    url:
      "change to your marketing cloud endpoint",
    headers: {
      "Content-Type": "application/json"
    },
    data: {
      grant_type: "client_credentials",
      client_id: client_id,
      client_secret: client_secret,
      account_id: account_id
    }
  })
    .then(function(response) {
      console.log("access token is = " + response.data.access_token);
      access_token = response.data.access_token;
    })
    .catch(function(error) {
      console.log(error);
    });
}

//COUNTRY FUNCTIONS
//Get Videos For Country
function getVideosForCountry(country) {
  return axios({
    method: "get",
    url:
      apiEndpointURL +
      country.name,
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(function(response) {
      var sixteenVideos = response.data.playlist;
      var videoItems = [];
      for (var x = 0; x < 9; x++) {
        videoItem = {
          keys: {
            video: "vid" + [x + 1]
          },
          values: {
            url: url+sixteenVideos[x].owner_nickname+'/'+sixteenVideos[x].slug,
            thumb: sixteenVideos[x].image,
            title: sixteenVideos[x].title,
            desc: sixteenVideos[x].description,
            type: "video"
          }
        };
        videoItems.push(videoItem);
      }

      console.log(videoItems);
      return videoItems;
    })
    .catch(function(error) {
      console.log(error);
    });
}

//Post Videos For Country
function postVideos(country, videos) {
  axios({
    method: "post",
    url:
      apiEndpointURL +
      country.code +
      "_JWPlayerContent/rowset",
    headers: {
      ContentType: "application/json",
      Authorization: "Bearer " + access_token
    },
    data: videos
  })
    .then(function() {
      console.log("Success!");
    })
    .catch(function(error) {
      console.log(error.response);
    });
}

//FUNCTION EXECUTION
//For Countries
var refreshTokenPromise = refreshToken();
refreshTokenPromise.then(function() {
  languages.forEach(function(language) {
    getVideosForCountry(language).then(function(videos) {
      postVideos(language, videos);
    });
  });
});

//Listen on
var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("listening on " + port);
});