import LazyLoad from 'vanilla-lazyload';

const Global = {
  lazyLoad: (thresDistance) => {
    const distance = thresDistance || 0;
    const myLazyLoad = new LazyLoad({
      elements_selector: '.lazy',
      threshold: distance,
      callback_enter: (element) => {
        element.classList.add('loaded');
      },
    });
    myLazyLoad.update();
  },

  fixBodyScrollWhenOpenModal: () => {
    document.querySelector('body').classList.add('modal-open');
  },

  removefixBodyScrollWhenCloseModal: () => {
    document.querySelector('body').classList.remove('modal-open');
  },

  requestDataFromUrl: url => new Promise((resolve) => {
    const xhrHttp = new XMLHttpRequest();
    xhrHttp.responseType = 'json';
    xhrHttp.onreadystatechange = () => {
      if (xhrHttp.readyState === 4 && xhrHttp.status === 200) {
        resolve(xhrHttp.response);
      }
    };
    xhrHttp.open('GET', url, true);
    xhrHttp.send();
  }),
  getDataFromUrl: async (url) => {
    const dataResult = await Global.requestDataFromUrl(url);
    return dataResult;
  },
  requestDataFromUrlWithHeader: (url, header) => new Promise((resolve) => {
    const xhrHttp = new XMLHttpRequest();
    xhrHttp.responseType = 'json';
    xhrHttp.onreadystatechange = () => {
      if ((xhrHttp.readyState === 4 && xhrHttp.status === 200)
          || xhrHttp.readyState === XMLHttpRequest.DONE) {
        resolve(xhrHttp.response);
      }
    };
    xhrHttp.open('GET', url, true);
    xhrHttp.setRequestHeader('secret-key', header);
    xhrHttp.send();
  }),
  getDataFromUrlWithHeader: async (url, header) => {
    const dataResult = await Global.requestDataFromUrlWithHeader(url, header);
    return dataResult;
  },
  requestDataFromUrlPost: (url, data) => new Promise((resolve) => {
    const xhrHttp = new XMLHttpRequest();
    const jsonData = JSON.stringify(data);
    xhrHttp.responseType = 'json';
    xhrHttp.open('POST', url, true);
    xhrHttp.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhrHttp.onload = () => {
      if (xhrHttp.readyState === 4 && xhrHttp.status === 200) {
        resolve(xhrHttp.response);
      }
    };
    xhrHttp.send(jsonData);
  }),
  getDataFromUrlPost: async (url, data) => {
    const dataResult = await Global.requestDataFromUrlPost(url, data);
    return dataResult;
  },
  isDeviceMobile: () => {
    if (navigator.userAgent.match(/Android/i)
    || navigator.userAgent.match(/webOS/i)
    || navigator.userAgent.match(/iPhone/i)
    || navigator.userAgent.match(/iPad/i)
    || navigator.userAgent.match(/iPod/i)
    || navigator.userAgent.match(/BlackBerry/i)
    || navigator.userAgent.match(/Windows Phone/i)
    || window.innerWidth <= 992
    ) {
      return true;
    }
    return false;
  },
};

export default Global;
