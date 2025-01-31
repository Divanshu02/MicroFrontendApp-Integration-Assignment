import ('./bootstrap')
// we are importing the index data from bootstap to make async call to resolve the error :Shared module is not available for eager consumption: 
// As earlier, index.js was rendering before the dependencies so that's why we shifted the code to bootstrap.js file and call it asynchronously in this file. It now delays the loading/rendering until dependencies are installed.