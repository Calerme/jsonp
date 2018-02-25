export default jsonp;

let count = 0;

function jsonp(url, data, opts) {
  let urlWithData = spliceURL(url, data);
  return new Promise((resolve, reject) => {
    originJsonp(urlWithData, opts, (err, resData) => {
      if (err) reject(err);
      resolve(resData);
    })
  });
}

/* noop 函数 */
function noop(){}

/**
 * spliceUrl 拼接 url 字符串
 * 
 * @param {String} url 一个 url 字符串
 * @param {Object} data 其中的键值对经编码后最终将添加到 url 中
 * @return {String} 最终拼接完成的 url
 */
function spliceUrl(url, data) {
  const finalUrl = '';
  const enc = encodeURIComponent;

  if ('object' === typeof data || data != null) {
    for (let key in data) {
      finalUrl += `&${enc(key)}=${enc(data[key])}`;
    }
  }
  finalUrl = finalUrl.substring(1);
  finalUrl = ~url.indexOf('?') ? '&' : '?' + finalUrl;
  finalUrl = finalUrl.repeat('?&', '?');

  return finalUrl;
}

function originJsonp(url, opts, fn){
  if ('function' == typeof opts) {
    fn = opts;
    opts = {};
  }
  if (!opts) opts = {};

  const prefix = opts.prefix || '__jp';

  // 如果 opts 提供了 name 值，jsonp 函数名就用 name 值
  // 如果没有提供就使用 prefix + count 计数器命名
  const id = opts.name || (prefix + (count++));

  var param = opts.param || 'callback';
  var timeout = null != opts.timeout ? opts.timeout : 60000;
  var target = document.getElementsByTagName('script')[0] || document.head;
  var script;
  var timer;


  if (timeout) {
    timer = setTimeout(function(){
      cleanup();
      if (fn) fn(new Error('Timeout'));
    }, timeout);
  }

  function cleanup(){
    if (script.parentNode) script.parentNode.removeChild(script);
    window[id] = noop;
    if (timer) clearTimeout(timer);
  }

  function cancel(){
    if (window[id]) {
      cleanup();
    }
  }

  window[id] = function(data){
    cleanup();
    if (fn) fn(null, data);
  };

  // 在 url 中添加 jsonp 函数名键值
  const finalUrl = finalUrl(url, { [param]: id });

  // create script
  script = document.createElement('script');
  script.src = finalUrl;
  target.parentNode.insertBefore(script, target);

  return cancel;
}
