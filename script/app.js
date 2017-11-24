const searchInput = document.querySelector('.js-search-input');
const searchAuto = document.querySelector('.search__autocomplete > ul');
const searchForm = document.querySelector('#search-form');
const articles = document.querySelector('.article-container');

// autocompletion
let timeout;
searchInput.addEventListener('keypress', function(e) {
  // debouncing
  clearTimeout(timeout);
  searchAuto.style.display = 'block';
  timeout = setTimeout(() => {
    const query = queryParams({
      "action": "opensearch",
      "format": "json",
      "search": e.target.value,
      "origin": "*"
    });
    const fetchPromise = fetch(`https://en.wikipedia.org/w/api.php?${query}`);

    fetchPromise
    .then(res => {
      return res.json();
    })
    .then(autocomplete => {
      searchAuto.innerHTML = autocomplete[1]
      .map(s => `<li class="aci">${s}</li>`)
      .join('');
      return searchAuto.querySelectorAll('li');
    })
    .then(list => {
      list.forEach(li => {
        li.addEventListener('click', function(e) {
          searchInput.value = e.target.textContent;
          // TODO: click search button
        })
      })
    });
  }, 1000);
})

searchForm.addEventListener('submit', function(e) {
  const [val, pageNum=0] = searchInput.value.split('::');
  // prevent from default
  e.preventDefault();
  // hiding the autocomplete
  searchAuto.style.display = 'none';
  const query = queryParams({
    "action": "query",
    "format": "json",
    "prop": "extracts|pageimages",
    "generator": "search",
    "exchars": "100",
    "exintro": 1,
    "explaintext": 1,
    "exsectionformat": "wiki",
    "pithumbsize": "100",
    "gsrsearch": val,
    "gsrnamespace": "0",
    "gsrlimit": "10",
    "gsroffset": `${pageNum*10}`,
    "origin": "*"
  });
  const fetchPromise = fetch(`https://en.wikipedia.org/w/api.php?${query}`);
  const tplSearch = document.querySelector('#tpl-article').innerHTML;

  fetchPromise
  .then(res => res.json())
  .then(json => {
    // remove previous articles
    articles.innerHTML = '';
    return Object.values(json.query.pages);
  })
  .then(pages => pages.sort((a, b) => a.index > b.index ? 1 : -1))
  .then(pages => pages.map(page => {
      const g = tplSearch
      .replace('{{id}}', page.pageid)
      .replace('{{heading}}', page.title)
      .replace('{{content}}', page.extract)
      .replace('{{has-image}}', page.thumbnail ? 'article--has-thumbnail' : '');

      const a = document.createElement('a');
      a.href = `https://en.wikipedia.org/?curid=${page.pageid}`;
      a.title = page.title;
      a.classList.add('al');
      a.innerHTML = g;

      if (page.thumbnail) {
        const img = document.createElement('img');
        img.src = page.thumbnail.source;
        img.height = page.thumbnail.height;
        img.width = page.thumbnail.width >= 90 ? 85 : page.thumbnail.width;
        img.classList.add('article__thumbnail');
        img.alt = page.title;

        var parentNode = a.querySelector('.article');
        var heading = a.querySelector('.article__heading');
        parentNode.insertBefore(img, heading);
      }

      return a;
    }))
  .then(pages => {
    pages.forEach(page => {
      articles.appendChild(page);
    })
  })
})

function queryParams(params) {
    return Object.keys(params)
        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
        .join('&');
}
