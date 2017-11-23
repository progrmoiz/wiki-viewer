// autocompletion
const searchInput = document.querySelector('.js-search-input');
let timeout;

searchInput.addEventListener('keypress', function(e) {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    console.log(e);
  }, 1000);
})

function request(url, options={}) {
    options = {
        // your default options
        credentials: 'same-origin',
        redirect: 'error',
        ...options,
    };

    if(options.queryParams) {
        url += (url.indexOf('?') === -1 ? '?' : '&') + queryParams(options.queryParams);
        delete options.queryParams;
    }

    return fetch(url, options);
}

function queryParams(params) {
    return Object.keys(params)
        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
        .join('&');
}
