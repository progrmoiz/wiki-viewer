const searchInput = document.querySelector('.js-search-input');
const searchAuto = document.querySelector('.search__autocomplete > ul');

// autocompletion
let timeout;
searchInput.addEventListener('keypress', function(e) {
  // debouncing
  clearTimeout(timeout);
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

function queryParams(params) {
    return Object.keys(params)
        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
        .join('&');
}
