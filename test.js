console.log("Hello world!");

process.argv.forEach(function(val, index, _) {
    console.log(index + ': ' + val);
});
