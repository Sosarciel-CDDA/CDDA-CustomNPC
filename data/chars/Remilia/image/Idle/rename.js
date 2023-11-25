var fs = require('fs');


function fileSearch(floder,trait,fullPath){
    fullPath = fullPath||true;
    var outMap = {};
    var subFiles = fs.readdirSync(floder);
    for(var i=0;i<subFiles.length;i++){
        var subFile = subFiles[i];
        var subFilePath = floder+subFile;
        var stat = fs.lstatSync(floder+subFile);

        //判断是否是文件夹
        if(stat.isDirectory()){
            var subMap = fileSearch(subFilePath+"/",trait,fullPath);
            for(var key in subMap)
                outMap[key] = subMap[key]
            continue;
        }
        if(subFile.indexOf(trait)>-1)
            outMap[subFile] = subFilePath;
    }
    return outMap;
}

//读取文件
var flist = fileSearch("./",".png");
console.log(flist)

for(name in flist){
	let old_file_path = flist[name];
	let new_file_path = old_file_path.replace("abomination.sprite.combat_combat_beast_default_000","Idle_");
	fs.rename(old_file_path, new_file_path,function(){
		console.log(new_file_path+" 重命名完成")
	})
}