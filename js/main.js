/**********
1. API key: 573eb915d70b17490b4febd53b2411ca
2. To get config date, image base url: https://api.themoviedb.org/3/configuration?api_key=<<api_key>>
3. Fetch a list of movie based on keyword: https://api.themoviedb.org/3/search/movie?api_key=<APIkey>&query=<keywords>
4. To find more detail about a movie: https://api.themoviedb.org/3/movie/<movie_id>?api_key=<api_key>&language=en-US
**********/
const app = {
    pages: [],
    baseURL: 'https://api.themoviedb.org/3/',
    baseImageURL: null,
    configData: null,
    activePage: null,
    keyword: null,
    movie_id: 0,
    title: '',
    init: function () {
        /**********init main content**********/
        app.pages = document.querySelectorAll('.page');
        console.log(app.pages);
        console.log(APIKEY);
        /**********Add event listeners**********/
        document.querySelector('.search-button').addEventListener('click', app.getConfig);
        document.querySelector('.back-button').addEventListener('click', app.navBack);
        document.getElementById('search-input').addEventListener('keypress', function(ev){
            event.preventDefault;
            console.log(ev);
            if(event.keyCode==13){
                app.getConfig();
            }
        });

    },
    getConfig: function () {
        let url = ''.concat(app.baseURL, 'configuration?api_key=', APIKEY);
        let req = new Request(url, {
            method: 'GET',
            mode: 'cors'
        });
        app.keyword = document.getElementById('search-input').value;
        console.log(app.keyword);
        if(app.keyword==''){
            alert('Please input keywords.');
            
        }else{
        fetch(req)
            .then((result) => {
                return result.json();
            })
            .then((data) => {
                console.log('config-fetch', data);
                app.baseImageURL = data.images.secure_base_url;
                console.log('img', app.baseImageURL);
                app.configData = data.images;
                app.runSearch(app.keyword)
            })
            .catch(function (err) {
                alert(err);
            });
        }
    },
    navBack: function (ev) {
        window.location.reload(true);
    },
    runSearch: function (keyword) {
        /**********fetch list of movie**********/
        let url = ''.concat(app.baseURL, 'search/movie?api_key=', APIKEY, '&query=', keyword);
        fetch(url)
            .then(result => result.json())
            .then(
                (data) => {
                    console.log('seach-fetch', data);
                    //                        document.querySelector('.page1').innerHTML=JSON.stringify(data, null, 4)
                    let sectionContent = document.querySelector('.content');
                    /**********Clear previous results********/
                    while (sectionContent.hasChildNodes()) {
                        sectionContent.removeChild(sectionContent.lastChild);
                    }
                    /**********run displayMovies Get movies' title and images**********/
                    app.displayMovies(data);
                    app.nav("search");

                })
            .catch(function (err) {
                alert(err);
            })
    },
    nav: function (page) {
        if(page=="search"){
            document.getElementById('search-results').classList.add('active');
            document.getElementById('recommend-results').classList.remove('active');
            document.querySelector('.back-button').classList.add('active-back-button');
        }else if(page=="recommend"){
            document.getElementById('recommend-results').classList.add('active');
            document.getElementById('search-results').classList.remove('active');
        }
    },
    showLoading: function () {},
    hideLoading: function () {},
    displayMovies: function (data) {
        let df = new DocumentFragment();
        let resultContent = document.querySelector('.search-results-content')
        let searchMessage = document.createElement('h2');
        let pageTitle = document.querySelector('#search-results>.title');
        if(pageTitle.hasChildNodes()){pageTitle.removeChild(pageTitle.lastChild);}
        searchMessage.textContent='Results based on keywords " '+app.keyword+' ".';
        pageTitle.appendChild(searchMessage);
        console.log(resultContent);

        data.results.forEach((movie) => {
            let resultElement = document.createElement('div');
            let imgcontainer = document.createElement('div');//
            
            resultElement.setAttribute('id', movie.id);
            let img = document.createElement('img'); //Get image
            let pTitle = document.createElement('p');
            let pReleaseDate = document.createElement('p'); //Get release date
            let pRating = document.createElement('p'); //Get average rating
            let pOverview = document.createElement('p'); //Get Overview describtion
            pTitle.textContent = movie.title;
            pTitle.className = 'movietitle';
            pReleaseDate.textContent = ''.concat('Release Date: ', movie.release_date);
            pRating.textContent = ''.concat('Average Rating: ', movie.vote_average);
            if (movie.poster_path != null) {
                img.src = ''.concat(app.baseImageURL, 'w500', movie.poster_path);
                imgcontainer.appendChild(img);//
                imgcontainer.className='imgcontainer';
                resultElement.appendChild(imgcontainer);//
            };
            if(movie.overview.length>250){
                pOverview.textContent = ''.concat('Overview: ', movie.overview.substr(0,250),'......')
            }else{
            pOverview.textContent = ''.concat('Overview: ', movie.overview)};
            console.log(img.src);

            resultElement.appendChild(pTitle);
            resultElement.appendChild(pReleaseDate);
            resultElement.appendChild(pRating);
            resultElement.appendChild(pOverview);
            df.appendChild(resultElement);
        });
        resultContent.appendChild(df);
        let props = document.querySelectorAll('.search-results-content>div');

        app.makeMovieElement(props);
        //change search bar style
        document.querySelector('.search').classList.add('search-top');
        console.log("TTT", document.querySelector('.search').classList)
        document.querySelector('h1').style.display='none';
    },
    makeMovieElement: function (props) {
        console.log(props);
        props.forEach((makeCard) => {
            makeCard.className = 'card';
            console.log('addlistener');
            makeCard.addEventListener('click', app.fetchRecommendations);
        })

    },
    fetchRecommendations: function (ev) {
        let movieId = ev.target.getAttribute('id');
        app.title = ev.target.children[1].textContent;
        console.log(ev.target);
        console.log(movieId);
        console.log(app.title);

        /**********fetch list of recommended movie**********/
        let url = ''.concat(app.baseURL, 'movie/', movieId, '/recommendations?api_key=', APIKEY);
        console.log(url);
        fetch(url)
            .then(result => result.json())
            .then(
                (data) => {
                    /**********Get movies' title and images**********/
                    app.displayRecommendations(data);
                    app.nav('recommend');
                })
            .catch(function (err) {
                alert(err);
            })
    },
    displayRecommendations: function (data) {
        let df = new DocumentFragment();
        let resultContent = document.querySelector('.recommend-results-content')
        /**********Clear previous results********/
        while (resultContent.hasChildNodes()) {
            resultContent.removeChild(resultContent.lastChild);
        }
        let searchMessage = document.createElement('h2');
        let pageTitle = document.querySelector('#recommend-results>.title');
        if(pageTitle.hasChildNodes()){pageTitle.removeChild(pageTitle.lastChild);}
        searchMessage.textContent='Recommendations based on movie " '+app.title+' ".';
        pageTitle.appendChild(searchMessage);

        data.results.forEach((movie) => {
            let resultElement = document.createElement('div');
            let imgcontainer = document.createElement('div');//add
            
            let img = document.createElement('img'); //Get image
            let pTitle = document.createElement('p');
            let pReleaseDate = document.createElement('p'); //Get release date
            let pRating = document.createElement('p'); //Get average rating
            let pOverview = document.createElement('p'); //Get Overview describtion
            pTitle.textContent = movie.title;
            pTitle.className = 'movietitle';
            pReleaseDate.textContent = ''.concat('Release Date: ', movie.release_date);
            pRating.textContent = ''.concat('Average Rating: ', movie.vote_average);

            if (movie.poster_path != null) {
                img.src = ''.concat(app.baseImageURL, 'w500', movie.poster_path);
                imgcontainer.appendChild(img);//change
                resultElement.appendChild(imgcontainer);//add
                imgcontainer.className='imgcontainer';
            };
            if(movie.overview.length>180){
                pOverview.textContent = ''.concat('Overview: ', movie.overview.substr(0,180),'......')
            }else{
            pOverview.textContent = ''.concat('Overview: ', movie.overview)};
            console.log(img.src);

            resultElement.appendChild(pTitle);
            resultElement.appendChild(pReleaseDate);
            resultElement.appendChild(pRating);
            resultElement.appendChild(pOverview);
            df.appendChild(resultElement);
        });
        resultContent.appendChild(df);
        let props = document.querySelectorAll('.recommend-results-content>div');

        app.makeRecommendElement(props);
    },
    runRecommend: function (title) {},
    makeRecommendElement: function (props) {
        props.forEach((makeCard) => {
            makeCard.className = 'card';

        })
    }
}
document.addEventListener('DOMContentLoaded', app.init);


//const APIKEY = '573eb915d70b17490b4febd53b2411ca';
//let baseURL = 'https://api.themoviedb.org/3/';
