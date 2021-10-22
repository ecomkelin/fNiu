let fs = require('fs');
let path = require('path');


exports.deleteFile = (fileDel) => {
	if(fileDel) {
		fs.unlink(path.join(__dirname, '../../public' + fileDel), (err) => {
			if(err) {
				console.log(err);
				console.log('更新文件的时候, 可能会错误')
			}
		});
	}
}

exports.newFile = (req, res, next) => {
	try{
		const fileDir = req.body.fileDir;
		const suffixs = req.body.suffixs.split(',');
		const obj = req.body.obj;
		const key = req.body.key;
		const fileData = req.files.fileUpload;	// 文件数据
		console.log(req.files)
		if(!fileDir) return res.redirect('/error?info=newFile_前端参数传递不正确,fileDir错误');
		if(!suffixs) return res.redirect('/error?info=newFile_前端参数传递不正确,文件类型参数错误');
		if(!obj) return res.redirect('/error?info=newFile_前端参数传递不正确,主题obj参数错误');
		if(!fileData.originalFilename) return res.redirect('/error?info=newFile_前端参数传递不正确,file数据参数错误');

		const filePath = fileData.path;		// 文件的位置
		if(obj.orgFile && obj.orgFile.length > 30){
			this.deleteFile(obj.orgFile, fileDir);
		}
		fs.readFile(filePath, (err, data) => {
			const suffix = fileData.type.split('/')[1];		// 文件类型
			if(!suffixs.includes(suffix)) return res.redirect("/error?info=请选择: "+suffixs+" 文件");

			let fileNome = obj._id + '_' + Date.now() + '.' + suffix;	// 文件名称 code_2340.jpg
			let fileSrc = path.join(__dirname, '../../public/upload'+fileDir);	// niu/public/upload/***/
			let file = fileSrc + fileNome;
			fs.writeFile(file, data, (err) => {
				if(err) {console.log(err); return res.redirect('/error?info=文件写入错误, 请重试'); }
				obj[key] = '/upload'+fileDir+fileNome;
				// console.log(obj)
				next();
			});
		});
	} catch(error) {
		console.log(error);
		return res.redirect('/error?info=Middle_newFile_Error');
	}
}

// const cmpImg = require('compress-images');