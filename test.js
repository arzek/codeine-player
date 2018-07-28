var axios = require('axios');


axios.get('https://www.googleapis.com/youtube/v3/videos', {
  params: {
    part: 'snippet',
    id: '4Y4YSpF6d6w',
    key: 'AIzaSyAFHTSwmLHZDcEZ4ZOhptenWC-7R6_BKJw'
  }
})
.then(function (response) {
  console.log(response.data);
});