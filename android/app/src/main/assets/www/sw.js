/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-afac4cd2'], (function (workbox) { 'use strict';

  self.skipWaiting();
  workbox.clientsClaim();
  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "registerSW.js",
    "revision": "1872c500de691dce40960bb85481de07"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "ca85f40f6c0e3cf2f0f6150926b558c0"
  }, {
    "url": "pwa-512x512.png",
    "revision": "c46e65f73d33b5bb5bf9bc1df6aa796e"
  }, {
    "url": "pwa-192x192.png",
    "revision": "4d87f31772e9aa97f736d871535ee77f"
  }, {
    "url": "index.html",
    "revision": "21d0badd52b1936fcefea3ff505b3d10"
  }, {
    "url": "icon.svg",
    "revision": "70f462b9992d470c30e22847f6d708a5"
  }, {
    "url": "favicon.ico",
    "revision": "e0686934cc958376f23f736ec5308357"
  }, {
    "url": "apple-touch-icon.png",
    "revision": "0f59575cc71c216faf0c1d6e6ed41255"
  }, {
    "url": "assets/index-C0ZTebVj.js",
    "revision": null
  }, {
    "url": "assets/index-4_i1zZV4.css",
    "revision": null
  }, {
    "url": "apple-touch-icon.png",
    "revision": "0f59575cc71c216faf0c1d6e6ed41255"
  }, {
    "url": "favicon.ico",
    "revision": "e0686934cc958376f23f736ec5308357"
  }, {
    "url": "icon.svg",
    "revision": "70f462b9992d470c30e22847f6d708a5"
  }, {
    "url": "pwa-192x192.png",
    "revision": "4d87f31772e9aa97f736d871535ee77f"
  }, {
    "url": "pwa-512x512.png",
    "revision": "c46e65f73d33b5bb5bf9bc1df6aa796e"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "ca85f40f6c0e3cf2f0f6150926b558c0"
  }, {
    "url": "manifest.webmanifest",
    "revision": "d9e4beff4ed30b6eb34bd0b864933bbc"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("index.html")));
  workbox.registerRoute(/^https:\/\/fonts\.googleapis\.com\/.*/i, new workbox.CacheFirst({
    "cacheName": "google-fonts-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 10,
      maxAgeSeconds: 31536000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');
  workbox.registerRoute(/^https:\/\/fonts\.gstatic\.com\/.*/i, new workbox.CacheFirst({
    "cacheName": "gstatic-fonts-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 10,
      maxAgeSeconds: 31536000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');

}));
