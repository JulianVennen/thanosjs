const fs = require('fs');
const RegionFile = require('./node_modules/prismarine-provider-anvil/src/region.js');
let snapped = 0;

exports.snap = async (regionfolders, inputfolder, outputfolder) => {
  for (folder of regionfolders){
    //all region files
    const files = fs.readdirSync(folder)
    for (file of files){

      //all chunks
      const path = folder+"/"+file;
      const region = await getRegion(path);
      for (let x = 0; x < 32; x++)
        for (let z = 0; z < 32; z++){
          let chunk = await region.read(x & 0x1F, z & 0x1F);
          if(chunk){
            //copy non chunk mcas
            if (!chunk.value.Level) {
              fs.copyFileSync(path,path.replace(inputfolder,outputfolder));
              x,z = 32;
            }
            else {
              //check actual chunks
              if(chunk.value.Level.value.InhabitedTime.value[1]){
                let newRegion = new RegionFile(path.replace(inputfolder,outputfolder));
                await newRegion.initialize();
                newRegion.write(x,z,chunk);
              }
              else
              snapped++;
            }
          }
        }
    }
    console.log("Snapped %s Chunks in %s",snapped,folder);
  }
  return snapped;
}

async function getRegion(name) {
  region = new RegionFile(name);
  await region.initialize();
  return region;
}
