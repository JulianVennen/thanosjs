const files = require('./files.js');
const thanos = require('./thanos.js');

const inputfolder = process.argv[2];
const outputfolder = process.argv[3];

(async () => {
  if(!inputfolder||!outputfolder){
    console.log("Usage: node index.js input output");
    return ;
  }
  const start = Date.now();
  //get region folders
  const regionfolders = await files.init(inputfolder, outputfolder);
  if (!regionfolders) {
    return ;
  }
  //snap
  const snapped = await thanos.snap(regionfolders, inputfolder, outputfolder);

  console.log("Total: Snapped %s Chunks in %ss",snapped,(Date.now()-start)/1000);
})();
