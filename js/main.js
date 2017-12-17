/**********
1. API key: 573eb915d70b17490b4febd53b2411ca
2. To get config date, image base url: https://api.themoviedb.org/3/configuration?api_key=<<api_key>>
3. Fetch a list of movie based on keyword: https://api.themoviedb.org/3/search/movie?api_key=<APIkey>&query=<keywords>
4. To find more detail about a movie: https://api.themoviedb.org/3/movie/<movie_id>?api_key=<api_key>&language=en-US
**********/
const app = {
    currentPage: null,
    totalPages: null,
    baseURL: 'https://api.themoviedb.org/3/',
    baseImageURL: null,
    configData: null,
    activePage: null,
    keyword: null,
    movie_id: 0,
    title: '',
    init: function () {
        /**********init main content**********/
        document.getElementById('search-input').focus();
        app.pages = document.querySelectorAll('.page');
        console.log(app.pages);
        console.log(APIKEY);
        /**********Add event listeners**********/
        document.querySelector('.search-button').addEventListener('click', app.getConfig);
        document.querySelector('.back-button').addEventListener('click', app.navBack);
        //listen to return or enter press
        document.addEventListener('keypress', function (ev) {
            let char = ev.char || ev.charCode || ev.which;
            if (char == 10 || char == 13) {
                //they hit <enter> or <return>
                document.querySelector('.search-button').dispatchEvent(new MouseEvent('click'));
            }
        });
    },
    getConfig: function () {
        app.currentPage = 1;
        let url = ''.concat(app.baseURL, 'configuration?api_key=', APIKEY);
        let req = new Request(url, {
            method: 'GET',
            mode: 'cors'
        });
        app.keyword = document.getElementById('search-input').value;
        console.log(app.keyword);
        if (!app.keyword) {
            alert('Please input keywords.');

        } else {
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
        if (app.activePage == 'search') {
            window.location.reload(true);
        } else if (app.activePage == 'recommend') {
            let cards= document.querySelectorAll('.card');
                cards.forEach((card)=>card.classList.remove('card-in'));
             document.getElementById('search-results').classList.add('active');
            setTimeout(function(){
                   
                
                cards.forEach((card)=>card.classList.add('card-in'))        
                       },100);
            document.getElementById('recommend-results').classList.remove('active');
            window.scrollTo(0, 0);
            app.activePage = 'search';
        }

    },
    runSearch: function (keyword) {
        /**********fetch list of movie**********/
        let url = ''.concat(app.baseURL, 'search/movie?api_key=', APIKEY, '&query=', keyword, '&page=', app.currentPage);
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
        window.scrollTo(0, 0);
        if (page == "search") {
            app.activePage = 'search';
            document.getElementById('search-results').classList.add('active');
            let cards= document.querySelectorAll('.active .card');
            cards.forEach((card)=>card.classList.remove('card-in'));
            setTimeout(function(){
                
                cards.forEach((card)=>card.classList.add('card-in'));        
                       },100);
            
            document.getElementById('recommend-results').classList.remove('active');
            document.querySelector('.back-button').classList.add('active-back-button');
        } else if (page == "recommend") {
            app.activePage = 'recommend';
            document.getElementById('recommend-results').classList.add('active');
            let cards= document.querySelectorAll('.active .card');
            cards.forEach((card)=>card.classList.remove('card-in'));
            setTimeout(function(){
                cards.forEach((card)=>card.classList.add('card-in'));        
                       },100);
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
        app.totalPages = data.total_pages;
        if (pageTitle.hasChildNodes()) {
            pageTitle.removeChild(pageTitle.lastChild);
        }
        searchMessage.innerHTML = 'Results based on keywords " ' + app.keyword + ' ". <br>Current Page: ' + app.currentPage + '.&nbsp&nbsp Total result pages: ' + app.totalPages + '.';
        pageTitle.appendChild(searchMessage);
        console.log(resultContent);

        data.results.forEach((movie) => {
            let resultElement = document.createElement('div');
            let imgcontainer = document.createElement('div'); //

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
                img.alt = 'Poster of movie ' + movie.title;

            } else {
                img.alt = 'No Poster Information';

            };
            imgcontainer.appendChild(img);
            imgcontainer.className = 'imgcontainer';
            resultElement.appendChild(imgcontainer);
            if (movie.overview.length == 0 || movie.overview == null) {
                pOverview.textContent = 'Overview: No Overview Information.'
            } else if (movie.overview.length > 250) {
                pOverview.textContent = ''.concat('Overview: ', movie.overview.substr(0, 250), '......')
            } else {
                pOverview.textContent = ''.concat('Overview: ', movie.overview)
            };
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
        document.querySelector('h1').style.display = 'none';
        app.makePagination();





    },
    makeMovieElement: function (props) {
        console.log(props);
        props.forEach((makeCard) => {
            makeCard.className = 'card pointer';
            console.log('addlistener');
            makeCard.addEventListener('click', app.fetchRecommendations);
        })

    },
    fetchRecommendations: function (ev) {
        app.currentPage = 1;
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
        console.log('rec', data)
        let resultContent = document.querySelector('.recommend-results-content')
        if (data.total_results == 0) {
            resultContent.textContent = 'Sorry, there is no recommendations based on movie "' + app.title + '".';
        } else {
            let df = new DocumentFragment();
            /**********Clear previous results********/
            while (resultContent.hasChildNodes()) {
                resultContent.removeChild(resultContent.lastChild);
            }
            let searchMessage = document.createElement('h2');
            let pageTitle = document.querySelector('#recommend-results>.title');
            if (pageTitle.hasChildNodes()) {
                pageTitle.removeChild(pageTitle.lastChild);
            }
            app.totalPages = data.total_pages;
            if (pageTitle.hasChildNodes()) {
                pageTitle.removeChild(pageTitle.lastChild);
            }
            searchMessage.innerHTML = 'Recommendations based on movie " ' + app.title + ' ". <br>Current Page: ' + app.currentPage + '.&nbsp&nbsp Total result pages: ' + app.totalPages + '.';

            pageTitle.appendChild(searchMessage);

            data.results.forEach((movie) => {
                let resultElement = document.createElement('div');
                let imgcontainer = document.createElement('div'); //add

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
                    imgcontainer.appendChild(img); //change
                    resultElement.appendChild(imgcontainer); //add
                    imgcontainer.className = 'imgcontainer';
                };
                if (movie.overview == null || movie.overview.length == 0) {
                    pOverview.textContent = 'Overview: No Overview Information.'
                } else if (movie.overview.length > 250) {
                    pOverview.textContent = ''.concat('Overview: ', movie.overview.substr(0, 250), '......')
                } else {
                    pOverview.textContent = ''.concat('Overview: ', movie.overview)
                };
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

        }
    },
    runRecommend: function (title) {},
    makeRecommendElement: function (props) {
        props.forEach((makeCard) => {
            makeCard.className = 'card';

        })
    },
    makePagination: function () {
        //make pagination

        let pagination = document.querySelector('.pagination');
        pagination.innerHTML = '';

        if (app.currentPage < app.totalPages) {
            let nextPage = document.createElement('button');
            nextPage.textContent = 'Next Page';
            nextPage.className = 'nextPage';
            pagination.appendChild(nextPage);
            nextPage.addEventListener('click', app.runNextPage);
        }
        let pageInput = document.createElement('input');
        let goButton = document.createElement('button');
        goButton.textContent = 'Go';
        goButton.addEventListener('click', app.jumpPage)
        pageInput.setAttribute('type', 'number');
        pageInput.setAttribute('max', app.totalPages);
        pageInput.setAttribute('min', '1');
        pageInput.setAttribute('placeholder', 'Jump To')
        pagination.appendChild(pageInput);
        pagination.appendChild(goButton);
    },
    runNextPage: function (ev) {
        app.currentPage += 1;
        app.runSearch(app.keyword);
    },
    jumpPage: function () {
        app.currentPage = document.querySelector('.pagination input').value;
        if (app.currentPage > app.totalPages) {
            alert('The number you input is over the range');
        } else {
            app.runSearch(app.keyword);
        }

    }
}
document.addEventListener('DOMContentLoaded', app.init);


//const APIKEY = '573eb915d70b17490b4febd53b2411ca';
//let baseURL = 'https://api.themoviedb.org/3/';
