let fs = require('fs');
let path = require('path');
var cmpImg = require('compress-images');

let MiddlePicture = {
	deleteOldPhoto : function(orgPhoto, photoDir){
		if(orgPhoto != '/upload' + photoDir + '1.jpg') {
			fs.unlink(path.join(__dirname, '../../public' + orgPhoto), function(err) {
				if(err) console.log(err);
			});
		}
	},

	addNewPhoto : function(req, res, next) {
		let crUser = req.session.crUser;
		// console.log(crUser.firm)
		let obj = req.body.obj;
		let picName = crUser.firm.code+'_'+obj.code;
		let photoDir = obj.photoDir;
		// console.log(photoDir)
		let photoData = req.files.uploadPhoto;

		if(photoData && photoData.originalFilename) {
			let filePath = photoData.path;
			if(obj.orgPhoto){
				MiddlePicture.deleteOldPhoto(obj.orgPhoto, photoDir);
			}
			fs.readFile(filePath, function(err, data) {
				let type = photoData.type.split('/')[1];
				let timestamp = Date.now();
				let photoName = picName + '_' + timestamp + '.' + type;
				let cacheSrc = path.join(__dirname, '../../public/upload/'+photoDir);
				let orgPhotoCache = cacheSrc + photoName;
				fs.writeFile(orgPhotoCache, data, function(err){
					obj.photo = '/upload'+photoDir+photoName;
					next();
					// let photoPath = path.join(__dirname, '../../public/upload'+photoDir);
					// cmpImg(
					// 	cacheSrc+'*.{jpg,JPG,jpeg,JPEG,png,svg,gif}',
					// 	photoPath,
					// 	{compress_force: false, statistic: true, autoupdate: true},
					// 	false,
					// 	{jpg: {engine: 'mozjpeg', command: ['-quality', '10']}},
					// 	{png: {engine: 'pngquant', command: ['--quality=20-50']}},
					// 	{svg: {engine: 'svgo', command: '--multipass'}},
					// 	{gif: {engine: 'gifsicle', command: ['--colors', '64', '--use-col=web']}},
					// 	function(err, completed){
					// 		if(completed === true){
					// 		// Doing something.
					// 			fs.unlink(orgPhotoCache, function(err) { });
					// 			obj.photo = '/upload'+photoDir+photoName;
					// 			next();
					// 		}
					// 	}
					// );
				});
			});
		}
		else{
			next();
		}
	},
	addNewPhotoOrg : function(req, res, next) {
		let obj = req.body.obj;
		let picName = req.body.picName;			// 获取图片主要名称
		let photoDir = req.body.photoDir;		// 图片要储存的位置
		// console.log(photoDir)
		let photoData = req.files.uploadPhoto;	// 图片数据
		if(photoData && photoData.originalFilename && photoDir) {
			let filePath = photoData.path;		// 图片的位置
			if(obj && obj.orgPhoto){
				MiddlePicture.deleteOldPhoto(obj.orgPhoto, photoDir);
			}
			fs.readFile(filePath, function(err, data) {
				let type = photoData.type.split('/')[1];		// 图片类型
				let timestamp = Date.now();						// 时间戳
				let photoName = picName + '_' + timestamp + '.' + type;	// 图片名称 code_2340.jpg
				let photoSrc = path.join(__dirname, '../../public/upload/'+photoDir);	// niu/public/upload/***/
				let photo = photoSrc + photoName;
				fs.writeFile(photo, data, function(err){
					if(err) console.log(err);
					obj.photo = '/upload'+photoDir+photoName;
					next();
				});
			});
		}
		else{
			next();
		}
	},
	addNewPhotos : async(req, res, next) => {
		let obj = req.body.obj;
		let picName = req.body.picName;			// 获取图片主要名称
		let photoDir = req.body.photoDir;		// 图片要储存的位置
		if(!photoDir) return next();

		let photoDatas = req.files.uploadPics;	// 图片数据
		let imgObjs = new Array();
		if(photoDatas instanceof Array) {
			for(let i=0;  i<photoDatas.length; i++) {
				let photoData = photoDatas[i];
				let imgObj = await recuPics(photoData, picName, photoDir);
				imgObjs.push(imgObj)
			}
		} else {
			let photoData = photoDatas;
			if(photoData && photoData.originalFilename && photoDir) {
				let imgObj = await recuPics(photoData, picName, photoDir)
				imgObjs.push(imgObj)
			}
		}
		req.body.imgObjs = imgObjs;
		next();
	},
};
recuPics = (photoData, picName, photoDir) => {
	return new Promise((resolve, reject) => {
		const filePath = photoData.path;		// 图片的位置
		fs.readFile(filePath, function(err, data) {
			const type = photoData.type.split('/')[1];		// 图片类型
			const photoName = picName + '_' + Date.now() + '.' + type;	// 图片名称 code_2340.jpg
			const photoSrc = path.join(__dirname, '../../public/upload/'+photoDir);	// niu/public/upload/***/
			const photo = photoSrc + photoName;
			fs.writeFile(photo, data, function(err){
				if(err) console.log(err);
				resolve('/upload'+photoDir+photoName)
			});
		});
	})
}

module.exports = MiddlePicture;