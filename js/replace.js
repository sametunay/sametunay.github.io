async function getItems(username) {
    var url = 'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@';

    if (username != null)
        url += username;
    else
        return null;

    return await fetch(url).then(response => response.json()).then(data => data.items);
}

async function replace() {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    var username = params?.username ?? 'sametunay';
    var articles = await getItems(username);
    crateContent(articles, params.guid, username);
}

function listArticles(notBlog = null, articles, username) {
    if (notBlog != null) {
        articles.splice(articles.findIndex(x => x.title === notBlog), 1);
    }

    var blogSection = document.getElementById("blog-hrefs");

    for (let index = 0; index < articles.length; index++) {
        const element = articles[index];
        var blog = document.createElement("button");
        blog.innerText = element.title;
        blog.onclick = () => { window.location.href = "?guid=" + getGuid(articles[index]) + "&username=" + username };
        blogSection.appendChild(blog);
    }
}

function getGuid(article) {
    return article.guid.split("https://medium.com/p/")[1];
}

function crateContent(articles, guid, username) {
    var article = articles.find(x => getGuid(x) === guid);

    listArticles(article?.title, articles, username);

    var side = document.getElementById("middle-side");

    var title = document.createElement("h1");
    title.innerText = article == null ? null : article.title;

    var dateLine = document.createElement("h5");
    dateLine.innerText = article == null ? null : article.pubDate;

    var content = document.createElement("div");
    content.classList.add("article");
    content.innerHTML = article == null ? null : article.content;

    side.appendChild(title);
    side.appendChild(dateLine);
    side.appendChild(content);
}