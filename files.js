const fs = require('fs');

let regionfolders = [];

exports.init = async (inputfolder, outputfolder) => {

  //find or crate output folder
  try {
    const newWorld = await fs.readdirSync(outputfolder);

    //cancel if dir isnt empty
    if(newWorld.length){
      console.error(outputfolder+" is not empty!");
      return;
    }
  } catch (e) {
    //create dir
    fs.mkdir(outputfolder,()=>{});
  }

  try {
    //scan input folder
    await scanfolder(inputfolder,inputfolder,outputfolder);
  } catch (e) {
    console.log(e);
  }
  return regionfolders;
}

async function scanfolder(path,inputfolder,outputfolder){
  //dont create base output folder
  if(path!=inputfolder){
    fs.mkdirSync(path.replace(inputfolder, outputfolder));
  }

  //scan dir
  const dir = await fs.opendirSync(path);
  for await (const dirent of dir) {

    let dir_path = path+"/"+dirent.name
    if(dirent.isFile()){

      //detect region folders
      if(!regionfolders.includes(path) && dirent.name.endsWith('.mca')){
        regionfolders.push(path);
      }

      //copy other files
      else if(!dirent.name.endsWith('.mca')){
        fs.copyFileSync(dir_path, dir_path.replace(inputfolder,outputfolder));
      }

    }

    //scan sub folders
    else {
      await scanfolder(dir_path,inputfolder,outputfolder);
    }

  }
}
