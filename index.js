let API_KEY = '9bb360825526466d9a7728f70083d892';

let currentPage = 1;
let currentCategory = null;
let currentKeyword = null;
let lastArticleCount = 0;


//news fetch

function fetchNews(isSearching) {
    const spinner = document.getElementById('spinner');
    spinner.style.display = "block";
    let url;
    if (isSearching) {
        const keyword = document.getElementById('searchKeyword').value;
        url = `https://newsapi.org/v2/everything?q=${keyword}&apiKey=${API_KEY}&page=${currentPage}`;
    } else {
        const category = currentCategory || document.getElementById('category').value;
        url = `https://newsapi.org/v2/top-headlines?country=in&category=${category}&apiKey=${API_KEY}&page=${currentPage}`
    }

    fetch(url).then(res => res.json()).then(data => {
        spinner.style.display = "none";
        const newsContainer = document.getElementById('newsContainer');
        if (currentPage === 1) {
            newsContainer.innerHTML = "";
        }

        const articlesWithImages = data.articles.filter(article => article.urlToImage);
        if (articlesWithImages.length === 0 || articlesWithImages.length === lastArticleCount) {
            displayNoMoreNews();
            return;
        }
        lastArticleCount = articlesWithImages.length;

        articlesWithImages.forEach(article => {
            const newsItem = `
               <div class ="newsItem">
                  <div class = "newsImage">
                    <img src = ${article.urlToImage} alt = ${article.title} height="200px" width="200px">
                  </div>

                <div class ="newsContent">
                   <div class="info">
                     <h5>${article.source.name}</h5>
                     <span>|</span>
                     <h5>${article.publishedAt}</h5>
                   </div>
                   <h2>${article.title}</h2>
                   <p>${article.description}</p>
                    <a href ="${article.url}"> Read More</a>
                </div>
                
               </div>
            `;
            newsContainer.innerHTML += newsItem
        });
        currentPage++;

    }).catch(error => {
        console.log(error);
        spinner.style.display = 'none'
    })
}


function displayNoMoreNews() {
    const newsContainer = document.getElementById('newsContainer');
    newsContainer.innerHTML += '<p> No more news to load.</p>'
};





document.getElementById("searchKeyword").addEventListener('input', function () {
    // console.log(this.value)
    currentPage = 1;
    currentCategory = null;
    currentKeyword = this.value;
    // fetchNews(true);

})

document.getElementById("fetchCategory").addEventListener('click', function () {
    currentPage = 1;
    currentKeyword = null;
    document.getElementById('searchKeyword').value = "";
    fetchNews(false);
})